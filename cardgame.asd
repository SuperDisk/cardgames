;;;; cardgame.asd

(asdf:defsystem #:cardgame
  :description "Describe cardgame here"
  :author "Your Name <your.name@example.com>"
  :license  "Specify license here"
  :version "0.0.1"
  :serial t
  :depends-on (#:parenscript)
  :components ((:file "package")
               (:file "cardgame")
               (:file "preact")))
