#!/bin/sh

case "$1" in
  start)
  nohup node /root/proxy.js &
  ;;
*)
  echo "Usage: /etc/init.d/proxyup {start}"
  exit 1
  ;;
esac

exit 0
