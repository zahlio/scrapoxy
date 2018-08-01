=========
Changelog
=========


3.0.2
=====

Features
--------

- **domains**: manage whitelist or blacklist for urls (idea from Jonathan Wiklund)
- **docs**: add **ami-485fbba5** with type t2.micro


Bug fixes
---------

- **logs**: correct export path of logs
- **docs**: correct documentation
- **ssl**: add servername in the TLS connect (bug with HELLO)
- **pinger**: use reject instead of throw error (crash program). Thanks to Anis Gandoura !!!


3.0.1
=====

Features
--------

- **digitalocean**: support Digital Ocean tags on Droplets. Thanks to Ben Lavalley !!!


Bug fixes
---------

- **digitalocean**: use new image size (s-1vcpu-1gb instead of 512mb)


3.0.0
=====

Features
--------

.. WARNING::
    **BREAKING CHANGE!** The configuration of providers changes. See `documentation here <standard/config/index.html#configure-scrapoxy-vscale>`_.

- **providers**: uses multiple providers at a time
- **awsec2**: provider removes instances in batch every second (and no longer makes thousands of queries)
- **ovhcloud**: provider creates instances in batch (new API route used)


Bug fixes
---------

- **maxRunningInstances**: remove blocking parameters maxRunningInstances


2.4.3
=====

Bug fixes
---------

- **node**: change minimum version of Node.js to 8
- **dependencies**: upgrade dependencies to latest version


2.4.2
=====

Bug fixes
---------

- **useragent**: set useragent at instance creation, not at startup
- **instance**: force crashed instance to be removed


2.4.1
=====

Bug fixes
---------

- **instance**: correctly remove instance when instance is removed. Thanks to Étienne Corbillé!!!


2.4.0
=====

Features
--------

- **provider**: add `VScale.io`_ provider. Thanks to Hotrush!!!


Bug fixes
---------

- **proxy**: use a valid startup script for init.d. Thanks to Hotrush!!!
- **useragent**: change useragents with a fresh list for 2017


2.3.10
======

Features
--------

- **docs**: add **ami-06220275** with type t2.nano


Bug fixes
---------

- **instance**: remove listeners on instance alive status on instance removal. Thanks to Étienne Corbillé!!!


2.3.9
=====

Features
--------

- **digitalocean**: update Digital Ocean documentation
- **digitalocean**: view only instances from selected region
- **instances**: remove random instances instead of the last ones
- **pm2**: add kill_timeout option for PM2 (thanks to cp2587)


Bug fixes
---------

- **digitalocean**: limit the number of created instances at each API request
- **digitalocean**: don't remove locked instances


2.3.8
=====

Features
--------

- **docker**: create the Docker image fabienvauchelles/scrapoxy


Bug fixes
---------

- **template**: limit max instances to 2


2.3.7
=====

Features
--------

- **connect**: scrapoxy accepts now full HTTPS CONNECT method. It is useful for browser like PhantomJS_. Thanks to Anis Gandoura!!!


2.3.6
=====

Bug fixes
---------

- **template**: replace old AWS AMI by **ami-c74d0db4**


2.3.5
=====

Features
--------

- **instance**: change `Node.js`_ version to 6.x
- **ping**: use an HTTP ping instead a TCP ping.

**Please rebuild instance image.**


2.3.4
=====

Features
--------

- **stats**: monitor stop count history
- **stats**: add 3 more scales: 5m, 10m and 1h
- **logs**: normalize logs and add more informations
- **scaling**: pop a message when maximum number of instances is reached in a provider
- **scaling**: add quick scaling buttons
- **docs**: explain why Scrapoxy doesn't accept CONNECT mode
- **docs**: explain how User Agent is overwritten


Bug fixes
---------

- **dependencies**: upgrade dependencies
- **ovh**: monitor **DELETED** status
- **docs**: add example to test scrapoxy with credentials
- **commander**: manage twice instance remove


2.3.3
=====

Bug fixes
---------

- **master**: sanitize bad request headers
- **proxy**: catch all socket errors in the proxy instance


2.3.2
=====

Bug fixes
---------

- **docs**: fallback to markdown for README (because npmjs doesn't like retext)


2.3.1
=====

Features
--------

- **docs**: add tutorials for Scrapy_ and `Node.js`_


Bug fixes
---------

- **digitalocean**: convert Droplet id to string


2.3.0
=====

Features
--------

- **digitalocean**: add support for DigitalOcean provider


2.2.1
=====

Misc
----

- **config**: rename :code:`my-config.json` to :code:`conf.json`
- **doc**: migrate documentation to `ReadTheDocs`_
- **doc**: link to the new website `Scrapoxy.io`_


2.2.0
=====

Breaking changes
----------------

- **node**: node minimum version is now **4.2.1**, to support JS class


Features
--------

- **all**: migrate core and gui to **ES6**, with all best practices
- **api**: replace Express_ by Koa_


Bug fixes
---------

- **test**: correct core e2e test


2.1.2
=====

Bug fixes
---------

- **gui**: correct token encoding for GUI


2.1.1
=====

Bug fixes
---------

- **main**: add message when all instances are stopped (at end)
- **doc**: correct misc stuff in doc


2.1.0
=====

Features
--------

- **ovh**: add OVH_ provider with documentation
- **security**: add basic auth to Scrapoxy (RFC2617_)
- **stats**: add flow stats
- **stats**: add scale for stats (1m/1h/1d)
- **stats**: store stats on server
- **stats**: add globals stats
- **doc**: split of the documentation in 3 parts: quick start, standard usage and advanced usage
- **doc**: add tutorials for `AWS / EC2`_
- **gui**: add a scaling popup instead of direct edit (with integrity check)
- **gui**: add update popup when the status of an instance changes.
- **gui**: add error popup when GUI cannot retrieve data
- **logs**: write logs to disk
- **instance**: add cloud name
- **instance**: show instance IP
- **instance**: always terminate an instance when stopping (prefer terminate instead of stop/start)
- **test**: allow more than 8 requests (max 1000)
- **ec2**: force to terminate/recreate instance instead of stop/restart


Bug fixes
---------

- **gui**: emit event when scaling is changed by engine (before, event was triggered by GUI)
- **stability**: correct a lot of behavior to prevent instance cycling
- **ec2**: use status name instead of status code


2.0.1
=====

Features
--------

- **test**: specify the count of requests with the test command
- **test**: count the requests by IP in the test command
- **doc**: add GUI documentation
- **doc**: add API documentation
- **doc**: explain awake/asleep mode in user manual
- **log**: add human readable message at startup


2.0.0
=====

Breaking changes
----------------

- **commander**: API routes are prefixed with :code:`/api`


Features
--------

- **gui**: add GUI to control Scrapoxy
- **gui**: add statistics to the GUI (count of requests / minute, average delay of requests / minute)
- **doc**: add doc about HTTP headers


1.1.0
=====

Features
--------

- **commander**: stopping an instance returns the new count of instances
- **commander**: password is hashed with base64
- **commander**: read/write config with command (and live update of the scaling)


Misc
----

- **chore**: force global install with NPM


1.0.2
=====

Features
--------

- **doc**: add 2 `AWS / EC2`_ tutorials


Bug fixes
---------

- **template**: correct template mechanism
- **config**: correct absolute path for configuration


1.0.1
=====

Misc
----

- **doc**: change author and misc informations


1.0.0
=====

Features
--------

- **init**: start of the project


.. _`AWS / EC2`: https://aws.amazon.com/ec2
.. _Express: http://expressjs.com
.. _Koa: http://koajs.com
.. _OVH: https://www.ovh.com
.. _`ReadTheDocs`: http://scrapoxy.readthedocs.org
.. _RFC2617: https://www.ietf.org/rfc/rfc2617.txt
.. _`Scrapoxy.io`: http://scrapoxy.io
.. _Scrapy: http://scrapy.org
.. _`Node.js`: https://nodejs.org
.. _PhantomJS: http://phantomjs.org
.. _`VScale.io`: https://vscale.io
