
import json
import os
import boto3

def handler(event, context):
    # Initialize STS client
    sts_client = boto3.client('sts')

    # Define the ARN of the role we want to assume
    role_to_assume_arn = os.env['ROLE_TO_ASSUME_ARN']
    role_session_name = 'AssumeRoleSession1'

    # Assume the specified role
    assumed_role = sts_client.assume_role(
        RoleArn=role_to_assume_arn,
        RoleSessionName=role_session_name,
        DurationSeconds=3600  # the role session will last for 1 hour
    )
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }