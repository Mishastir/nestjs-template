#!/bin/bash

cd src/modules
read -r -p 'Module name: ' moduleName

if [[ -d "$moduleName" ]]; then
    echo "Module exists."
    read -r -p 'Delete module? [y/N] ' response

    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        rm -rf $moduleName
    else
      exit
    fi
fi

capitalizedModuleName="${moduleName//-/ }"
capitalizedModuleName=$(echo "$capitalizedModuleName" | awk '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) tolower(substr($i,2))}1')
capitalizedModuleName="${capitalizedModuleName// }"

first_char=$(echo "${capitalizedModuleName:0:1}" | tr '[:upper:]' '[:lower:]')
variableModuleName="${first_char}${capitalizedModuleName:1}"

mkdir $moduleName
cd $moduleName

# region Controllers
mkdir controllers
cd controllers

cat <<EOF >$moduleName.controller.ts
import { Controller } from "@nestjs/common";

import { ${capitalizedModuleName}Service } from "../services";

@Controller("$moduleName")
export class ${capitalizedModuleName}Controller {
  constructor(
    private readonly ${variableModuleName}Service: ${capitalizedModuleName}Service,
  ) {}
}
EOF

echo "export * from \"./$moduleName.controller\";" > index.ts
# endregion Controllers

# region Dto
cd ..
mkdir dto
cd dto
touch index.ts
# endregion Dto

# region Services
cd ..
mkdir services
cd services

cat <<EOF >$moduleName.service.ts
import { Injectable } from "@nestjs/common";

@Injectable()
export class ${capitalizedModuleName}Service {

}
EOF

echo "export * from \"./$moduleName.service\";" > index.ts
# endregion Services

# region Module
cd ..

cat <<EOF >$moduleName.module.ts
import { Module } from "@nestjs/common";

import { ${capitalizedModuleName}Controller } from "./controllers";
import { ${capitalizedModuleName}Service } from "./services";

@Module({
  controllers: [
    ${capitalizedModuleName}Controller,
  ],
  providers: [
    ${capitalizedModuleName}Service,
  ],
})
export class ${capitalizedModuleName}Module {}
EOF

echo "export * from \"./$moduleName.module\";" > index.ts
# endregion Module


echo "Module $moduleName created"
