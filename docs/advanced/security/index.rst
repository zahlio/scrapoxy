===============
Secure Scrapoxy
===============


Secure Scrapoxy with Basic auth
===============================

Scrapoxy supports standard HTTP Basic auth (RFC2617_).


Step 1: Add username and password in configuration
--------------------------------------------------


Open :code:`conf.json` and add *auth* section in *proxy* section (see :doc:`../../standard/config/index`):

::

   {
      "proxy": {
         "auth": {
            "username": "myuser",
            "password": "mypassword"
         }
      }
   } 


Step 2: Add username and password to the scraper
------------------------------------------------
 
Configure your scraper to use *username* and *password*:

The URL is: http://myuser:mypassword@localhost:8888

(replace *myuser* and *mypassword* with your credentials).


Secure Scrapoxy with a firewall on Ubuntu
=========================================

UFW_ simplifies IPTables on Ubuntu (>14.04).


Step 1: Allow SSH
-----------------

::

   sudo ufw allow ssh


Step 2: Allow Scrapoxy
----------------------

::

   sudo ufw allow tcp/8888
   sudo ufw allow tcp/8889


Step 3: Enable UFW
------------------

::

   sudo ufw enable

Enter *y*.


Step 4: Check UFW status and rules
----------------------------------

::

   sudo ufw status


.. _RFC2617: https://www.ietf.org/rfc/rfc2617.txt
.. _UFW: https://wiki.ubuntu.com/UncomplicatedFirewall