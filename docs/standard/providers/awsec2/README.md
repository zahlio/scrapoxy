![Scrapoxy](https://raw.githubusercontent.com/fabienvauchelles/scrapoxy/master/docs/logo.png)


# AWS / EC2

## Table of contents

- [Get started](#get-started)
- [Configure Scrapoxy](#configure-scrapoxy)
    - [Options: awsec2](#options-awsec2)
    - [Options: awsec2 / instance](#options-awsec2--instance)
- [Tutorials](#tutorials)


## Get started

### Step 1: Get your AWS credentials

See [Get AWS credentials](get_credentials/README.md).

Remember your *Access Key* and *Secret Access Key*.


### Step 2: Connect to your region

![region](https://raw.githubusercontent.com/fabienvauchelles/scrapoxy/master/docs/standard/providers/awsec2/change_region.jpg)


### Step 3: Create a security group
 
See [Create a security group](create_security_group/README.md).


### Step 4: Choose an AMI

Public AMI are available for theses regions:

* eu-west-1: i-2d7b465a


If you cannot find your region, you can [Copy an AMI from a region to another](copy_ami_to_region/README.md).


### Step 5: Update configuration

Open *conf.json*:

```
{
  "providers": {
    "type": "awsec2",
    
    "awsec2": {
      "region": "eu-west-1",
      "instance": {
        "InstanceType": "t1.micro",
        "ImageId": "ami-2d7b465a",
        "SecurityGroups": [ "forward-proxy" ],
      }
    }
  }
}
```

And update *region* and *ImageId* with your parameters.


## Configure Scrapoxy

### Options: awsec2

For credentials, there is 2 choices:

1. Add credentials in the configuration file;
2. Or Use your own credentials (from profile, see the [AWS documentation](http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-configuring.html)).

| Option              | Default value | Description |
|---------------------|---------------|-------------|
| accessKeyId         | none          | Credentials for AWS (optional) |
| secretAccessKey     | none          | Credentials for AWS (optional) |
| region              | none          | AWS region (example: eu-west-1) |
| tag                 | Proxy         | Name of the AWS / EC2 instance |
| instance            | none          | see [awsec2 / instance](#options-awsec2--instance) |


### Options: awsec2 / instance

Options are specific to AWS / EC2.

Scrapoxy use the method *[runInstances](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#runInstances-property)* to create new instances.

Standard options are *InstanceType*, *ImageId*, *KeyName*, and *SecurityGroups*.


## Tutorials

* [Get AWS credentials](get_credentials/README.md)
* [Create a security group](create_security_group/README.md)
* [Copy an AMI from a region to another](copy_ami_to_region/README.md)
