const dev = {
    s3: {
      REGION: 'us-east-1',
      BUCKET: 'work-orders-api-dev-attachmentsbucket-14kqlbnxyh2xw'
    },
    apiGateway: {
      REGION: 'us-east-1',
      URL: 'https://rspfiqp2x5.execute-api.us-east-1.amazonaws.com/dev'
    },
    cognito: {
      REGION: 'us-east-1',
      USER_POOL_ID: 'us-east-1_4gcgopFl5',
      APP_CLIENT_ID: '381vk0n320f38bso57hvm1c22p',
      IDENTITY_POOL_ID: 'us-east-1:04023e8c-6d2b-4f92-8456-07b3d449afc2'
    }
  };
  
  const prod = {
    s3: {
      REGION: 'us-east-1',
      BUCKET: 'work-orders-api-prod-attachmentsbucket-1m40v2gasl7mo'
    },
    apiGateway: {
      REGION: 'us-east-1',
      URL: 'https://kmz5xjui35.execute-api.us-east-1.amazonaws.com/prod'
    },
    cognito: {
      REGION: 'us-east-1',
      USER_POOL_ID: 'us-east-1_son9UtdcW',
      APP_CLIENT_ID: '5n1jfb9v7l07m4edfvvo4t8t4p',
      IDENTITY_POOL_ID: 'us-east-1:d2997541-ff61-47ae-802d-ee99cc9fe80a'
    }
  };
  
  // Default to dev if not set
  const config = process.env.REACT_APP_STAGE === 'prod'
    ? prod
    : dev;
  
  export default {
    // Add common config values here
    MAX_ATTACHMENT_SIZE: 5000000,
    ...config
  };
