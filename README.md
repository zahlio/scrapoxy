![Scrapoxy](https://raw.githubusercontent.com/fabienvauchelles/scrapoxy/master/docs/logo.png)


# What is Scrapoxy ?

[https://github.com/fabienvauchelles/scrapoxy](https://github.com/fabienvauchelles/scrapoxy)

Scrapoxy is a **[proxy](https://en.wikipedia.org/wiki/Proxy_server) for [scrapers](https://en.wikipedia.org/wiki/Web_scraping)**.

You can crawl without thinking about hiding your IP address or avoiding IP blacklisting.

It is written in [Node.js](https://nodejs.org), [AngularJS](https://angularjs.org) and it is open source!


## How does Scrapoxy work ?

1. When Scrapoxy starts, it creates and manages a pool of proxies.
2. Your scraper uses Scrapoxy as a normal proxy. 
3. Scrapoxy routes all requests through a pool of proxies.

![Basic Arch](https://raw.githubusercontent.com/fabienvauchelles/scrapoxy/master/docs/basic_arch.jpg)


## What Scrapoxy does ?

- Create your own pool of proxies
- Route requests to proxies (a new request is sent to the next proxy)
- Use standard User Agent (Chrome, Firefox and Safari)
- Rotate IP address
- Use multiple providers platforms (AWS, OVH)
- Control the instances from your scraper with a REST API
- Optimize the scraping through statistics (like count of requests per minutes)


## Why Scrapoxy doesn't support anti-blacklisting ?

Anti-blacklisting is a job for the scraper.

When the scraper detects blacklisting, it asks Scrapoxy to remove the proxy from the proxies pool (through a REST API).


## What is the best scraper framework to use with Scrapoxy ?

You could use [Scrapy framework](http://scrapy.org) ([Python](https://www.python.org)).


# Documentation

You can begin with the [QUICK START](docs/quick_start/README.md) or look at the [CHANGELOG](CHANGELOG.md).

Now, you can continue with:

- [Configure Scrapoxy](docs/standard/config/README.md)
- Add Providers
    - [AWS/EC2](docs/standard/providers/awsec2/README.md)
    - [OVH Cloud](docs/standard/providers/ovhcloud/README.md)
- [Manage Scrapoxy with a GUI](docs/standard/gui/README.md)

And become an expert with:

- [Understand Scrapoxy](docs/advanced/understand/README.md)
- [Control Scrapoxy with a REST API](docs/advanced/api/README.md)
- [Secure Scrapoxy](docs/advanced/security/README.md)
- [Launch Scrapoxy at startup](docs/advanced/startup/README.md)

You can complete with tutorials:

- [Create a scraper with Scrapy and Scrapoxy](docs/tutorials/scrapy/README.md)


# Contribute

You can open an issue on this repository for any feedback (bug, question, request, pull request, etc.).


# Licence

See the [Licence](LICENCE.txt).


**And don't forget to be POLITE when you write your scrapers!**
