# AWS Deployment Guide for Subcontractor Management System

This guide provides instructions for deploying the Subcontractor Management System frontend to AWS.

## Prerequisites

1. An AWS account with appropriate permissions
2. AWS CLI installed and configured
3. Node.js and npm installed locally

## Deployment Options

### Option 1: AWS Amplify Console (Recommended)

1. Sign in to the AWS Management Console and open AWS Amplify
2. Choose "Get Started" under Amplify Hosting
3. Choose your Git provider and select your repository
4. Connect your repository and select the branch to deploy
5. Configure build settings:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build:aws
  artifacts:
    baseDirectory: build
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

6. Review and confirm deployment

### Option 2: Manual Deployment to S3 with CloudFront

1. Create an S3 bucket for hosting:

```bash
aws s3 mb s3://your-bucket-name --region your-region
```

2. Build the application:

```bash
cd frontend
chmod +x build-aws.sh
./build-aws.sh
```

3. Upload the build to S3:

```bash
aws s3 sync aws-build/ s3://your-bucket-name --delete
```

4. Configure the bucket for static website hosting:

```bash
aws s3 website s3://your-bucket-name --index-document index.html --error-document index.html
```

5. Create a CloudFront distribution pointing to the S3 bucket for better performance and HTTPS.

### Option 3: AWS Elastic Beanstalk

1. Create a new Elastic Beanstalk application:

```bash
eb init -p node.js your-application-name
```

2. Build the application:

```bash
cd frontend
chmod +x build-aws.sh
./build-aws.sh
```

3. Create a `package.json` in the root directory with a start command that serves the static files.

4. Deploy the application:

```bash
eb create your-environment-name
```

## Configuration

### API Endpoint Configuration

The frontend is configured to connect to the API at the `/api` path. If your API has a different URL, update the following files:

1. `/frontend/scripts/aws-pre-build.js` - Update the `REACT_APP_API_URL` value
2. `/frontend/aws-config.json` - Update the `apiGateway` value after it's generated

### Environment Variables

Depending on your deployment option, you may need to configure environment variables in the AWS console for:

- `REACT_APP_API_URL`: The URL to your API
- `REACT_APP_ENV`: Set to 'production' for production deployments

## Troubleshooting

### Routing Issues

If you're using CloudFront or S3, configure the distribution to redirect 404s to index.html to support React Router:

```json
{
  "Routes": [
    {
      "Route": "404",
      "Redirect": {
        "ReplaceKeyWith": "index.html"
      }
    }
  ]
}
```

### API Connection Issues

Ensure CORS is properly configured on your API to allow requests from your frontend domain.

## Maintenance

To update your deployment:

1. Make changes to your code
2. Run the build script: `./build-aws.sh`
3. Upload the new build to your hosting service
