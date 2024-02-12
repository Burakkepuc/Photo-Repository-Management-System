import {ErrorRequestHandler} from 'express';

const errorHandler: ErrorRequestHandler = (err: Error, req, res, next) => {
  const errStatus = (err as any).statusCode || 500;
  const errMsg = err.message || 'Something went wrong';

  res.status(errStatus).json({
    success: false,
    status: errStatus,
    message: errMsg,
  });
};

export default errorHandler;
