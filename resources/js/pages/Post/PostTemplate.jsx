import React from 'react'

class PostTemplate {
    
    static Api(){
        return `
**简要描述：**

- 描述

**请求URL：**
- \` http://xx.com/api/ \`

**请求方式：**
- POST

**参数：**

| 参数名   |必选  | 类型   | 说明   | 默认 |
|:----    |:---  |:----- |-----   | --- |
|username |是    |string |用户名   |     |
|password |是    |string | 密码    |     |
|name     |否    |string | 姓名    | 空字符 |

 **返回示例**

\`\`\`
    {
        "code": 0,
        "message": "OK",
        "data": {
            "id": "1",
            "username": "yybawang",
            "name": "测试",
            "created_at": "2020-11-11 12:09:21",
            "updated_at": "2020-11-11 12:09:21",
        }
    }
\`\`\`

 **返回参数说明**

|参数名 | 类型 | 说明   |
|:----- |:-----  |-----  |
| code | int | 全局错误码，0 成功，其他值都为失败  |
| message | string | 成功/失败提示信息  |
| data | array/object | 成功时返回的数据，根据每个接口不同，如果是失败，则只有默认值-->空数组  |
| data.username | string  | 登录名 |

 **备注**

- 无


`;
    }
    
    static Table(){
        return `
-  **数据源说明**

|字段        |类型        |空   |默认  |注释         |
|:----      |:-------    |:--- |---   |------      |
|uid        |int(10)     |否   |      |            |
|username   |varchar(20) |否   |      |   用户名    |
|password   |varchar(50) |否   |      |   密码      |
|name       |varchar(15) |是   |      |   昵称      |
|created_at | timestamp  |否   | null |   注册时间  |
- 备注：无


`;
    }
}

export default PostTemplate;
