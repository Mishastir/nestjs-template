#!/bin/bash

read -r -p 'Migration name: ' migrationName && \
node --require dotenv/config -r tsconfig-paths/register \
./node_modules/typeorm/cli-ts-node-commonjs.ts migration:create \
src/database/migrations/"$migrationName"


