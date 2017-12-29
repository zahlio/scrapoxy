======
Vscale
======

Vscale is a **russian** cloud platform, like DigitalOcean.

.. note::
    IP addresses are updated every hour. If the instances are restarted too quickly, they will have the same IP address.


Get started
===========

Step 1: Get your Vscale credentials
-----------------------------------

See :doc:`Get Vscale credentials <get_credentials/index>`.

Remember your *token*.


Step 2: Create a SSH key for the project
----------------------------------------

See :doc:`Create a SSH key <create_sshkey/index>`.

Remember your **SSH key name** (mykey).


Step 3: Create an image
-----------------------

See :doc:`Create an image <create_image/index>`.

Remember your **image name** (forward-proxy).


Step 4: Update configuration
----------------------------

Open :code:`conf.json`::

  {
    "providers": {
      "type": "vscale",
      "vscale": {
        "token": "YOUR PERSONAL TOKEN",
        "region": "YOUR REGION (could be: msk0, spb0)",
        "name": "YOUR SERVER NAME",
        "sshKeyName": "YOUR SSH KEY (could be: mykey)",
        "plan": "YOUR PLAN (could be: small)"
      }
    }
  },

And update config with your parameters.


.. _configure-scrapoxy-vscale:

Configure Scrapoxy
==================

Options: vscale
---------------

=================== ============= ===================================================================================================================================
Option              Default value Description
=================== ============= ===================================================================================================================================
token               none          Credentials for Vscale
region              none          Vscale region (example: msk0, spb0)
sshKeyName          none          Name of the SSH key
plan                none          Type of plan (example: small)
name                Proxy         Name of the scalet
imageName           none          Name of the image (for the proxy scalet)
=================== ============= ===================================================================================================================================


Tutorials
=========

.. toctree::
   :maxdepth: 1

   Get Vscale credentials <get_credentials/index>
   Create SSH key <create_sshkey/index>
   Create a image <create_image/index>
