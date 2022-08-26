type User = {
  name?: string;
  phone?: string;
}

// 数据对象 xxxDO
interface UserDO extends User {
  id: number
}

export type GetUserApi = {
  PathParams: {
    userId: number
  }
  QueryParams: never
  RequestBody: never
  ResponseBody: User
};

export type AddUserApi = {
  PathParams: never;
  QueryParams: never
  RequestBody: User
  ResponseBody: {
    code: number;
    message: string;
  }
};


export type UpdateUserApi = {
  PathParams: never;
  QueryParams: never
  RequestBody: UserDO
  ResponseBody: {
    code: number;
    message: string;
  }
};


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


const a:  GetUsersApi['RequestBody'] = {
  searchCond: {},
  pageSize: 1,
  pageNo: 1
}

let users: GetUsersApi['ResponseBody'] = [
  {
    id: 1,
  }
]