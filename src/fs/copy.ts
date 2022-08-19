import { 
  existsSync,
  mkdirSync, 
  readdirSync, 
  statSync,
  copyFileSync
} from 'node:fs';
import { join, basename, dirname } from 'node:path';

import { invariant } from "../utils/invariant";
import { removeFiles } from './remove-files';

interface CopyParams {
  /** 源文件(源文件夹) */
  source: string;
  /** 目标文件夹 */
  distDir: string;
  /** 跳过函数 */
  skipFile?: string[] | ((fileOrDirName: string) => boolean);
  /** 清除目标文件 */
  clearDist: boolean;
}

const makeDirIfDirNotExist = (path: string) => {
  let dirExists = false
  try {
    dirExists = existsSync(path)
  } catch (e) {
  }
  if(!dirExists) {
    mkdirSync(path, {recursive : true})
  }
}


const copyFile = (srcPath, distPath) => {
  const dir = dirname(distPath)
  makeDirIfDirNotExist(dir)
  copyFileSync(srcPath, distPath)
}


const copyDir = (sourceDir, distDir, relativePath = '') => {
  const srcPath: string = join(sourceDir, relativePath)
  const distPath: string = join(distDir, relativePath)

  const files = readdirSync(srcPath);

  files.forEach(file => {
    const currentPath = join(srcPath, file)
    if (statSync(currentPath).isDirectory()) {
      copyDir(srcPath, distPath, file)
    } else {

    
      copyFile(currentPath, join(distPath, file));
    }
  })
}

export const copy = ({source, distDir, clearDist = true, skipFile}: CopyParams) => {
  invariant(!source || typeof source !== 'string', 'The current params "source" must be string');
  invariant(!distDir || typeof distDir !== 'string', 'The current params "distDir" must be string');
  invariant(!existsSync(source), 'params "source" must be exists');

  let isFileForSource: boolean = false
  const sourceStat = statSync(source)

  invariant(!sourceStat.isFile() && !sourceStat.isDirectory(), 'params "source" must be an file or dir');
  
  isFileForSource = sourceStat.isFile();

  makeDirIfDirNotExist(distDir)

  if (clearDist) {
    removeFiles(distDir)
  }

  if (isFileForSource) {
    copyFile(source, join(distDir, basename(source)))
    return;
  }

  copyDir(source, distDir)
}