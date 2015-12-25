================================
Control Scrapoxy with a REST API
================================


Endpoint
========

You can access to the commander API at http://localhost:8889/api


Authentication
==============

Every requests must have an Authorization header.

The value is the hash **base64** of the password set in the configuration (commander/password).


Instances
=========

Get all instances
-----------------

Request
~~~~~~~

::

    GET http://localhost:8889/api/instances


Response (JSON)
~~~~~~~~~~~~~~~

**Status: 200**

The body contains all informations about instances.

Example:

.. code-block:: js

    const request = require('request');

    const password = 'YOUR_COMMANDER_PASSWORD';

    const opts = {
        method: 'GET',
        url: 'http://localhost:8889/api/instances',
        headers: {
            'Authorization': new Buffer(password).toString('base64'),
        },
    };
    
    request(opts, (err, res, body) => {
        if (err) return console.log('Error: ', err);
    
        console.log('Status: %d\n\n', res.statusCode);
    
        const bodyParsed = JSON.parse(body);
    
        console.log(bodyParsed);
    });


Stop an instance
----------------

Request
~~~~~~~

::

    POST http://localhost:8889/api/instances/stop

JSON payload::

    {
      "name": "<name of the proxy>"
    }

Response (JSON)
~~~~~~~~~~~~~~~

**Status: 200**

The instance exists. 

Scrapoxy stops it. And the instance is restarted, with a new IP address.

The body contains the remaining count of alive instances.

::

    {
      "alive": <count>
    }


**Status: 404**

The instance does not exist.


Example:

.. code-block:: js

    const request = require('request');
    
    const password = 'YOUR_COMMANDER_PASSWORD',
        instanceName = 'YOUR INSTANCE NAME';
    
    const opts = {
        method: 'POST',
        url: 'http://localhost:8889/api/instances/stop',
        json: {
            name: instanceName,
        },
        headers: {
            'Authorization': new Buffer(password).toString('base64'),
        },
    };
    
    request(opts, (err, res, body) => {
        if (err) return console.log('Error: ', err);
    
        console.log('Status: %d\n\n', res.statusCode);
    
        console.log(body);
    });


Scaling
=======

Get the scaling
---------------

Request
~~~~~~~

::

    GET http://localhost:8889/api/scaling


Response (JSON)
~~~~~~~~~~~~~~~

**Status: 200**

The body contains all the configuration of the scaling.


Example:

.. code-block:: js

    const request = require('request');
    
    const password = 'YOUR_COMMANDER_PASSWORD';
    
    const opts = {
        method: 'GET',
        url: 'http://localhost:8889/api/scaling',
        headers: {
            'Authorization': new Buffer(password).toString('base64'),
        },
    };
    
    request(opts, (err, res, body) => {
        if (err) return console.log('Error: ', err);
    
        console.log('Status: %d\n\n', res.statusCode);
    
        const bodyParsed = JSON.parse(body);
    
        console.log(bodyParsed);
    });


Update the scaling
------------------

Request
~~~~~~~

::

    PATCH http://localhost:8889/api/scaling


JSON payload::

    {
      "min": "min_scaling",
      "required": "required_scaling",
      "max": "max_scaling",
    }

Response (JSON)
~~~~~~~~~~~~~~~

**Status: 200**

The scaling is updated.

**Status: 204**

The scaling is not updated.


Example:

.. code-block:: js

    const request = require('request');
    
    const password = 'YOUR_COMMANDER_PASSWORD';
    
    const opts = {
        method: 'PATCH',
        url: 'http://localhost:8889/api/scaling',
        json: {
            min: 1,
            required: 5,
            max: 10,
        },
        headers: {
            'Authorization': new Buffer(password).toString('base64'),
        },
    };
    
    request(opts, (err, res, body) => {
        if (err) return console.log('Error: ', err);
    
        console.log('Status: %d\n\n', res.statusCode);
    
        console.log(body);
    });


Configuration
=============

Get the configuration
---------------------

Request
~~~~~~~

::

    GET http://localhost:8889/api/config


Response (JSON)
~~~~~~~~~~~~~~~

**Status: 200**

The body contains all the configuration of Scrapoxy (including scaling).


Example:

.. code-block:: js

    const request = require('request');
    
    const password = 'YOUR_COMMANDER_PASSWORD';
    
    const opts = {
        method: 'GET',
        url: 'http://localhost:8889/api/config',
        headers: {
            'Authorization': new Buffer(password).toString('base64'),
        },
    };
    
    request(opts, (err, res, body) => {
        if (err) return console.log('Error: ', err);
    
        console.log('Status: %d\n\n', res.statusCode);
    
        const bodyParsed = JSON.parse(body);
    
        console.log(bodyParsed);
    });


Update the configuration
------------------------

Request
~~~~~~~

::

    PATCH http://localhost:8889/api/config


JSON payload::

    {
      "key_to_override": "<new_value>",
      "section": {
        "key2_to_override": "<new value>"
      }
    }

Response (JSON)
~~~~~~~~~~~~~~~

**Status: 200**

The configuration is updated.

**Status: 204**

The configuration is not updated.


Example:

.. code-block:: js

    const request = require('request');
    
    const password = 'YOUR_COMMANDER_PASSWORD';
    
    const opts = {
        method: 'PATCH',
        url: 'http://localhost:8889/api/config',
        json: {
            instance: {
                scaling: {
                    max: 300,
                },
            },
        },
        headers: {
            'Authorization': new Buffer(password).toString('base64'),
        },
    };
    
    request(opts, (err, res, body) => {
        if (err) return console.log('Error: ', err);
    
        console.log('Status: %d\n\n', res.statusCode);
    
        console.log(body);
    });
