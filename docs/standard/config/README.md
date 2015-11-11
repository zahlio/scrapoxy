![Scrapoxy](https://raw.githubusercontent.com/fabienvauchelles/scrapoxy/master/docs/logo.png)


# Configure Scrapoxy

## Table of contents

- [Create configuration](#create-configuration)
- [Options: commander](#options-commander)
- [Options: instance](#options-instance)
- [Options: instance / autorestart](#options-instance--autorestart)
- [Options: instance / scaling](#options-instance--scaling)
- [Options: logs](#options-logs)
- [Options: providers](#options-providers)
- [Options: proxy](#options-proxy)
- [Options: proxy / auth](#options-proxy--auth)
- [Options: stats](#options-stats)


## Create configuration

To create a new configuration, use:

```
$ scrapoxy init my-config.json
```

## Options: commander

| Option              | Default value | Description |
|---------------------|---------------|-------------|
| port                | 8889          | TCP port of the REST API |
| password            | none          | Password to access to the commander |



## Options: instance

| Option              | Default value | Description |
|---------------------|---------------|-------------|
| port                | none          | TCP port of your instance (example: 3128) |
| username            | none          | Credentials if your proxy instance needs them (optional) |
| password            | none          | Credentials if your proxy instance needs them (optional) |
| maxRunningInstances | none          | It is a security limit. Scrapoxy cannot create new instances if the current count and the count of new instances exceeds this limit |
| scaling             | none          | see [instance / scaling](#options-instance--scaling) |
| checkDelay          | 10000         | (in ms) Scrapoxy requests the status of instances to the provider, every X ms |
| checkAliveDelay     | 20000         | (in ms) Scrapoxy pings instances every X ms |
| stopIfCrashedDelay  | 120000        | (in ms) Scrapoxy restarts an instance if it has been dead for X ms |
| autorestart         | none          | see [instance / autorestart](#options-instance--autorestart) |


## Options: instance / autorestart

Scrapoxy randomly restarts instance to change the IP address.

The delay is between minDelay and maxDelay.

| Option              | Default value | Description |
|---------------------|---------------|-------------|
| minDelay            | 3600000       | (in ms) Minimum delay |
| maxDelay            | 43200000      | (in ms) Maximum delay |


## Options: instance / scaling

| Option              | Default value | Description |
|---------------------|---------------|-------------|
| min                 | none          | The desired count of instances when Scrapoxy is asleep |
| max                 | none          | The desired count of instances when Scrapoxy is awake |
| required            | none          | The count of actual instances |
| downscaleDelay      | 600000        | (in ms) Time to wait to remove unused instances when Scrapoxy is not in use |


## Options: logs

| Option              | Default value | Description |
|---------------------|---------------|-------------|
| path                | none          | If specified, writes all logs in a dated file |


## Options: providers

| Option              | Default value | Description |
|---------------------|---------------|-------------|
| type                | 8888          | Name of the used provider (awsec2 or ovhcloud) |
| awsec2              | none          | see [AWS / EC2 - Configuration](../providers/awsec2/README.md#configure-scrapoxy) |
| ovhcloud            | none          | see [OVH Cloud - Configuration](../providers/ovhcloud/README.md#configure-scrapoxy) |


## Options: proxy

| Option              | Default value | Description |
|---------------------|---------------|-------------|
| port                | 8888          | TCP port of Scrapoxy |
| auth                | none          | see [proxy / auth](#options-proxy--auth) (optional) |


## Options: proxy / auth

| Option              | Default value | Description |
|---------------------|---------------|-------------|
| username            | none          | Credentials if your Scrapoxy needs them |
| password            | none          | Credentials if your Scrapoxy needs them |


## Options: stats

| Option              | Default value | Description |
|---------------------|---------------|-------------|
| retention           | 86400000      | (in ms) Duration of statistics retention |
| samplingDelay       | 1000          | (in ms) Get stats every X ms |
