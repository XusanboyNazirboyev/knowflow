import { Queue } from 'bullmq';

export const documentQueue = new Queue('document-processing', {
  connection: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
});
