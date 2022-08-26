# 共享 api 类型

使用 node 开发服务端有一个巨大的好处：客户端和服务器都使用相同的 TypeScript 规范。

## 参数定义

```ts
// 用户类型
export type User = {
  // 姓名
  name?: string;
  // 手机号
  phone?: string;
}

// 数据对象 xxxDO
export interface UserDO extends User {
  id: number
}

/**
 * 获取用户信息的 API  
 */
export type GetUserApi = {
  // API 版本号，可以根据当前 api 版本进行不同的兼容
  version: number
  // 路径参数。 /user/:userId => /user/1
  PathParams: {
    userId: number
  }
  // 请求参数 /user/1?xxx=xxxx&bbb=bbb
  QueryParams: never
  // 请求 Body 用于非 get 请求，post 或者 put 
  RequestBody: never
  // 返回对象
  ResponseBody: User
};

/**
 * 添加用户信息的 API  
 */
export type AddUserApi = {
  PathParams: never;
  QueryParams: never
  RequestBody: User
  ResponseBody: {
    code: number;
    message: string;
  }
};

/**
 * 更新用户信息的 API  
 */
export type UpdateUserApi = {
  PathParams: never;
  QueryParams: never
  RequestBody: UserDO
  ResponseBody: {
    code: number;
    message: string;
  }
};

/**
 * 删除用户信息的 API  
 */
export type RemoveUserApi = {
  PathParams: never;
  QueryParams: never
  RequestBody: {
    id: number
  }
  ResponseBody: {
    code: number;
    message: string;
  }
}

/**
 * 获取用户信息的 API  
 */
export type GetUsersApi = {
  PathParams: never
  QueryParams: never
  RequestBody: {
    searchCond: Record<string, any>;
    pageSize: number;
    pageNo: number;
  }
  ResponseBody: UserDO[]
};
```

对于 ts 来说，我们还可以提取其中的参数

```ts
let users: GetUsersApi['ResponseBody'] = [
  {
    id: 1,
  }
]
```

## 前端引入并使用

```ts
import axios from 'axios';
import { GetUserApi, User } from '../shared-types/UsersApi';

export const getUser = async (userId: number): Promise<User> => {
  const { data } = await axios.get<GetUserApi['ResponseBody']>(`/api/users/${userId}`);
  return data;
};

export const getUsers = async (): Promise<User[]> => {
  const { data } = await axios.get<User[]>('/api/users');
  return data;
};
```