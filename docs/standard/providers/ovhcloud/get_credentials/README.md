![Scrapoxy](https://raw.githubusercontent.com/fabienvauchelles/scrapoxy/master/docs/logo.png)


# Tutorial: OVH Cloud - Get credentials

## Step 1: Create an API Application

1. Go on https://eu.api.ovh.com/createApp/
2. Enter ID and password
3. Add a name name (e.g.: scrapoxy-12)
4. Add a description (e.g.: scrapoxy)
5. Click on 'Create keys'

![step_1](https://raw.githubusercontent.com/fabienvauchelles/scrapoxy/master/docs/standard/providers/ovhcloud/get_credentials/step_1.jpg)


## Step 2: Save application credentials

Remember 'Application Key' and 'Application Secret'

![step_1](https://raw.githubusercontent.com/fabienvauchelles/scrapoxy/master/docs/standard/providers/ovhcloud/get_credentials/step_2.jpg)


## Step 3: Get the consumerKey

Use Scrapoxy to get your key: 

```
scrapoxy ovh-consumerkey <endpoint> <Application Key> <Application Secret>
```

Endpoints are :

* **ovh-eu** for OVH Europe
* **ovh-ca** for OVH North-America

Remember 'consumerKey' and click on URL to validate key.
