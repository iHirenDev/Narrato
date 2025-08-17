import AWS from 'aws-sdk';
 
AWS.config.update({
    accessKeyId: process.env.EXPO_PUBLIC_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.EXPO_PUBLIC_AWS_SECRET_ACCESS_KEY,
    region: 'us-east-1'
});

const polly = new AWS.Polly();

export default polly;