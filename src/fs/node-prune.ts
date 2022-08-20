import { readdirSync, rm, statSync, unlinkSync } from 'node:fs'
import { join } from 'node:path'
import { invariant } from '../utils/invariant'
import { needRemoveDir, needRemoveExt, needRemoveFile } from './const'

export const findNodeModulesThenPrune = async (path: string) => {
  invariant(!path.endsWith('node_modules'), 'remove directory must is "node_modules"')
  const absolutePath = path.startsWith('/') ? path : join(__dirname, path)
  invariant(!statSync(absolutePath).isDirectory(), 'current path is not directory')

  let fileCount = 0
  let dirCount = 0
  console.time('purne node_modules')

  const prune = (dir: string) => {
    const files = readdirSync(dir)
    files.forEach(file => {
      const fullPath: string = join(dir, file)
      if (statSync(fullPath).isDirectory()) {
        if (needRemoveDir.has(file)) {
          dirCount++
          rm(fullPath, { force: true, recursive: true }, () => {})
        } else {
          prune(fullPath)
        }
        return
      }
      if (needRemoveFile.has(file)) {
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
  console.timeEnd('purne node_modules')
}
