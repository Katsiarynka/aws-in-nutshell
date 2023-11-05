#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { LambdaVpcSetupStack } from '../lib/lambda-vpc-setup-stack';

const app = new cdk.App();
new LambdaVpcSetupStack(app, 'LambdaVpcSetupStack', {
  env: { 
    region: 'us-east-1',
    account: process.env.CDK_DEFAULT_ACCOUNT,
   },
});