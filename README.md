![Node.js](https://img.shields.io/badge/node.js-20.5-green)
![NestJS](https://img.shields.io/npm/v/%40nestjs/core?label=NestJS&color=ea2845)


## Description

Nest server starter repository.

## Installation

```bash
$ npm install
```

Replace `--service_name--` to your project name everywhere in repository.
Replace `Description` in current file.

Create `.env` file from `.env.example`.

Create `docker-compose.local.yaml` from `docker-compose.dev.yaml`:

- If you want to start server using docker change nothing in docker-compose and just start it
- If you want to start server with npm scripts leave only db startup in docker and run it

### Prisma Installation

Generate Prisma Client

```bash
$ prisma generate
```

Run all Prisma migrations

```bash
$ prisma migrate dev
```

## Running the app

```bash
$ docker-compose -f ./docker-compose.local.yaml up -d
```

If you prefer startup via npm scripts also execute

```bash
$ npm run start:dev
```
