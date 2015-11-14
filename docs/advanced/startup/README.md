![Scrapoxy](https://raw.githubusercontent.com/fabienvauchelles/scrapoxy/master/docs/logo.png)


# Launch Scrapoxy at startup

## Prerequise

Scrapoxy is installed with a valid configuration (see [QUICK_START](../../quick_start/README.md)).


## Step 1: Install PM2

```
$ sudo npm install -g pm2
```


## Step 2: Launch PM2 at instance startup

```
$ sudo pm2 startup ubuntu -u <YOUR USERNAME>
```

1. Replace *ubuntu* by your distribution name (see [PM2 documentation](http://pm2.keymetrics.io/docs/usage/startup/)).
2. Replace YOUR USERNAME by your Linux username


## Step 3: Create a PM2 configuration

Create a PM2 configuration file *scrapoxy.json5* for Scrapoxy:

```
{
  apps : [
    {
      name      : "scrapoxy",
      script    : "/usr/bin/scrapoxy",
      args      : ["start", "<ABSOLUTE PATH TO CONFIG>/my-config.json", "-d"],
    },
  ],
}
```


## Step 4: Start configuration

```
$ pm2 start scrapoxy.json5
```


## Step 5: Save configuration

```
$ pm2 save
```


## Step 6: Stop PM2 (optional)

If you need to stop Scrapoxy in PM2:

```
$ pm2 stop scrapoxy.json5
```

Warning: PM2 doesn't kill properly instances. You must delete manually.