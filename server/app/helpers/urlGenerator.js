import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import AWS from 'aws-sdk';

export async function urlGenerator(post) {
  //---------------------If post has no images

  if (post.images.length === 0) {
    return post;
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
  post['imagesUrls'] = imagesUrls;
  return post;
}

// {
//   "status": "success",
//   "results": 9,
//   "data": {
//       "posts": [
//           {
//               "_id": "63399793a1529a5b8bb642ca",
//               "title": "Numan ki dosri post",
//               "description": "Hello this is my second post ;)",
//               "likes": 0,
//               "likesIDs": [],
//               "comments": [],
//               "shares": 1,
//               "isSold": false,
//               "images": [],
//               "price": 2000,
//               "tags": [],
//               "createdBy": "63383b3f1ff4499ced15876b",
//               "dateCreated": "2022-10-02T13:52:19.613Z",
//               "__v": 0,
//               "sharesIDs": [
//                   "63383b3f1ff4499ced15876b"
//               ]
//           },
// .
// .
// .

// {
//   "status": "success",
//   "results": 0,
//   "data": {
//       "postsWithUrls": []
//   }
// }
