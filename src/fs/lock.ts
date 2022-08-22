import { mkdir, writeFile, unlink } from 'node:fs/promises'
import { existsSync, rmSync } from 'node:fs'
import { join } from 'node:path'

let hasLock = false

const lockDir = '/xxx/xxxx/configLock'

export const lock = async () => {
  if (hasLock) {
    return
  }

  let dirExists = false
  try {
    dirExists = existsSync(lockDir)
  } catch (e) {
  }

  if(!dirExists) {
    await mkdir(lockDir, {recursive : true});
  }

  await writeFile(join(lockDir, '' + process.pid), '')
  hasLock = true
}

export const unlock = async () => {
  if (!hasLock) {
    return
  }
  await unlink(join(lockDir, '' + process.pid))
  hasLock = false
}

process.on('exit', () => {
  if (!hasLock) {
    return
  }
  rmSync(lockDir, { force: true, recursive: true })
})