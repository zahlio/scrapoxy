===================
Understand Scrapoxy
===================


Architecture
============

Scrapoxy consists of 4 parts:

- the **master**, which routes requests to proxies;
- the **manager**, which starts and stops proxies;
- the **commander**, which provides a REST API to receive orders;
- the **gui**, which connects to the REST API.

.. image:: global_arch.jpg

When Scrapoxy starts, the **manager** starts a new instance (if necessary), on the cloud.

When the scraper sends a HTTP request, the manager starts all others proxies.


Instances management
====================

How does the monitoring mechanism ?
-----------------------------------

1. the manager asks the cloud how many instances are alive. It is the **initial state**;
2. the manager creates a **target state**, with the new count of instance;
3. the manager generates the commands to reach **target state** from the **initial state**;
4. the manager sends the commands to the cloud.

.. warning::
    These steps are very important because you cannot guess which is the initial state.
    Because an instance may be dead!

Scrapoxy can restart an instance if:

- the instance is **dead** (stop status or no ping);
- the **living limit** is reached: Scrapoxy regulary restarts the instance to change the IP address.


Do you need to create a VM image ?
----------------------------------

By default, we provide you an AMI proxy instance on `AWS / EC2`_. This is a CONNECT proxy opened on TCP port 3128.

But you can use every software which accept the CONNECT method (Squid_, Tinyproxy_, etc.).


Can you leave Scrapoxy started ?
--------------------------------

Yes. Scrapoxy has 2 modes: an **awake mode** and an **asleep mode**.

.. image:: asleep-awake.png

When Scrapoxy receives no request after a while, he falls asleep.
It sets the count of instances to minimum (**instance.scaling.min**).

When Scrapoxy receives a request, it wakes up.
It fixes the count of instances to maximum (**instance.scaling.max**).

.. note::
    Scrapoxy needs at least 1 instance to receive the awake request.


Requests
========

Do Scrapoxy can proxy HTTPS requests ?
--------------------------------------

Yes. However, Scrapoxy **cannot use the CONNECT** mechanism.

The scraper must send a HTTP request with an HTTPS URL in the *Location* header.

Example::

    GET /index.html
    Host: localhost:8888
    Location: https://www.google.com/index.html
    Accept: text/html


What is the proxy that returned the response ?
----------------------------------------------
 
Scrapoxy adds to the response an HTTP header **x-cache-proxyname**.
 
This header contains the name of the proxy.


Can the scraper force the request to go through a specific proxy?
-----------------------------------------------------------------

Yes. The scraper adds the proxy name in the header **x-cache-proxyname**.

When the scraper receives a response, this header is extracted.
The scraper adds this header to the next request.


.. _`AWS / EC2`: https://aws.amazon.com/ec2
.. _Squid: http://www.squid-cache.org
.. _Tinyproxy: https://banu.com/tinyproxy/
