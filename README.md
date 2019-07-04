### Adoc

> Just **A**nother markdown **doc** editor

PHP 7.2 + Laravel 5.8 + React-Bootstrap

#### Feature

1. UI使用了直角主题
2. 编辑快捷键添加 ctrl/cmd + shift + s 保存并返回
3. 添加了文档活动记录，暂无其他用途，只是个历史查看谁改动了哪些文档
4. github 风格文档历史对比
5. 添加文档附件功能
6. 编辑、展示和导出都使用 editor.md，(showdoc编辑和展示是两个不同的程序)
7. 文档菜单无限极分类(编辑父级同样)
8. 文档菜单滑动到顶部优化
9. 文档搜索


#### 安装

```bash
git clone https://github.com/yybawang/adoc.git
cd adoc
cp .env.example .env
```

- 新建mysql/maraidb数据库，当然你可以选择其他数据库，运行迁移即可
```
sql CREATE SCHEMA `adoc` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci; 
```

```bash
// 编辑配置文件中的 APP_URL、数据库、redis连接
vi .env

// 下载包
composer install

// 生成key，数据库迁移等
php artisan key:generate
php artisan storage:link    // 导出下载时需要
php artisan migrate

// 下载 npm 包，进行前端编译
npm install
npm run prod

// 访问 APP_URL 测试
```

* [x] 项目功能
    * [x] 项目新增
    * [x] 项目配置
    * [x] 项目权限分配，使用 gate
    * [x] 项目删除
    * [x] 项目所有权转移
    * [ ] 项目置顶，列表排前显示，替代排序功能
    * [ ] 项目tag标签
    * [ ] 列表可选使用 tag 分组展示
* [x] 文档功能
    * [x] 文档增删改查
    * [x] 文档自定义模版
    * [x] 文档修改历史，对比、还原
    * [x] 文档模版
    * [x] markdown 编辑器图片上传，上传到 laravel 配置的 filesystem 配置中，默认 public
    * [x] 编辑器快捷键支持， Ctrl/Cmd + s 保存(停留当前页)， Ctrl/Cmd + Shift + S 保存并返回
    * [ ] 文档编辑时可能已被修改过，提示合并
    * [x] 文档搜索，头部右上角，暂只支持搜索当前展示项目下文档
    * [x] 文档排序，默认时间先后顺序
    * [x] 文档附件


![示例](https://raw.githubusercontent.com/yybawang/images/master/adoc/Xnip2019-05-25_12-28-38.png)
![示例](https://raw.githubusercontent.com/yybawang/images/master/adoc/Xnip2019-07-04_18-07-30.png)
![示例](https://raw.githubusercontent.com/yybawang/images/master/adoc/Xnip2019-07-04_18-07-44.png)
![示例](https://raw.githubusercontent.com/yybawang/images/master/adoc/Xnip2019-07-04_18-07-58.png)
![示例](https://raw.githubusercontent.com/yybawang/images/master/adoc/Xnip2019-05-25_13-06-16.png)
