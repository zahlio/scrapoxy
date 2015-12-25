===========
Quick Start
===========


This tutorials works on `AWS / EC2`_, with region **eu-west-1**.

See the :doc:`AWS / EC2 - Get started <../standard/providers/awsec2/index>` if you want to change region.


Step 1: Install Node.js
=======================

See the `Node Installation Manual`_.

The minimum required version is 4.2.1.


Step 2: Install Scrapoxy from NPM
=================================

Install make:

::

    sudo apt-get install build-essential


And Scrapoxy:

::

    sudo npm install -g scrapoxy


Step 3: Get AWS credentials
===========================

See :doc:`Get AWS credentials <../standard/providers/awsec2/get_credentials/index>`.


Step 4: Create a security group
===============================

See :doc:`Create a security group <../standard/providers/awsec2/create_security_group/index>`.


Step 5: Generate configuration
==============================

::

    scrapoxy init conf.json


Step 6: Edit configuration 
==========================

Edit :code:`conf.json` and replace *accessKeyId*, *secretAccessKey*, *region* by your credentials and parameters.


Step 7: Start Scrapoxy
======================

::

    scrapoxy start conf.json -d


Step 8: Connect Scrapoxy to your scraper
========================================

Scrapoxy is reachable at http://localhost:8888


Step 9: Test Scrapoxy
=====================

1. Wait 3 minutes
2. Test Scrapoxy in a new terminal with::

    scrapoxy test http://localhost:8888


3. Or with cURL::

    curl --proxy http://127.0.0.1:8888 http://api.ipify.org


.. _`AWS / EC2`: https://aws.amazon.com/ec2
.. _`Node Installation Manual`: https://github.com/nodesource/distributions
