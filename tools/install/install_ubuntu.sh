#!/bin/sh

# Install NodeJS
curl --silent --location https://deb.nodesource.com/setup_0.12 | bash -
apt-get install --yes nodejs

# Install proxy
curl https://gist.githubusercontent.com/fabienvauchelles/41ed9142368bff9ba796/raw/505f6037cf2f6496552cd912b321fdf2faed9842/proxy.js > /root/proxy.js

# Install at startup
curl https://gist.githubusercontent.com/fabienvauchelles/41ed9142368bff9ba796/raw/505f6037cf2f6496552cd912b321fdf2faed9842/proxyup.sh > /etc/init.d/proxyup.sh
chmod a+x /etc/init.d/proxyup.sh
update-rc.d proxyup.sh defaults
