// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { CardSet, Card, Users } = initSchema(schema);

export {
  CardSet,
  Card,
  Users
};