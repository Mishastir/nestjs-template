#!/bin/bash

read -r -p 'Migration name: ' migrationName && \
node --require dotenv/config -r tsconfig-paths/register \
./node_modules/typeorm/cli-ts-node-commonjs.js migration:generate \
-d src/database/typeorm-config/orm-config.ts \
src/database/migrations/"$migrationName"


