![Scrapoxy](https://raw.githubusercontent.com/fabienvauchelles/scrapoxy/master/docs/logo.png)


# Changelog

## 2.2.0

### Breaking changes

- **node**: node minimum version is now 4.2.1, to support JS class


### Features

- **all**: migrate core and gui to ES6, with all best practices
- **api**: replace express by koa


### Bug fixes

- **test**: correct core e2e test


## 2.1.2

### Bug fixes

- **gui**: correct token encoding for GUI


## 2.1.1

### Bug fixes

- **main**: add message when all instances are stopped (at end)
- **doc**: correct misc stuff in doc


## 2.1.0

### Features

- **ovh**: add OVH provider with documentation
- **security**: add basic auth to Scrapoxy (RFC 2617)
- **stats**: add flow stats
- **stats**: add scale for stats (1m/1h/1d)
- **stats**: store stats on server
- **stats**: add globals stats
- **doc**: split of the documentation in 3 parts: quick start, standard usage and advanced usage
- **doc**: add tutorials for AWS / EC2
- **gui**: add a scaling popup instead of direct edit (with integrity check)
- **gui**: add update popup when the status of an instance changes.
- **gui**: add error popup when GUI cannot retrieve data
- **logs**: write logs to disk
- **instance**: add cloud name
- **instance**: show instance IP
- **instance**: always terminate an instance when stopping (prefer terminate instead of stop/start)
- **test**: allow more than 8 requests (max 1000)
- **ec2**: force to terminate/recreate instance instead of stop/restart


### Bug fixes

- **gui**: emit event when scaling is changed by engine (before, event was triggered by GUI)  
- **stability**: correct a lot of behavior to prevent instance cycling
- **ec2**: use status name instead of status code


## 2.0.1

### Features

- **test**: specify the count of requests with the test command 
- **test**: count the requests by IP in the test command
- **doc**: add GUI documentation
- **doc**: add API documentation
- **doc**: explain awake/asleep mode in user manual
- **log**: add human readable message at startup


## 2.0.0

### Breaking changes

- **commander**: API routes are prefixed with '/api'


### Features

- **gui**: add GUI to control Scrapoxy
- **gui**: add statistics to the GUI (count of requests / minute, average delay of requests / minute)
- **doc**: add doc about HTTP headers


## 1.1.0

### Features

- **commander**: stopping an instance returns the new count of instances
- **commander**: password is hashed with base64
- **commander**: read/write config with command (and live update of the scaling)


### Misc

- **chore**: force global install with NPM


## 1.0.2

### Features

- **doc**: add 2 AWS tutorials


### Bug fixes

- **template**: correct template mechanism
- **config**: correct absolute path for configuration


## 1.0.1

### Misc

- **doc**: change author and misc informations


## 1.0.0

### Features

- **init**: start of the project
