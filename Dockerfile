FROM node:22.4-alpine as build

RUN mkdir -p /opt/node_app && chown -R node:node /opt/node_app
WORKDIR /opt/node_app

USER node

COPY --chown=node:node package*.json ./
RUN npm ci

COPY --chown=node:node tsconfig.json tsconfig.build.json ./
COPY --chown=node:node src ./src
COPY --chown=node:node prisma ./prisma

RUN npx prisma generate

RUN npm run build

FROM node:22.4-alpine

RUN mkdir -p /opt/node_app && chown -R node:node /opt/node_app
WORKDIR /opt/node_app

USER node

COPY --chown=node:node --from=build /opt/node_app/package.json /opt/node_app/package-lock.json ./
COPY --chown=node:node --from=build /opt/node_app/node_modules ./node_modules
COPY --chown=node:node --from=build /opt/node_app/dist ./dist

RUN npm prune --omit=dev --json && npm cache clean --force

ARG VERSION
ARG PORT=3000

ENV PORT $PORT
ENV PATH /opt/node_app/node_modules/.bin:$PATH
ENV VERSION=${VERSION:-unknown}
ENV NODE_ENV=production
ENV NODE_OPTIONS="--enable-source-maps"

EXPOSE $PORT
CMD [ "npm", "run", "start:prod"]
