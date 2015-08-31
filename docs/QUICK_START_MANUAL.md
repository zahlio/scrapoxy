![Scrapoxy](https://raw.githubusercontent.com/fabienvauchelles/scrapoxy/master/docs/logo.png)


# Quick Start Manual

## Step 1: Install Node.js

See the [Node Installation Manual](https://github.com/nodejs/node-v0.x-archive/wiki/installing-Node.js-via-package-manager).


## Step 2: Install Scrapoxy from NPM

```
$ npm install -g scrapoxy
```


## Step 3: Create a security group on AWS EC2

To use the default AMI:

1. Go to your AWS console
2. Go to EC2 dashboard
3. Click on 'Security Groups'
4. Click on 'Create Security Group'
5. Fill the name and the description with 'forward-proxy'
6. Add an Inbound rule with Type='Custom TCP Rule', Port Range=3128, Source=Anywhere


## Step 4: Generate configuration

```
$ scrapoxy init my-config.js
```

## Step 5: Edit configuration 

Edit *my-config.js*:

Replace *region* by your AWS region (see the [list of regions](http://docs.aws.amazon.com/general/latest/gr/rande.html)).

Replace *SecurityGroups* by your security group (from step 3).


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


