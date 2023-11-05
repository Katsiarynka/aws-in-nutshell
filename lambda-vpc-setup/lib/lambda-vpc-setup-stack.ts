import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from  'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';


export class LambdaVpcSetupStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = ec2.Vpc.fromLookup(this, `default-VPC`, { isDefault: true });

    const privateSubnet = new ec2.PrivateSubnet(this, 'VpcSetupFunctionPrivateSubnet', {
      availabilityZone: vpc.availabilityZones[0], 
      vpcId: vpc.vpcId,
      cidrBlock: '172.31.112.0/20', 
    });

    const eipalloc = new ec2.CfnEIP(this, 'VpcSetupFunctionEIP', {
      domain: 'vpc',
    });

    // Create a NAT gateway in the public subnet
    const natGateway = new ec2.CfnNatGateway(this, 'VpcSetupFunctionNatGateway', {
      allocationId: eipalloc.attrAllocationId, 
      subnetId: vpc.publicSubnets[0].subnetId, 
    });

    // Add a route table entry for the private subnet to use the NAT gateway
    privateSubnet.addRoute('PrivateSubnetRoute', {
      routerId: natGateway.ref,
      routerType: ec2.RouterType.NAT_GATEWAY,
    });


   const securityGroup = new ec2.SecurityGroup(this, 'VpcSetupFunctionSecurityGroup', {
     vpc: vpc,
     allowAllOutbound: true,
     description: 'Security Group for VpcSetupFunction',
     securityGroupName: 'VpcSetupFunctionSG',
   });

    const lambdaRole = new iam.Role(this, 'LambdaExecutionRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });
    lambdaRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaVPCAccessExecutionRole'));

    const anotherRole = new iam.Role(this, 'AnotherRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });
    lambdaRole.addToPolicy(new iam.PolicyStatement({
      actions: ['sts:AssumeRole'],
      resources: [anotherRole.roleArn],
    }));
    const lambdaFunction = new lambda.Function(this, 'VpcSetupFunction', {
      runtime: lambda.Runtime.PYTHON_3_11, 
      code: lambda.Code.fromAsset('lambdas/vpc-access-sts-role'),
      handler: 'index.handler', 
      role: lambdaRole,
      vpc: vpc,
      environment: {'ROLE_TO_ASSUME_ARN': anotherRole.roleArn},
      securityGroups: [securityGroup],
      allowPublicSubnet: true,
      timeout: cdk.Duration.seconds(5),
      memorySize: 128,
      vpcSubnets: {
        subnets: [privateSubnet],
      },
    });

  } }
