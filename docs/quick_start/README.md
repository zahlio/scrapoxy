![Scrapoxy](https://raw.githubusercontent.com/fabienvauchelles/scrapoxy/master/docs/logo.png)


# Quick Start

This tutorials works on AWS / EC2, with region **eu-west-1**.

See the [AW2 / EC2 - Get started](../standard/providers/awsec2/README.md#get-started) if you want to change region.


## Step 1: Install Node.js

See the [Node Installation Manual](https://github.com/nodejs/node-v0.x-archive/wiki/installing-Node.js-via-package-manager).


## Step 2: Install Scrapoxy from NPM

```
sudo apt-get install build-essential
```

If it doesn't work, you can try:

```
sudo npm install -g scrapoxy
```


## Step 3: Get AWS credentials

See [Get AWS credentials](../standard/providers/awsec2/get_credentials/README.md).


## Step 4: Create a security group

See [Create a security group](../standard/providers/awsec2/create_security_group/README.md).


## Step 5: Generate configuration

```
scrapoxy init my-config.json
```


## Step 6: Edit configuration 

Edit *my-config.json* and replace *accessKeyId* and *secretAccessKey* by your credentials.


## Step 6: Start Scrapoxy

```
scrapoxy start my-config.json -d
```


## Step 7: Connect Scrapoxy to your scraper

Scrapoxy is reachable at *http://localhost:8888*


## Step 8: Test Scrapoxy

1. Wait 3 minutes
2. Test in a new terminal:

```
scrapoxy test http://localhost:8888
```
