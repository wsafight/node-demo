对于小公司和个人开发者来说，Node 无疑是一把利器。

周树人先生曾今说过：

> 任何可以先用 JavaScript 来写的应用，都可以先用 TypeScript 来写。

JavaScript 不擅长计算密集型的应用，这也是目前各种前端打包、构建工具转向 Rust 或者 Go 的主要原因。不过对于个人以及目前的团队来说，Node 完全够用了。在遇到性能不够的情况完全可以使用 [N-API](https://napi.rs/) 或者 [WASM](https://webassembly.org/) 去优化。


《通过例子学 Node》（Node By Example）内容由一系列可运行的实例组成，通过这些例子阐明了 Node 基本和进阶功能。

现在让我们开始学习吧！

本文档使用的 node 18.7.0。当然也会在其中介绍与使用一些其他的的 JavaScript 运行时(如果有需要的话):

- [Bun](https://bun.sh/)
- [Just-js](https://github.com/just-js/just)
- [quickjs](https://bellard.org/quickjs/)
- [Hermes](https://hermesengine.dev/)