![Scrapoxy](https://raw.githubusercontent.com/fabienvauchelles/scrapoxy/master/docs/logo.png)


# Quick Start

This tutorials works on AWS / EC2, with region **eu-west-1**.

See the [AW2 / EC2 - Get started](../standard/providers/awsec2/README.md#get-started) if you want to change region.


## Step 1: Install Node.js

See the [Node Installation Manual](https://github.com/nodesource/distributions).

The minimum required version is 4.2.1.


## Step 2: Install Scrapoxy from NPM

Install make:

```
sudo apt-get install build-essential
```

And Scrapoxy:

```
sudo npm install -g scrapoxy
```


## Step 3: Get AWS credentials

See [Get AWS credentials](../standard/providers/awsec2/get_credentials/README.md).


## Step 4: Create a security group

See [Create a security group](../standard/providers/awsec2/create_security_group/README.md).


## Step 5: Generate configuration

```
scrapoxy init conf.json
```


## Step 6: Edit configuration 

Edit *conf.json* and replace *accessKeyId*, *secretAccessKey*, *region* by your credentials and parameters.


## Step 6: Start Scrapoxy

```
scrapoxy start conf.json -d
```


## Step 7: Connect Scrapoxy to your scraper

Scrapoxy is reachable at *http://localhost:8888*


## Step 8: Test Scrapoxy

1. Wait 3 minutes
2. Test in a new terminal:

```
scrapoxy test http://localhost:8888
```

Or with cURL:

```
curl --proxy http://127.0.0.1:8888 http://api.ipify.org
```
