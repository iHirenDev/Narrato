import AWS from 'aws-sdk';
import  Constants  from 'expo-constants';

// AWS.config.credentials = new AWS.Credentials({
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
// });

const extra = Constants.expoConfig?.extra ?? {};

 
AWS.config.update({
    accessKeyId: extra.aws_access_key_id,
    secretAccessKey: extra.aws_secret_access_key,
    region: 'us-east-1'
});

const polly = new AWS.Polly();

export default polly;