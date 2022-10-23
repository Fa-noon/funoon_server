import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import AWS from 'aws-sdk';

export async function urlGenerator(post) {
  //---------------------If post has no images
  let output = { post };
  if (post.images.length === 0) {
    return output;
  }
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

  const imagesUrls = [];
  for (let i = 0; i < post.images.length; i++) {
    const getObjectParams = {
      Bucket: process.env.BUCKET_NAME,
      Key: post.images[i],
    };
    const getCommand = new GetObjectCommand(getObjectParams);
    const url = await getSignedUrl(s3, getCommand, {
      expiresIn: 1000,
    });
    imagesUrls.push(url);
  }
  output.imagesUrls = imagesUrls;
  output = { ...output };

  return output;
}
