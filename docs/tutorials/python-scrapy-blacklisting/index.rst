======================================
Manage blacklisted request with Scrapy
======================================


Goal
====

A scraper is downloading pages of a website.

However, the website has a rate limit by IP.
When the scraper downloads 10 pages, the website returns only empty page with a HTTP 429 status.

Does the scraper must wait when the limit is reached ? **No**!

The scraper has to ask Scrapoxy to replace the instance.


Step 1: Create a Scraper
========================

See :doc:`../python-scrapy/index` to create the scraper.


Step 2: Detect blacklisted response with a middleware
=====================================================

Create a middleware in Scrapy
-----------------------------

Add this content to :code:`myscraper/middlewares.py`::

    # -*- coding: utf-8 -*-

    from scrapy.exceptions import IgnoreRequest
    from scrapoxy.commander import Commander

    import logging
    import random
    import time

    logger = logging.getLogger(__name__)

    class BlacklistDownloaderMiddleware(object):

        def __init__(self, crawler):
            """Access the settings of the crawler to connect to Scrapoxy.
            """
            self._commander = Commander(
                crawler.settings.get('API_SCRAPOXY'),
                crawler.settings.get('API_SCRAPOXY_PASSWORD')
            )

        @classmethod
        def from_crawler(cls, crawler):
            """Call constructor with crawler parameters
            return cls(crawler)


        def process_response(self, request, response, spider):
            """Detect blacklisted response and stop the instance if necessary.
            """
            if response.status != 429:
                # No blacklisted response is detected
                return response

            # Find the instance name
            name = response.headers.get(u'x-cache-proxyname')
            if not name:
                logger.error(u'Cannot find instance name in headers')
                raise IgnoreRequest()

            # Stop the instance
            alive = self._commander.stop_instance(name)
            if alive < 0:
                logger.error(u'Remove: cannot find instance %s', name)
            elif alive == 0:
                logger.warn(u'Remove: instance removed (no instance remaining)')
            else:
                logger.debug(u'Remove: instance removed (%d instances remaining)', alive)

            # Sleep to avoid overhead on other instances
            delay = random.randrange(90, 180)
            logger.info(u'Sleeping %d seconds', delay)
            time.sleep(delay)

            raise IgnoreRequest()


Why the scraper must sleep when the instance is restarted ?

When a instance is restarted, the scraper must sleep a little.

Let's take an example: if Scrapoxy has 2 instances and you stop one,
the remaining instance will relay 2x more requests, and will be blacklisted.


Edit settings of Scrapoxy
-------------------------

Add this content to :code:`myscraper/settings.py`::

    # SCRAPOXY
    API_SCRAPOXY = 'http://127.0.0.1:8889/api'
    API_SCRAPOXY_PASSWORD = 'CHANGE_THIS_PASSWORD'


.. WARNING::
    Don't forget to change the password!


Edit settings of the Scraper
----------------------------

Change the password of the commander in :code:`my-config.json`::

    "commander": {
        "password": "CHANGE_THIS_PASSWORD"
    },


.. WARNING::
    Don't forget to change the password!
