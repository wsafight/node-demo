# 读取配置文件

在微服务项目运行的过程中，往往很多配置项会动态变化，如:应用的配置项等(如应用降级、服务器迁移、业务数据变更等)，如果在业务中不断轮询，则性能和实时性难以折中，此时需要分布式配置中心，如 Nacos 或 Apollo。

但在项目的开发初期，当前某一个服务可能较小，我们可以直接使用 node 读取文件来实现配置项（数据库信息，日志等级）。

```ts
import { 
  existsSync, 
  readFileSync, 
} from 'node:fs'
import { resolve } from 'node:path'

interface AppConfig {
  logLevel: string;
  logFile: string;
}

export const getConfig = (configPath: string): AppConfig => {
  const configFilePath = resolve(configPath || 'app-config.json')
  if (!existsSync(configFilePath)) {
    throw new Error('cannot found config file:' + configFilePath)
  }
  const fileContent = readFileSync(configFilePath, 'utf8')
  const configData = JSON.parse(fileContent)
  return Object.freeze(configData)
}
```

因为 node 原生支持 JSON 文件，如果当前用户使用 JSON 文件，我们可以直接使用 require 或者 import 动态引入 JSON 文件。但是如果是这样，我们就需要使用相对路径。这样不是特别方便。

```ts
const configFilePath = require(configPath || './app-config.json')
```

如果类似于应用降级等，我们可能还需要监听配置文件。

```

```

线上真实的业务可以使用 pm2 监听来实现功能。
