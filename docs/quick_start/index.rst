===========
Quick Start
===========


This tutorials works on `AWS / EC2`_, with region **eu-west-1**.

See the :doc:`AWS / EC2 - Get started <../standard/providers/awsec2/copy_ami_to_region/index>` if you want to change region.


Step 1: Get AWS credentials
===========================

See :doc:`Get AWS credentials <../standard/providers/awsec2/get_credentials/index>`.


Step 2: Create a security group
===============================

See :doc:`Create a security group <../standard/providers/awsec2/create_security_group/index>`.


Step 3A: Run Scrapoxy with Docker
=================================

Run the container:

::

    sudo docker run -e COMMANDER_PASSWORD='CHANGE_THIS_PASSWORD' \
        -e PROVIDERS_AWSEC2_ACCESSKEYID='YOUR ACCESS KEY ID' \
        -e PROVIDERS_AWSEC2_SECRETACCESSKEY='YOUR SECRET ACCESS KEY' \
        -it -p 8888:8888 -p 8889:8889 fabienvauchelles/scrapoxy

.. WARN::
    Replace *PROVIDERS_AWSEC2_ACCESSKEYID* and *PROVIDERS_AWSEC2_SECRETACCESSKEY* by your AWS credentials and parameters.


Step 3B: Run Scrapoxy without Docker
====================================

Install Node.js
---------------

See the `Node Installation Manual`_.

The minimum required version is 4.2.1.


Install Scrapoxy from NPM
-------------------------

Install make:

::

    sudo apt-get install build-essential


And Scrapoxy:

::

    sudo npm install -g scrapoxy


Generate configuration
----------------------

::

    scrapoxy init conf.json


Edit configuration
------------------

1. Edit :code:`conf.json`
2. In the *commander* section, replace *password* by a password of your choice
3. In the *providers/awsec2* section, replace *accessKeyId*, *secretAccessKey* and *region* by your AWS credentials and parameters.


Start Scrapoxy
--------------

::

    scrapoxy start conf.json -d


Step 4: Open Scrapoxy GUI
=========================

Scrapoxy GUI is reachable at http://localhost:8889

.. INFO::
    Use the password added in the *commander* section.


Step 5: Connect Scrapoxy to your scraper
========================================

Scrapoxy is reachable at http://localhost:8888


Step 6: Test Scrapoxy
=====================

1. Wait 3 minutes
2. Test Scrapoxy in a new terminal with::

    scrapoxy test http://localhost:8888


3. Or with cURL::

    curl --proxy http://127.0.0.1:8888 http://api.ipify.org


.. _`AWS / EC2`: https://aws.amazon.com/ec2
.. _`Node Installation Manual`: https://github.com/nodesource/distributions
