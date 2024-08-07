import { createRealmContext } from "@realm/react";

import { Coords } from "./schemas/Coords";
import { Historic } from "./schemas/Historic";

export const syncConfig: any = {
  flexible: true,
  newRealmFileBehavior: {
    type: "openImmediately",
  },
  existingRealmFileBehavior: {
    type: "openImmediately",
  },
};

export const { RealmProvider, useRealm, useQuery, useObject } =
  createRealmContext({
    schema: [Historic, Coords],
    schemaVersion: 0,
  });
