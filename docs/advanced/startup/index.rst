==========================
Launch Scrapoxy at startup
==========================


Prerequise
==========

Scrapoxy is installed with a valid configuration (see :doc:`../../quick_start/index`).


Step 1: Install PM2
===================

::

  sudo npm install -g pm2


Step 2: Launch PM2 at instance startup
======================================

::

  sudo pm2 startup ubuntu -u <YOUR USERNAME>


1. Replace *ubuntu* by your distribution name (see `PM2 documentation`_).
2. Replace YOUR USERNAME by your Linux username


Step 3: Create a PM2 configuration
==================================

Create a PM2 configuration file :code:`scrapoxy.json5` for Scrapoxy:

.. code-block:: js

  {
    apps : [
      {
        name         : "scrapoxy",
        script       : "/usr/bin/scrapoxy",
        args         : ["start", "<ABSOLUTE PATH TO CONFIG>/conf.json", "-d"],
        kill_timeout : 30000,
      },
    ],
  }


Step 4: Start configuration
===========================

.. code-block:: js

  pm2 start scrapoxy.json5


Step 5: Save configuration
==========================

.. code-block:: js

  pm2 save


Step 6: Stop PM2 (optional)
===========================

If you need to stop Scrapoxy in PM2:

.. code-block:: js

  pm2 stop scrapoxy.json5


.. _`PM2 documentation`: http://pm2.keymetrics.io/docs/usage/startup/
