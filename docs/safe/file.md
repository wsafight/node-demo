# 文件操作

## 文件类型检查

做文件操作时候，使用白名单限制文件后缀，如果后缀不在限定的数据中，可以直接拒绝处理。

如果是安全性需求较高的情况下，可能需要使用 [file-type](https://github.com/sindresorhus/file-type) 来检查文件类型。 

## 路径穿越字符

需要检查或者避免如 . 或者 .. 此类字符串。

在需要拼接文件路径时，注意先检查参数在进行拼接，不可先拼接后检查。

```js
// bad
filename = path.join(root, filename);
// 此时可能已经没有 .. 字符了
if (filename.includes('..')){
    throw new Error('filename not include .. path')
}

// good
if (filename.includes('..')){
    throw new Error('filename not include .. path')
}
filename = path.join(root, filename)
```

## 上传文件名

在用户可生成文件名的情况下，需要注意 .. 以及其他字符。

同时在 Windows 系统中, \ / | : * ? " < > 这样几个字符是不能存在于文件夹名或文件名中的，将其转换为下划线 _。

```ts
export const normalizeFileName = (fileName: string): string => {
    if (!fileName || typeof fileName !== 'string') {
        throw new Error('fileName must be a String')
    }
    fileName = fileName.replace(/[\\/|:*?"><]/g, '_')
    return fileName
}
```

## 处理敏感文件

要点如下:

- 用户上传的 身份证 、 银行卡 等图片，属敏感资源文件，应采取安全加固。 
- 指向此类文件的URL，应保证不可预测性同时，确保无接口会批量展示此类资源的URL。 
- 访问敏感资源文件时，应进行权限控制。默认情况下，仅用户可查看、操作自身敏感资源文件。 
- 图片类文件应添加业务水印，表明该图片仅可用于当前业务使用。
