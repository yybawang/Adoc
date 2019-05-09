import React from 'react'

class Template extends React.Component {
    constructor(props){
        super(props);
    }
    
    static Api(){
        return `
**简要描述：**

- 描述

**请求URL：**
- \` http://xx.com/api/ \`

**请求方式：**
- POST

**参数：**

|参数名|必选|类型|说明|
|:----    |:---|:----- |-----   |
|username |是  |string |用户名   |
|password |是  |string | 密码    |
|name     |否  |string | 昵称    |

 **返回示例**

\`\`\`
  {
    "code": 0,
    "message": "OK",
    "data": {
      "id": "1",
      "username": "yybawang",
      "name": "晏勇",
      "created_at": "2020-11-11 12:09:21",
      "updated_at": "2020-11-11 12:09:21",
    }
  }
\`\`\`

 **返回参数说明**

|参数名|类型|说明|
|:-----  |:-----|-----                           |
|username | string   | 用户昵称  |

 **备注**

- 更多返回错误代码请看首页的错误代码描述


`;
    }
    
    static Table(){
        return `
-  数据源说明

|字段|类型|空|默认|注释|
|:----    |:-------    |:--- |-- -|------      |
|uid    |int(10)     |否 |  |             |
|username |varchar(20) |否 |    |   用户名  |
|password |varchar(50) |否   |    |   密码    |
|name     |varchar(15) |是   |    |    昵称     |
|created_at | timestamp     |否   | null  |   注册时间  |

- 备注：无


`;
    }
}

export default Template;
