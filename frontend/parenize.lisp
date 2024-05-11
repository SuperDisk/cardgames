(load "~/.sbclrc")
(ql:quickload :cardgame :silent t)
(in-package :preact)

(let ((forms (loop for form = (read *standard-input* nil nil)
                   while form
                   collect form)))
  (format t "~a" (apply #'ps:ps* forms))
  (format t "var __PS_MV_REG;"))
