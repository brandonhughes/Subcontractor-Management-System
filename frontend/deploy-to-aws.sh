#!/bin/bash

# Deployment script for Subcontractor Management System to AWS
# This script automates the process of building and deploying the frontend to AWS

set -e  # Exit immediately if a command exits with a non-zero status

# Parse command line arguments
BUCKET_NAME="subcontractor-management-system-frontend"
REGION="us-east-1"
STACK_NAME="SubcontractorMSFrontend"
PROFILE=""

# Function to display usage information
usage() {
  echo "Usage: $0 [options]"
  echo ""
  echo "Options:"
  echo "  -b, --bucket BUCKET_NAME   S3 bucket name for deployment (default: subcontractor-management-system-frontend)"
  echo "  -r, --region REGION        AWS region to deploy to (default: us-east-1)"
  echo "  -s, --stack STACK_NAME     CloudFormation stack name (default: SubcontractorMSFrontend)"
  echo "  -p, --profile PROFILE      AWS CLI profile to use"
  echo "  -h, --help                 Display this help message"
  exit 1
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  key="$1"
  case $key in
    -b|--bucket)
      BUCKET_NAME="$2"
      shift 2
      ;;
    -r|--region)
      REGION="$2"
      shift 2
      ;;
    -s|--stack)
      STACK_NAME="$2"
      shift 2
      ;;
    -p|--profile)
      PROFILE="$2"
      shift 2
      ;;
    -h|--help)
      usage
      ;;
    *)
      echo "Unknown option: $1"
      usage
      ;;
  esac
done

# Set AWS profile if provided
if [ ! -z "$PROFILE" ]; then
  AWS_PROFILE_CMD="--profile $PROFILE"
else
  AWS_PROFILE_CMD=""
fi

echo "=== Subcontractor Management System AWS Deployment ==="
echo "Bucket name: $BUCKET_NAME"
echo "Region: $REGION"
echo "Stack name: $STACK_NAME"
echo "==============================================="

# Check if AWS CLI is installed
if ! [ -x "$(command -v aws)" ]; then
  echo 'Error: AWS CLI is not installed.' >&2
  exit 1
fi

# Run AWS build script
echo "Building application for AWS deployment..."
chmod +x build-aws.sh
./build-aws.sh

# Check if CloudFormation stack exists
stack_exists=$(aws cloudformation describe-stacks --stack-name $STACK_NAME $AWS_PROFILE_CMD --region $REGION 2>&1 || echo "STACK_NOT_FOUND")

if [[ $stack_exists == *"STACK_NOT_FOUND"* ]]; then
  # Create the CloudFormation stack
  echo "Creating CloudFormation stack..."
  aws cloudformation create-stack \
    --stack-name $STACK_NAME \
    --template-body file://aws-cloudformation.yaml \
    --parameters ParameterKey=BucketName,ParameterValue=$BUCKET_NAME \
    $AWS_PROFILE_CMD \
    --region $REGION \
    --capabilities CAPABILITY_IAM
    
  echo "Waiting for stack creation to complete..."
  aws cloudformation wait stack-create-complete \
    --stack-name $STACK_NAME \
    $AWS_PROFILE_CMD \
    --region $REGION
else
  # Update the CloudFormation stack
  echo "Updating CloudFormation stack..."
  aws cloudformation update-stack \
    --stack-name $STACK_NAME \
    --template-body file://aws-cloudformation.yaml \
    --parameters ParameterKey=BucketName,ParameterValue=$BUCKET_NAME \
    $AWS_PROFILE_CMD \
    --region $REGION \
    --capabilities CAPABILITY_IAM || echo "No updates to be performed on stack"
    
  if [[ $? -eq 0 ]]; then
    echo "Waiting for stack update to complete..."
    aws cloudformation wait stack-update-complete \
      --stack-name $STACK_NAME \
      $AWS_PROFILE_CMD \
      --region $REGION
  fi
fi

# Get stack outputs
echo "Getting stack outputs..."
CF_OUTPUTS=$(aws cloudformation describe-stacks \
  --stack-name $STACK_NAME \
  $AWS_PROFILE_CMD \
  --region $REGION \
  --query "Stacks[0].Outputs" \
  --output json)

S3_BUCKET=$(echo $CF_OUTPUTS | grep -o '"OutputKey": "S3BucketName"[^}]*' | grep -o '"OutputValue": "[^"]*' | cut -d'"' -f4)
CLOUDFRONT_ID=$(echo $CF_OUTPUTS | grep -o '"OutputKey": "CloudFrontDistributionId"[^}]*' | grep -o '"OutputValue": "[^"]*' | cut -d'"' -f4)
WEBSITE_URL=$(echo $CF_OUTPUTS | grep -o '"OutputKey": "WebsiteURL"[^}]*' | grep -o '"OutputValue": "[^"]*' | cut -d'"' -f4)

echo "Deploying files to S3 bucket: $S3_BUCKET"
aws s3 sync aws-build/ s3://$S3_BUCKET/ \
  --delete \
  $AWS_PROFILE_CMD \
  --region $REGION

echo "Creating CloudFront invalidation..."
aws cloudfront create-invalidation \
  --distribution-id $CLOUDFRONT_ID \
  --paths "/*" \
  $AWS_PROFILE_CMD \
  --region $REGION

echo "=== Deployment Complete ==="
echo "Website URL: $WEBSITE_URL"
echo "S3 Bucket: $S3_BUCKET"
echo "CloudFront Distribution ID: $CLOUDFRONT_ID"
echo "==============================================="