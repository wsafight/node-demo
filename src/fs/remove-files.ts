import { 
  readdirSync, 
  statSync, 
  unlinkSync,
  rmdirSync,
} from 'node:fs';
import { join } from 'node:path';

export const removeFile = (path: string) => {
  unlinkSync(path)
}

export const removeFiles = (dir: string) => {
  const files = readdirSync(dir)
  files.forEach(file => {
    const fullPath: string = join(dir, file)
    if (statSync(fullPath).isDirectory()) {
      removeFiles(fullPath)
      rmdirSync(fullPath)
      return
    }
    unlinkSync(fullPath)
  })
}