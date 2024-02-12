# Node.js and TypeScript Photo Management API

This project implements a photo management API built with Node.js, TypeScript, and MongoDB. It provides secure user authentication, photo upload and storage, and retrieval functionalities.

## Objective

The objective is to create a backend system that empowers users to:

Upload and manage their photos securely.
Store photos efficiently using AWS S3.
Retrieve and manage photo metadata easily.

## Features

### User Authentication:

Secure API endpoints with JWT-based authentication.
User registration and login functionalities.

### Photo Upload and Storage:

Upload photos through a dedicated endpoint (/upload-photo).
Leverage AWS S3 for reliable and scalable photo storage.

### Database Integration:

Store photo metadata (filename, upload date, S3 URL) in MongoDB.

### Photo Management:

Retrieve uploaded photos (GET /photos).
Update metadata or delete photos (PATCH/DELETE /update-photo/:id, /delete-photo/:id).

## Architecture

The API leverages the following technologies:

- Backend: Node.js, TypeScript
- Database: MongoDB
- Storage: AWS S3
- Authentication: JWT

## Route Map

`/login`: User login  
`/register`: User registration  
`/logout`: User logout  
`/upload-photo`: Photo upload (authenticated)  
`/get-photos`: Retrieve user photos (authenticated)  
`/update-photo/`:id: Update photo metadata (authenticated)  
`/delete-photo/`:id: Delete photo (authenticated)

## Env file

SECRET_KEY=<your-strong-secret-key>  
AWS_ACCESS_KEY_ID=<your-AWS-access-key-ID>  
AWS_SECRET_ACCESS_KEY=<your-AWS-secret-access-key>  
AWS_REGION=us-west-1 # Or your desired AWS region  
AWS_BUCKET_NAME=<your-AWS-S3-bucket-name>  
MONGO_URI=<your-MongoDB-connection-URI>
