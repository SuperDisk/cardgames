(load "~/.sbclrc")
(ql:quickload :cardgame :silent t)
(in-package :preact)

(setf *build-mode* :prod)

(let ((forms (loop for form = (read *standard-input* nil nil)
                   while form
                   collect form)))
  (format t "~a" (apply #'ps:ps* forms))
  (format t "var __PS_MV_REG;"))
