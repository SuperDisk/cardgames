(in-package #:preact)

(defpsmacro destructuring-binds (binds &rest code)
  (cond
    ((null binds) `(progn ,@code))
    (t
     (destructuring-bind (a b) (car binds)
       `(destructuring-bind ,a ,b
          (destructuring-binds ,(cdr binds) ,@code))))))

(defun hook-signature (binding)
  (destructuring-bind (vars (hook . args)) binding
    (format nil "~a{[~{~a~^, ~}]~@[(~a)~]}"
            (symbol-to-js-string hook)
            (mapcar #'symbol-to-js-string vars)
            (if (eq hook 'use-state)
                (car args)
                nil))))

(defun is-component (symbol)
  "Check if a symbol starts with a dash."
  (let ((name (symbol-name symbol)))
    (char= (char name 0) #\-)))

(defpsmacro fwrap (var &body body)
  `(funcall (lambda (,var) ,@body) ,var))

(defmacro+ps psx (element)
  (cond
    ((atom element) element)
    ((keywordp (car element))
     `((@ preact h) ,(if (is-component (car element))
                         (intern (string (car element)))
                         (symbol-to-js-string (car element)))
       (ps:create ,@(loop for (key val) in (cadr element)
                       append (list key val)))
       ,@(loop for child in (cddr element)
               collect `(psx ,child))))
    (t element)))

(defpsmacro defcomponent (name hooks params &rest code)
  (let ((hook-names (loop for (bindings (hook . args)) in hooks
                          collect hook)))
    (declare (ignore hook-names))
    `(let ((s (|$RefreshSig$|)))
       (defun ,name ,params
         (s)
         (destructuring-binds ,(loop for (bindings (hook . args)) in hooks
                                     collect `(,bindings ((@ preact-hooks ,hook) . ,args)))
           ,@code))
       (s ,name
          ,(format nil "~{~a~^~%~}" (mapcar #'hook-signature hooks))
         #+nil false
         #+nil (lambda () (list ,@hook-names)))
       (|$RefreshReg$| ,name ,(symbol-to-js-string name))
       (flush-updates))))
