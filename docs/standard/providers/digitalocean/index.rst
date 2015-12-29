============
DigitalOcean
============


Get started
===========

Step 1: Get your DigitalOcean credentials
-----------------------------------------

See :doc:`Get DigitalOcean credentials <get_credentials/index>`.

Remember your *token*.


Step 3: Create a SSH key for the project
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
      "type": "digitalocean",

      "digitalocean": {
        "token": "YOUR PERSONAL TOKEN",
        "region": "YOUR REGION (could be: lon1)",
        "size": "512mb",
        "sshKeyName": "YOUR SSH KEY (could be: mykey)",
        "imageName": "YOUR SNAPSHOT NAME (could be: forward-proxy)"
      }
    }
  },

And update config with your parameters.


.. _configure-scrapoxy-digitalocean:

Configure Scrapoxy
==================

Options: digitalocean
---------------------

=================== ============= ===================================================================================================================================
Option              Default value Description
=================== ============= ===================================================================================================================================
token               none          Credentials for DigitalOcean
region              none          DigitalOcean region (example: lon1)
sshKeyName          none          Name of the SSH key
size                none          Type of droplet
name                Proxy         Name of the droplet
imageName           none          Name of the image (for the proxy droplet)
maxRunningInstances 10            It is a security limit. Scrapoxy cannot create new instances if the current count and the count of new instances exceeds this limit
=================== ============= ===================================================================================================================================


Tutorials
=========

.. toctree::
   :maxdepth: 1

   Get DigitalOcean credentials <get_credentials/index>
   Create SSH key <create_sshkey/index>
   Create a image <create_image/index>
