(load "~/.sbclrc")
(ql:quickload :cardgame :silent t)
(in-package :preact)

(if (> (length sb-ext:*posix-argv*) 1)
    (setf *build-mode* (intern (cadr sb-ext:*posix-argv*) :keyword))
    (setf *build-mode* :prod))

(let ((forms (loop for form = (read *standard-input* nil nil)
                   while form
                   collect form)))
  (format t "~a" (apply #'ps:ps* forms))
  (format t "var __PS_MV_REG;"))
