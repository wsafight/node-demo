# mysql 安全性问题

MySQL 8.0 以下的版本会出现； innodb 的自增ID，会在服务重启后，自动设置为记录中最大ID + 1。

