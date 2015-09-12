![Scrapoxy](https://raw.githubusercontent.com/fabienvauchelles/scrapoxy/master/docs/logo.png)


# Changelog

## 2.0.1

## Features

- **test**: specify the count of requests with the test command 
- **test**: count the requests by IP in the test command
- **doc**: add GUI documentation
- **doc**: add API documentation
- **doc**: explain awake/asleep mode in user manual
- **log**: add human readable message at startup


## 2.0.0

### Breaking changes

- **commander**: API routes are prefixed with '/api'

## Features

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