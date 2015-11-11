#!/bin/sh

# Install NodeJS
curl --silent --location https://deb.nodesource.com/setup_0.12 | bash -
apt-get install --yes nodejs

# Install proxy
curl https://raw.githubusercontent.com/fabienvauchelles/scrapoxy/master/tools/install/proxy.js > /root/proxy.js

# Install at startup
curl https://raw.githubusercontent.com/fabienvauchelles/scrapoxy/master/tools/install/proxyup.sh > /etc/init.d/proxyup.sh
chmod a+x /etc/init.d/proxyup.sh
update-rc.d proxyup.sh defaults
