import express from 'express';
import logger from '../helpers/errorHandler.js';

const router = express.Router();

router.post('/logerror', (req, res) => {
  const { source, message, url, time } = req.body;
  logger.error(`[FRONTEND] (${source}) ${message} @ ${url} [${time}]`);
  res.sendStatus(204); // blank response
});

export default router;
