import {Request as ExpressRequest, Response} from 'express';
require('dotenv').config();
import aws from 'aws-sdk';
import fs from 'fs';
import Photo from '../models/photo';
import mongoose from 'mongoose';

interface AuthenticatedRequest extends ExpressRequest {
  userId?: string;
}

var s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY_ID,
  region: process.env.AWS_REGION,
});

export const uploadPhoto = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.file) {
    return res.status(400).json({message: 'No file uploaded'});
  }
  try {
    const {file} = req;
    // const buffer = await fs.promises.readFile(file.path);

    const s3Params = {
      Bucket: process.env.AWS_BUCKET_NAME as string,
      Key: file.originalname || file.filename,
      Body: fs.createReadStream(file.path),
      ContentType: file.mimetype,
    };

    s3.upload(s3Params, async (err: any, data: any) => {
      if (err) {
        res.status(500).json({message: err.message});
      }

      await fs.promises.unlink(file.path);
      const userId = req.userId;

      //success
      if (data) {
        const newPhoto = new Photo({
          filename: file.originalname || file.filename,
          uploadDate: Date.now(),
          s3Url: data.Location,
          userId: new mongoose.Types.ObjectId(userId),
        });

        try {
          await newPhoto.save();

          res
            .status(200)
            .json({message: 'File uploaded successfully', upload: data});
        } catch (error) {
          res.status(500).json({message: 'Error saving photo metadata'});
        }
      }
    });
  } catch (error: any) {
    res.status(500).json({message: error.message});
  }
};

export const getPhoto = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({message: 'Unauthorized'});
    }
    const photos = await Photo.find({userId}).select(
      '-_id filename uploadDate s3Url'
    );

    res.json({photos});
  } catch (error: any) {
    res.status(500).json({message: error.message});
  }
};

export const deletePhoto = async (req: AuthenticatedRequest, res: Response) => {
  const {id} = req.query;
  const {key} = req.query; // name of the file to be deleted
  try {
    s3.deleteObject(
      {
        Bucket: process.env.AWS_BUCKET_NAME as string,
        Key: `${key}.${'jpg' || 'png' || 'jpeg'}`,
      },
      function (err, data) {
        if (err) {
          console.log('Error', err);
        } else {
          console.log('Success');
        }
      }
    );
    const photo = await Photo.findByIdAndDelete(id);
    if (!photo) {
      return res.status(404).json({message: 'Photo not found'});
    }
    res.json({message: 'Photo deleted successfully'});
  } catch (error: any) {
    res.status(500).json({message: error.message});
  }
};

export const updatePhoto = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {key} = req.query;
    const {newKey} = req.query;
    if (!key || !newKey) {
      return res
        .status(400)
        .json({message: 'Missing required parameters: key and newKey'});
    }
    const objectData = await s3
      .getObject({
        Bucket: process.env.AWS_BUCKET_NAME as string,
        Key: `${key}.${'jpg' || 'png' || 'jpeg'}`,
      })
      .promise();

    s3.deleteObject(
      {
        Bucket: process.env.AWS_BUCKET_NAME as string,
        Key: `${key}.${'jpg' || 'png' || 'jpeg'}`,
      },
      function (err, data) {
        if (err) {
          console.log('Error', err);
        } else {
          console.log('Success');
        }
      }
    );

    s3.putObject(
      {
        Bucket: process.env.AWS_BUCKET_NAME as string,
        Key: `${newKey}.${'jpg' || 'png' || 'jpeg'}`,
        Body: objectData.Body,
      },
      function (err, data) {
        if (err) {
          console.log('Error', err);
        } else {
          console.log('Success');
        }
      }
    );

    const updatePhoto = await Photo.findOneAndUpdate(
      {filename: `${key}.${'jpg' || 'png' || 'jpeg'}`},
      {filename: newKey}
    );

    res.json({message: 'Photo updated successfully', updatePhoto});
  } catch (error: any) {
    res.status(500).json({message: error.message});
  }
};
