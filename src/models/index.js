// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Collections, Users } = initSchema(schema);

export {
  Collections,
  Users
};