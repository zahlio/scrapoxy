![Scrapoxy](https://raw.githubusercontent.com/fabienvauchelles/scrapoxy/master/docs/logo.png)


# User Manual

## Table of contents

- [Understand Scrapoxy](#understand-scrapoxy)
    - [Architecture](#architecture)
    - [Instances management](#instances-management)
    - [Requests](#requests)
- [Configuration](#configuration)
    - [Create configuration](#create-configuration)
    - [Options: Commander](#options-commander)
    - [Options: EC2](#options-ec2)
    - [Options: EC2 / Instance](#options-ec2--instance)
    - [Options: Instance](#options-instance)
    - [Options: Instance / Autorestart](#options-instance--autorestart)
    - [Options: Instance / Scaling](#options-instance--scaling)
    - [Options: Proxy](#options-proxy)
- [Control Scrapoxy with a GUI](#control-scrapoxy-with-a-gui)
- [Control Scrapoxy with a REST API](#control-scrapoxy-with-a-rest-api)


## Understand Scrapoxy

### Architecture

![Global Arch](https://raw.githubusercontent.com/fabienvauchelles/scrapoxy/master/docs/user_manual/global_arch.jpg)

Scrapoxy consists of 4 parts:

- the **master**, which routes requests to proxies;
- the **manager**, which starts and stops proxies;
- the **commander**, which provides a REST API to receive orders;
- the **gui**, which coneccts to the REST API.

When Scrapoxy starts, the **manager** starts a new instance (if necessary), on the cloud.

When the scraper sends a HTTP request, the manager starts all others proxies.


### Instances management

#### How does the monitoring mechanism ?

1. the manager asks the cloud how many instances are alive. It is the **initial state**.
2. the manager creates a **target state**, with the new count of instance.
3. the manager generates the commands to reach **target state** from the **initial state**.
4. the manager sends the commands to the cloud.
 
These steps are very important because you cannot guess which is the initial state. 
An instance may be dead or Amazon can stop an instance...

Scrapoxy can restart an instance if:

- the instance is dead (stop status or no ping)
- the living limit is reached: Scrapoxy regulary restarts the instance to change the IP address.


#### Do you need to create an AMI (EC2 image) ?

By default, we provide you an AMI proxy instance. This is a CONNECT proxy opened on TCP port 3128.

But you can use every software which accept the CONNECT method (Squid, Tinyproxy, etc.).


#### Can you leave Scrapoxy started ?

![aa](https://raw.githubusercontent.com/fabienvauchelles/scrapoxy/master/docs/user_manual/asleep-awake.png)

Yes. Scrapoxy has 2 modes: an **awake mode** and an **asleep mode**.

When Scrapoxy receives no request after a while, he falls asleep.
It sets the count of instances to minimum (**instance.scaling.min**).

When Scrapoxy receives a request, it wakes up.
It fixes the count of instances to maximum (**instance.scaling.max**).

Note: Scrapoxy needs at least 1 instance to receive the awake request.


### Requests

#### Do Scrapoxy can proxy HTTPS requests ?

Yes. However, Scrapoxy cannot use the CONNECT mechanism.

The scraper must send a HTTP request with an HTTPS URL in the *Location* header.

Example:

```
GET /index.html
Host: localhost:8888
Location: https://www.google.com/index.html
Accept: text/html
```

#### What is the proxy that returned the response ?
 
Scrapoxy adds to the response an HTTP header **x-cache-proxyname**.
 
This header contains the name of the proxy.



#### Can the scraper force the request to go through a specific proxy?

Yes. The scraper adds the proxy name in the header **x-cache-proxyname**.

When the scraper receives a response, this header is extracted.
The scraper adds this header to the next request.


## Configuration

### Create configuration

To create a new configuration, use:

```
$ scrapoxy init my-config.json
```


### Options: Commander

| Option              | Default value | Description |
|---------------------|---------------|-------------|
| port                | 8889          | TCP port of the REST API |
| password            | none          | Password to access to the commander |


### Options: EC2

For credentials, there is 2 choices:

1. Add credentials in the configuration file;
2. Or Use your own credentials (from profile, see http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-configuring.html)

| Option              | Default value | Description |
|---------------------|---------------|-------------|
| accessKeyId         | none          | Credentials for AWS (optional) |
| secretAccessKey     | none          | Credentials for AWS (optional) |
| region              | none          | AWS region (example: eu-west-1) |
| instance            | none          | see [EC2 / Instance](#options-ec2--instance) |


### Options: EC2 / Instance

Options are specific to AWS EC2.

Scrapoxy use the method *[runInstances](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#runInstances-property)* to create new instances.

Standard options are *InstanceType*, *ImageId* and *SecurityGroups*.


### Options: Instance

| Option              | Default value | Description |
|---------------------|---------------|-------------|
| port                | none          | TCP port of your instance (example: 3128) |
| username            | none          | Credentials if your proxy instance needs them (optional) |
| password            | none          | Credentials if your proxy instance needs them (optional) |
| maxRunningInstances | none          | It is a security limit. Scrapoxy cannot create new instances if the current count and the count of new instances exceeds this limit |
| scaling             | none          | see [Instance / Scaling](#options-instance--scaling) |
| checkDelay          | 10000         | (in ms) Scrapoxy requests the status of instances to the cloud, every X ms |
| checkAliveDelay     | 20000         | (in ms) Scrapoxy pings instances every X ms |
| stopIfCrashedDelay  | 120000        | (in ms) Scrapoxy restarts an instance if it has been dead for X ms |
| autorestart         | none          | see [Instance / Autorestart](#options-instance--autorestart) |


### Options: Instance / Autorestart

Scrapoxy randomly restarts instance to change the IP address.

The delay is between mindelay and maxdelay.

| Option              | Default value | Description |
|---------------------|---------------|-------------|
| mindelay            | 3600000       | (in ms) Minimum delay |
| maxdelay            | 43200000      | (in ms) Maximum delay |


### Options: Instance / Scaling

| Option              | Default value | Description |
|---------------------|---------------|-------------|
| min                 | none          | The desired count of instances when Scrapoxy is asleep |
| max                 | none          | The desired count of instances when Scrapoxy is awake |
| required            | none          | The count of actual instances |
| downscaleDelay      | 600000        | (in ms) Time to wait to remove unused instances when Scrapoxy is not in use |


### Options: Proxy

| Option              | Default value | Description |
|---------------------|---------------|-------------|
| port                | 8888          | TCP port of Scrapoxy |


## Control Scrapoxy with a GUI

See [GUI Manual](../gui_manual/README.md).


## Control Scrapoxy with a REST API

See [API Manual](../api_manual/README.md).
