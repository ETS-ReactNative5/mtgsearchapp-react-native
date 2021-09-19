import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





type CollectionsMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type UsersMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class Collections {
  readonly id: string;
  readonly collection?: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Collections, CollectionsMetaData>);
  static copyOf(source: Collections, mutator: (draft: MutableModel<Collections, CollectionsMetaData>) => MutableModel<Collections, CollectionsMetaData> | void): Collections;
}

export declare class Users {
  readonly id: string;
  readonly Password?: string;
  readonly UserCollections?: Collections;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Users, UsersMetaData>);
  static copyOf(source: Users, mutator: (draft: MutableModel<Users, UsersMetaData>) => MutableModel<Users, UsersMetaData> | void): Users;
}