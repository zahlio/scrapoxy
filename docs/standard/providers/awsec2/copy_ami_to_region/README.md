![Scrapoxy](https://raw.githubusercontent.com/fabienvauchelles/scrapoxy/master/docs/logo.png)


# Tutorial: AWS / EC2 - Copy an AMI from a region to another

AMI (and security groups) are restricted to a region. 

A AMI in eu-west-1 is not available in eu-central-1.

You must create an AMI by region.


## Step 1: Connect to your AWS console

Go to [AWS console](https://console.aws.amazon.com).


## Step 2: Connect to Ireland region

![region](https://raw.githubusercontent.com/fabienvauchelles/scrapoxy/master/docs/standard/providers/awsec2/change_region.jpg)


## Step 3: Go to EC2 dashboard
 
![step_1](https://raw.githubusercontent.com/fabienvauchelles/scrapoxy/master/docs/standard/providers/awsec2/create_security_group/step_1.jpg)


## Step 4: Find the public AMI
 
1. Click on 'AMIs'
2. Search 'ami-1aa0ea6d'

![step_1](https://raw.githubusercontent.com/fabienvauchelles/scrapoxy/master/docs/standard/providers/awsec2/copy_ami_to_region/step_1.jpg)


## Step 5: Open copy AMI wizard

1. Right click on instance
2. Click on 'Copy AMI'

![step_2](https://raw.githubusercontent.com/fabienvauchelles/scrapoxy/master/docs/standard/providers/awsec2/copy_ami_to_region/step_2.jpg)


## Step 5: Start AMI copy

1. Choose the new destination region
2. Click on 'Copy AMI'

![step_3](https://raw.githubusercontent.com/fabienvauchelles/scrapoxy/master/docs/standard/providers/awsec2/copy_ami_to_region/step_3.jpg)


## Step 6: Connect to the new region

![step_3](https://raw.githubusercontent.com/fabienvauchelles/scrapoxy/master/docs/standard/providers/awsec2/copy_ami_to_region/step_4.jpg)


## Step 7: Find the new AMI ID
 
The new AMI ID is in the column 'AMI ID'.

![step_4](https://raw.githubusercontent.com/fabienvauchelles/scrapoxy/master/docs/standard/providers/awsec2/copy_ami_to_region/step_5.jpg)
