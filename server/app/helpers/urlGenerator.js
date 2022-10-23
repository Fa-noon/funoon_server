import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import AWS from 'aws-sdk';

export async function urlGenerator(input) {
  //------------------------------Get Link of images from s3----------------------------------
  const s3 = new S3Client({
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      sessionToken: process.env.AWS_SESSION_TOKEN,
    },
    region: process.env.AWS_REGION,
  });
  AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN,
  });
  let output = { input };
  const imagesUrls = [];
  for (let i = 0; i < input.images.length; i++) {
    const getObjectParams = {
      Bucket: process.env.BUCKET_NAME,
      Key: input.images[i],
    };
    const getCommand = new GetObjectCommand(getObjectParams);
    const url = await getSignedUrl(s3, getCommand, {
      expiresIn: 1000,
    });
    imagesUrls.push(url);
  }
  output = { ...output, imagesUrls };

  return output;
}
