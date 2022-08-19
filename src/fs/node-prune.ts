import * as readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'
import { join } from 'node:path'
import { readdirSync, rmdirSync, statSync, unlinkSync } from 'node:fs'
import { invariant } from '../utils/invariant'
import { needRemoveDir, needRemoveExt, needRemoveFile } from './const'

const rl = readline.createInterface({ input, output })

const path = await rl.question('node_modules path?')

invariant(!path.endsWith('node_modules'), 'remove directory must is "node_modules"')

let absolutePath = path.startsWith('/') ? path : join(__dirname, path)

invariant(!statSync(absolutePath).isDirectory(), 'current path is not directory')

let fileCount = 0
let dirCount = 0

const prune = (dir: string) => {
  const files = readdirSync(dir)
  files.forEach(file => {
    const fullPath: string = join(dir, file)
    if (statSync(fullPath).isDirectory()) {
      if (needRemoveDir.has(file)) {
        dirCount++
        rmdirSync(fullPath, {recursive: true})
        return
      } else{
        prune(fullPath)
      }
      return
    } 
    if (needRemoveFile.has(fullPath)) {
      fileCount++
      unlinkSync(fullPath)
      return
    }
    if (fullPath.indexOf('.') > 0) {
      const splitName = fullPath.split('.');
      if (needRemoveExt.has(`.${splitName[splitName.length - 1]}`)) {
        fileCount++
        unlinkSync(fullPath)
      }
    }
  })
}

prune(absolutePath)

console.log(`remove file count ${fileCount} and remove dir count ${dirCount}, use time `)



