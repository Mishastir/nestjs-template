#!/bin/bash

node --require dotenv/config \
./node_modules/typeorm/cli-ts-node-commonjs.js \
migration:show -d dist/database/typeorm-config/orm-config.js



