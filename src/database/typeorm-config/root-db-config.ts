import { Logger } from "@nestjs/common";
import { TypeOrmModuleAsyncOptions } from "@nestjs/typeorm/dist/interfaces/typeorm-options.interface";

import * as entities from "./entities";
import { TypeormNamingStrategy } from "./typeorm-naming-strategy";
import { TypeormLogger } from "./typeorm.logger";

import { ConfigService } from "@module/config";

// const getSlaves = (config: ConfigService): Array<Record<string, unknown>> => {
//   const slaves = [];
//   for (let i = 0; i < config.dbReplicaParsed.hosts.length; i += 1) {
//     slaves.push({
//       host: config.dbReplicaParsed.hosts[i],
//       port: config.dbReplicaParsed.ports[i],
//       username: config.dbReplicaParsed.users[i],
//       password: config.dbReplicaParsed.passes[i],
//       database: config.dbReplicaParsed.names[i],
//       ssl: config.db.postgresUseSsl
//         ? {
//             rejectUnauthorized: true,
//             ca: config.db.sslCerts,
//           }
//         : false,
//     });
//   }
//
//   return slaves;
// };

export const rootDbConfig: TypeOrmModuleAsyncOptions = {
  useFactory: async (config: ConfigService, logger = new Logger("postgres")) => {
    // TODO: uncomment for replicas usage
    // const slaves = getSlaves(config);

    const { host, port, user, password, name, ssl, sslCerts } = config.db;

    return {
      type: "postgres",
      synchronize: false,
      entities,
      namingStrategy: new TypeormNamingStrategy(),
      extra: {
        max: 60,
      },
      host,
      port,
      username: user,
      password,
      database: name,
      ssl: ssl
        ? {
          rejectUnauthorized: true,
          ca: sslCerts,
        }
        : false,
      logger: new TypeormLogger(logger),
    };
  },
  inject: [ConfigService],
};
