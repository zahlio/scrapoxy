![Scrapoxy](https://raw.githubusercontent.com/fabienvauchelles/scrapoxy/master/docs/logo.png)


# Secure Scrapoxy

## Table of contents

- [Secure Scrapoxy with Basic auth](#secure-scrapoxy-with-basic-auth)
- [Secure Scrapoxy with a firewall on Ubuntu](#secure-scrapoxy-with-a-firewall-on-ubuntu)


## Secure Scrapoxy with Basic auth

Scrapoxy supports standard HTTP Basic auth (RFC2617).

### Step 1: Add username and password in configuration

Open *conf.json* and add *auth* section in *proxy* section (see [Configuration](../../standard/config/README.md#options-proxy--auth)):

```
{
   "proxy": {
      "auth": {
         "username": "myuser",
         "password": "mypassword"
      }
   }
} 
```


### Step 2: Add username and password to the scraper
 
Configure your scraper to use username and password:

The URL is: ```http://myuser:mypassword@localhost:8888```

(replace *myuser* and *mypassword* with your credentials).


## Secure Scrapoxy with a firewall on Ubuntu

[UFW](https://wiki.ubuntu.com/UncomplicatedFirewall) simplifies IPTables on Ubuntu (>14.04).

### Step 1: Allow SSH

```
sudo ufw allow ssh
```

### Step 2: Allow Scrapoxy

```
sudo ufw allow tcp/8888
sudo ufw allow tcp/8889
```

### Step 3: Enable UFW

```
sudo ufw enable
```

Enter 'y'.


### Step 4: Check UFW status and rules

```
sudo ufw status
```
