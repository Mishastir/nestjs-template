#!/bin/bash

node --require dotenv/config -r tsconfig-paths/register \
./node_modules/typeorm/cli-ts-node-commonjs.js \
migration:revert -d src/database/typeorm-config/orm-config.ts
