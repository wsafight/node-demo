import { 
  existsSync, 
  readFileSync, 
} from 'node:fs'
import { resolve } from 'node:path'

interface AppConfig {

}

export const getConfig = (configPath: string): AppConfig => {
  const configFilePath = resolve(configPath || 'app-config.json')
  if (!existsSync(configFilePath)) {
    throw new Error('cannot found config file:' + configFilePath)
  }
  const fileContent = readFileSync(configFilePath, 'utf8');
  const configData = JSON.parse(fileContent)
  return Object.freeze(configData)
}


