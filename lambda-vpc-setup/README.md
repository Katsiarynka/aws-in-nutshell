# Welcome to your CDK TypeScript project

The Lambda function executes in the AWS Lambda service's own managed VPC if it's not associated with account's VPC.
This AWS VPC is not shared with account resources but is managed by AWS and isolated from account' VPCs. It allows the Lambda function to connect to the internet and AWS public services without any additional configuration.

When you associate a Lambda function with your VPC, it can access your VPC's resources, such as databases, cache instances, or internal services running in your private subnets. However, by default, this Lambda function does not have internet access unless your VPC is configured to provide it (for example, through a NAT Gateway or NAT instance in a public subnet).

##VPC Endpoints:

VPC endpoints allow you to privately connect your VPC to supported AWS services without requiring an internet gateway, NAT device, VPN connection, or AWS Direct Connect connection.
They do not require the use of public IP addresses; traffic between your VPC and the other service does not leave the Amazon network.
VPC endpoints are mainly used when you want to ensure that the traffic to AWS services does not traverse the public internet for security or compliance reasons.
There are two types of VPC endpoints: Interface Endpoints (powered by AWS PrivateLink) and Gateway Endpoints. The former is used for a broader range of services, while the latter is specific to Amazon S3 and DynamoDB.

##Private Subnets with NAT and Elastic IP:

A private subnet with a route table configured to use a NAT Gateway or NAT instance with an Elastic IP allows instances within the subnet to initiate outbound traffic to the internet or other AWS services, but does not allow unsolicited inbound traffic.
This setup is generally used when you have instances that need outbound internet access for updates, patches, or to call external APIs, while still keeping them private and not directly accessible from the internet.
An Elastic IP (EIP) is a static, public IPv4 address, which you can associate with a NAT Gateway to maintain a consistent address for the outbound traffic.

##Comparison:

###Security: VPC endpoints generally offer better security because they do not require traffic to traverse the public internet.
###Cost: VPC endpoints may have a cost for the endpoint service and data processed through it, while NAT gateways also incur costs for the gateway itself and data transfer. However, NAT gateways with Elastic IPs have the additional cost of the Elastic IP when it is not associated with a running instance.
###Simplicity: VPC endpoints are usually easier and simpler to set up than managing NAT gateways and route tables.
###Use Case Specificity: If you need internet access or need to reach non-AWS services on the internet, you will need to use a NAT Gateway/NAT Instance with an Elastic IP. If you only need to connect to AWS services that support VPC endpoints, then using VPC endpoints is preferred.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template


