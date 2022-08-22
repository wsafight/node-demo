# 使用文件锁

文件锁在开发者需要协同多个进程同时访问同一个文件同时也要保证文件内容不出错时很有用。

文件锁如果深耕的话，意义并不大。因为实际开发很少用上（桌面应用可能会使用这种技术），只做了解即可。

文件锁分为两种，一种是强制锁（在操作系统内核级别执行,利用内核来查检每个打开、读取、写入操作，从而保证在调用这些操作时不违反文件上的锁规则），一种是咨询锁（在业务内实现，需要各个进程遵守统一规则，在文件访问时，先去尝试获得文件锁，然后进一步操作）。在必须要使用文件锁的情况下，尽可能使用咨询锁，因为强制锁太重而且难以控制（操作强制锁可能会造成严重破坏）。

Linux 系统实现了 POSIX 的 fcntl 锁函数，BSD 的 flock 函数，SVR4 的 lockf 函数，这些默认都是建议锁。其中 fcntl 也可以实现强制锁。

强制性锁需要如下操作:

- 挂载文件系统时需要加 mand 参数在文件系统上启用强制锁支持，比较新的 Linux kernel 里已经基本在所有文件系统上都实现了
- 去掉程序的组执行权限
- 增加程序的设置组 ID 权限

第二项和第三项在普通情况下实际上是自相矛盾的，所以 Linux 就用这种特殊情况就表示启用强制锁（Mandatory locking）了。

```bash
mount -t tmpfs -o size=10m,mand tmpfs /mnt
cp test /mnt
cd /mnt
chmod g-x test
chmod g+s test
```

具体强制性锁的文档可以参考 [Linux 操作系统的强制文件锁定](https://www.kernel.org/doc/Documentation/filesystems/mandatory-locking.txt)，在此处不在深入讨论。

node 并没有实现咨询锁.如果有需要使用咨询锁可以使用 [node-fs-ext](https://github.com/baudehlo/node-fs-ext) 进行系统调用。

当然了，开发中也可以新增一个普通的文件或者文件夹作为锁文件(app.lock)。存在则表示有其他进程在使用，当前进程无法操作。例如：config.json 会被很多进程修改。正在修改的进程可以在修改前创建一个 config.lock 文件并在修改完成后删除改文件。其他进程需要修改 config.json 必须要检查 config.lock 是否存在，不存在才可以执行操作。

```ts
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
```
大家也可以参考 [lockfile](https://github.com/isaacs/lockfile)，不过它已经不在维护了。
