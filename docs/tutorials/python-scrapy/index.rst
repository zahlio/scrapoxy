============================
Integrate Scrapoxy to Scrapy
============================


Goal
====

Is it easy to find a good Python developer on Paris ? **No**!

So, it's time to build a **scraper** with Scrapy_ to find our perfect profile.

The site `Scraping Challenge`_ indexes a lot of **profiles** (fake, for demo purposes). We want to grab them and create a **CSV file**.

However, the site is **protected** against scraping ! We must use Scrapoxy_ to bypass the protection.


Step 1: Install Scrapy
======================

Install Python 2.7
------------------

Scrapy works with Python 2.7


Install dependencies
--------------------

On Ubuntu::

    apt-get install python-dev libxml2-dev libxslt1-dev libffi-dev


On Windows (with Babun_)::

    wget https://bootstrap.pypa.io/ez_setup.py -O - | python
    easy_install pip
    pact install libffi-devel libxml2-devel libxslt-devel


Install Scrapy and Scrapoxy connector
-------------------------------------

::

    pip install scrapy scrapoxy



Step 2: Create the scraper myscraper
====================================

Create a new project
--------------------

Bootstrap the skeleton of the project::

    scrapy startproject myscraper
    cd myscraper


Add a new spider
----------------

Add this content to :code:`myscraper/spiders/scraper.py`::

    # -*- coding: utf-8 -*-

    from scrapy import Request, Spider

    class Scraper(Spider):
        name = u'scraper'

        def start_requests(self):
            """This is our first request to grab all the urls of the profiles.
            """
            yield Request(
                url=u'http://scraping-challenge-2.herokuapp.com',
                callback=self.parse,
            )

        def parse(self, response):
            """We have all the urls of the profiles. Let's make a request for each profile.
            """
            urls = response.xpath(u'//a/@href').extract()
            for url in urls:
                yield Request(
                    url=response.urljoin(url),
                    callback=self.parse_profile,
                )

        def parse_profile(self, response):
            """We have a profile. Let's extract the name
            """
            name_el = response.css(u'.profile-info-name::text').extract()
            if len(name_el) > 0:
                yield {
                    'name': name_el[0]
                }


If you want to learn more about Scrapy_, check on this Tutorial_.


Run the spider
--------------

Let's try our new scraper!

Run this command::

    scrapy crawl scraper -o profiles.csv


Scrapy scraps the site and extract profiles to :code:`profiles.csv`.

However, `Scraping Challenge`_ is protected! :code:`profiles.csv` is empty...

We will **integrate** Scrapoxy_ to bypass the protection.


Step 3: Integrate Scrapoxy to the Scrapy
========================================

Install Scrapoxy
----------------

See :doc:`../../quick_start/index` to install Scrapoxy_.


Start Scrapoxy
--------------

Set the **maximum** of instances to 6, and start Scrapoxy_ (see `Change scaling with GUI <../../standard/gui/index.html#scaling>`_).


.. WARNING::
   Don't forget to set the maximum of instances!


Edit settings of the Scraper
----------------------------

Add this content to :code:`myscraper/settings.py`::

    CONCURRENT_REQUESTS_PER_DOMAIN = 1
    RETRY_TIMES = 0

    # SCRAPOXY
    PROXY = 'http://127.0.0.1:8888/?noconnect'
    API_SCRAPOXY = 'http://127.0.0.1:8889/api'
    API_SCRAPOXY_PASSWORD = 'CHANGE_THIS_PASSWORD'

    DOWNLOADER_MIDDLEWARES = {
        'scrapoxy.downloadmiddlewares.proxy.ProxyMiddleware': 100,
        'scrapoxy.downloadmiddlewares.wait.WaitMiddleware': 101,
        'scrapoxy.downloadmiddlewares.scale.ScaleMiddleware': 102,
        'scrapy.downloadermiddlewares.httpproxy.HttpProxyMiddleware': None,
    }


.. WARNING::
   Don't forget to change the password!


What are these middlewares ?

* **ProxyMiddleware** relays requests to Scrapoxy_. It is an helper to set the PROXY parameter.
* **WaitMiddleware** stops the scraper and waits for Scrapoxy_ to be ready.
* **ScaleMiddleware** asks Scrapoxy_ to maximize the number of instances at the beginning, and to stop them at the end.


.. NOTE::
   ScaleMiddleware stops the scraper like WaitMiddleware. After 2 minutes, all instances are ready and the scraper continues to scrap.



Run the spider
--------------

Run this command::

    scrapy crawl scraper -o profiles.csv


Now, all profiles are saved to :code:`profiles.csv`!


.. _Scrapy: http://scrapy.org
.. _`Scraping Challenge`: http://scraping-challenge-2.herokuapp.com
.. _Scrapoxy: http://scrapoxy.io
.. _Babun: http://babun.github.io
.. _Tutorial: http://doc.scrapy.org/en/latest/intro/tutorial.html
