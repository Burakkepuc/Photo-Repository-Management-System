import {Document, Schema, model} from 'mongoose';

// Interface for Photo metadata
interface IPhotoMetadata {
  filename: string;
  uploadDate: Date;
  s3Url: string;
  userId: Schema.Types.ObjectId;
}

// Mongoose schema for PhotoMetadata
const photoSchema = new Schema<IPhotoMetadata>({
  filename: {
    type: String,
    required: true,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  s3Url: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Reference to the User collection
    required: true,
  },
});

// Export the Mongoose model with appropriate types
const Photo = model<IPhotoMetadata>('Photo', photoSchema);

export default Photo;
