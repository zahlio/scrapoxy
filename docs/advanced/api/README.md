![Scrapoxy](https://raw.githubusercontent.com/fabienvauchelles/scrapoxy/master/docs/logo.png)


# Control Scrapoxy with a REST API

## Table of contents

- [Endpoint](#endpoint)
- [Authentication](#authentication)
- [Instances](#instances)
    - [Get all instances](#get-all-instances)
    - [Stop an instance](#stop-an-instance)
- [Scaling](#scaling)
    - [Get the scaling](#get-the-scaling)
    - [Update the scaling](#update-the-scaling)
- [Configuration](#configuration)
    - [Get the configuration](#get-the-configuration)
    - [Update the configuration](#update-the-configuration)


## Endpoint

You can access to the commander API at *http://localhost:8889/api*


## Authentication

Every requests must have an Authorization header.

The value is the hash **base64** of the password set in the configuration (commander/password).


## Instances

### Get all instances

Request: 

```
GET http://localhost:8889/api/instances
```

Response (JSON):

**Status: 200**

The body contains all informations about instances.


### Stop an instance

Request: 

```
POST http://localhost:8889/api/instances/stop
```

JSON payload:

```
{
  "name": "<name of the proxy>"
}
```

Response (JSON):

**Status: 200**

The instance exists. 

Scrapoxy stops it. And the instance is restarted, with a new IP address.

he body contains the remaining count of alive instances.

```
{
  "alive": <count>
}
```


**Status: 404**

The instance does not exist.


## Scaling

### Get the scaling

Request: 

```
GET http://localhost:8889/api/scaling
```

Response (JSON):

**Status: 200**

The body contains all the configuration of the scaling.


### Update the scaling

Request: 

```
PATCH http://localhost:8889/api/scaling
```

JSON payload:

```
{
  "min": "min_scaling",
  "required": "required_scaling",
  "max": "max_scaling",
}
```

Response (JSON):

**Status: 200**

The scaling is updated.

**Status: 204**

The scaling is not updated.


## Configuration

### Get the configuration

Request: 

```
GET http://localhost:8889/api/config
```

Response (JSON):

**Status: 200**

The body contains all the configuration of Scrapoxy (including scaling).


### Update the configuration

Request: 

```
PATCH http://localhost:8889/api/config
```

JSON payload:

```
{
  "key_to_override": "<new_value>",
  "section": {
    "key2_to_override": "<new value>"
  }
}
```

Response (JSON):

**Status: 200**

The configuration is updated.

**Status: 204**

The configuration is not updated.
