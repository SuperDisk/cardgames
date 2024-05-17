(in-package #:preact)

(defparameter *build-mode* :dev)

(defmacro+ps destructuring-binds (binds &rest code)
  (cond
    ((null binds) `(progn ,@code))
    (t
     (destructuring-bind (a b) (car binds)
       (if (atom a)
           `(let ((,a ,b))
              (destructuring-binds ,(cdr binds) ,@code))
           `(destructuring-bind ,a ,b
              (destructuring-binds ,(cdr binds) ,@code)))))))

(defun hook-signature (binding)
  (destructuring-bind (vars (hook . args)) binding
    (format nil "~a{[~{~a~^, ~}]~@[(~a)~]}"
            (symbol-to-js-string hook)
            (if (atom vars) (list (symbol-to-js-string vars))
                (mapcar #'symbol-to-js-string vars))
            (if (eq hook 'use-state)
                (car args)
                nil))))

(defun is-component (symbol)
  "Check if a symbol starts with a dash."
  (let ((name (symbol-name symbol)))
    (char= (char name 0) #\-)))

(defun is-builtin-hook (hook)
  (member hook
          '(use-error-boundary
            use-state
            use-reducer
            use-effect
            use-layout-effect
            use-memo
            use-callback
            use-ref
            use-context
            use-imperative-methods
            use-debug-value)))

(defmacro+ps fwrap (vars &body body)
  `(funcall (lambda ,vars ,@body) ,@vars))

(defmacro+ps psx (&rest elements)
  `(list
    ,@(loop for el in elements
            collect `(psx-one ,el))))

(defmacro+ps psx-one (element)
  (cond
    ((atom element) element)
    ((keywordp (car element))
     (destructuring-bind (el attrs . body) element
       `((@ preact h) ,(if (is-component el)
                           (intern (string el))
                           (symbol-to-js-string el))
         ,(loop for (key value) in attrs
                if (eq key :...) collect value into spreads
                  else append (list key value) into non-spreads
                finally (return `((@ -object assign)
                                  (create ,@non-spreads)
                                  ,@spreads)))
         ,@(loop for child in body
                 collect `(psx ,child)))))
    (t element)))

(defmacro+ps when-dev-let (bindings &rest forms)
  (if (eq *build-mode* :dev)
      `(let ,bindings ,@forms)
      `(progn ,@forms)))

(defmacro+ps when-dev (&rest forms)
  (when (eq *build-mode* :dev)
    `(progn ,@forms)))

(defmacro+ps when-prod (&rest forms)
  (when (eq *build-mode* :prod)
      `(progn ,@forms)))

(defmacro+ps defcomponent (name hooks params &rest code)
  (let ((hook-names (loop for (bindings (hook . args)) in hooks
                          when (not (is-builtin-hook hook))
                            collect hook)))
    (declare (ignorable hook-names))
    `(when-dev-let ((s (|$RefreshSig$|)))
       (defun ,name ,params
         (when-dev (s))
         (destructuring-binds
          ,(loop for (bindings (hook . args)) in hooks collect
                 `(,bindings (,(if (is-builtin-hook hook)
                                   `(@ preact-hooks ,hook)
                                   hook) . ,args)))
          ,@code))
       (when-dev
         (s ,name
            ,(format nil "~{~a~^~%~}" (mapcar #'hook-signature hooks))
            false
            (lambda () (list ,@hook-names)))
         (|$RefreshReg$| ,name ,(symbol-to-js-string name))
         (flush-updates)))))

(defmacro+ps js-import (stuff obj)
  `(progn
     ,@(loop for thing in stuff
             collect `(var ,thing (@ ,obj ,thing)))))
