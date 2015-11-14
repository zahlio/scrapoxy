![Scrapoxy](https://raw.githubusercontent.com/fabienvauchelles/scrapoxy/master/docs/logo.png)


# OVH Cloud

## Table of contents

- [Get started](#get-started)
- [Configure Scrapoxy](#configure-scrapoxy)
    - [Options: ovhcloud](#options-ovhcloud)
- [Tutorials](#tutorials)


## Get started

### Step 1: Get your OVH credentials

See [Get OVH credentials](get_credentials/README.md).

Remember your *Application Key*, *Application Secret* and *consumerKey*.


### Step 2: Create a project

See [Create a project](create_project/README.md).

Remember your *serviceId*.


### Step 3: Create a SSH key for the project

See [Create a SSH key](create_sshkey/README.md).

Remember your **SSH key name** (mykey).


### Step 4: Create a proxy image

See [Create a proxy image](create_image/README.md).

Remember your **image name** (forward-proxy).


### Step 5: Update configuration

Open *my-config.json*:

```
{
  "providers": {
    "type": "ovhcloud",

    "ovhcloud": {
      "endpoint": "YOUR ENDPOINT (could be: ovh-eu)",
      "appKey": "YOUR APP KEY",
      "appSecret": "YOUR APP SECRET",
      "consumerKey": "YOUR CONSUMERKEY",
      "serviceId": "YOUR SERVICEID",
      "region": "YOUR REGION (could be: BHS1, GRA1 or SBG1)",
      "sshKeyName": "YOUR SSH KEY (could be: mykey)",
      "flavorName": "vps-ssd-1",
      "snapshotName": "YOUR SNAPSHOT NAME (could be: forward-proxy)"
    }
  }
},
```

And update config with your parameters.


## Configure Scrapoxy

### Options: ovhcloud

For credentials, there is 2 choices:

| Option              | Default value | Description |
|---------------------|---------------|-------------|
| endpoint            | none          | OVH subdivision (ovh-eu or ovh-ca) |
| appKey              | none          | Credentials for OVH |
| appSecret           | none          | Credentials for OVH |
| consumerKey         | none          | Credentials for OVH |
| serviceId           | none          | Project ID |
| region              | none          | OVH region (example: GRA1) |
| sshKeyName          | none          | Name of the SSH key |
| flavorName          | none          | Type of instance |
| name                | Proxy         | Name of the instance |
| snapshotName        | none          | Name of the backup image (for the proxy instance) |


## Tutorials

* [Get OVH credentials](get_credentials/README.md)
* [Create a project](create_project/README.md)
* [Create a SSH key](create_sshkey/README.md)
* [Create a proxy image](create_image/README.md)