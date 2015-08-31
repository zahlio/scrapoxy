![Scrapoxy](https://raw.githubusercontent.com/fabienvauchelles/scrapoxy/master/docs/logo.png)


# What is Scrapoxy ?

Scrapoxy is a **[proxy](https://en.wikipedia.org/wiki/Proxy_server) for [scrapers](https://en.wikipedia.org/wiki/Web_scraping)**.

You can crawl without thinking about hiding your IP address or avoiding IP blacklisting.

It is written in [Node.js](https://nodejs.org) and it is open source!


## How does Scrapoxy work ?

1. When Scrapoxy starts, it creates and manages a pool of proxies.
2. Your scraper uses Scrapoxy as a normal proxy. 
3. Scrapoxy routes all requests through a pool of proxies.

![Basic Arch](https://raw.githubusercontent.com/fabienvauchelles/scrapoxy/master/docs/basic_arch.jpg)


## What Scrapoxy does ?

- Create your own pool of proxies
- Route requests fairly (with round-robin by domain)
- Use standard User Agent (Chrome, Firefox and Safari)
- Rotate IP address
- Use multiple cloud platforms (in progress, done: AWS EC2)
- Control the pool from your scraper


## Why Scrapoxy doesn't support anti-blacklisting ?

Anti-blacklisting is a job for the scraper.

When the scraper detects blacklisting, it asks Scrapoxy to remove the proxy from the proxies pool (through a REST API).


## What is the best scraper framework to use with Scrapoxy ?

You could use [Scrapy framework](http://scrapy.org) ([Python](https://www.python.org)).


# Documentation

Look at the manuals:

- the [Quick Start Manual](docs/quick_start_manual/README.md);
- the [User Manual](docs/user_manual/README.md);
- the [Changelog](docs/CHANGELOG.md).

Look at the tutorials:

- AWS:
    - [Get credentials](docs/tutorials/aws/get_credentials/README.md)
    - [Create a security group](docs/tutorials/aws/create_security_group/README.md)
    - Create a proxy AMI (image) (TODO)
- Start Scrapoxy with PM2 (TODO)
- Create a Scrapy scraper with Scrapoxy (TODO)
- Create an anti-blacklisting middleware with Scrapy (TODO)


# Licence

See the [Licence](LICENCE.txt).


**And don't forget to be POLITE when you write your scrapers!**
