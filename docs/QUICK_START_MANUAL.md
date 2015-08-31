![Scrapoxy](https://raw.githubusercontent.com/fabienvauchelles/scrapoxy/master/docs/logo.png)


# Quick Start Manual

## Step 1: Install Node.js

See the [Node Installation Manual](https://github.com/nodejs/node-v0.x-archive/wiki/installing-Node.js-via-package-manager).


## Step 2: Install Scrapoxy from NPM

```
$ npm install -g scrapoxy
```


## Step 3: Get AWS credentials

See [Get AWS credentials](tutorials/aws/get_credentials/index.md).


## Step 4: Create a security group

To use the default AMI, create a security group named 'forward-proxy' with port TCP/3128. 

See [Create a security group](tutorials/aws/create_security_group/index.md).


## Step 5: Generate configuration

```
$ scrapoxy init my-config.js
```


## Step 6: Edit configuration 

Edit *my-config.js*:

1. Replace *accessKeyId* and *secretAccessKey* by your credentials;
2. Replace *region* by your AWS region (see the [list of regions](http://docs.aws.amazon.com/general/latest/gr/rande.html)).


## Step 6: Start Scrapoxy

```
$ scrapoxy start my-config.js
```


## Step 7: Connect Scrapoxy to your scraper

Scrapoxy is reachable at *http://localhost:8888*


## Step 8: Test Scrapoxy

1. Wait 3 minutes
2. Test in a new terminal:

```
$ scrapoxy test http://localhost:8888
```
