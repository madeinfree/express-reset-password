import * as EventEmitter from 'events';
import { redisClient } from '../redis';

export type EventEmitter = EventEmitter.EventEmitter;

class PubSubEvent extends EventEmitter {}

const createRedisPubSub = (redisClient: redisClient) => {
  const redisPubSub = new PubSubEvent();
  redisPubSub.on('delete', (token: string) => {
    redisClient.del(`PASSWORD:RESET:${token}`, (err: any, data) => {
      if (err) throw new Error(err);
      console.log(`Delete ${token} successed.`);
    });
  });
  return redisPubSub;
};

const createSESPubSub = () => {
  const SESPubSub = new PubSubEvent();
  SESPubSub.on('send', () => {
    console.log('Send the mailer');
  });
};

export default {
  createRedisPubSub,
  createSESPubSub
};
