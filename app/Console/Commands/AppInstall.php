<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class AppInstall extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:install
                            {--force : 强制覆盖安装}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = '项目初始化安装';

    protected $env_path;
    protected $env_example_path;

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
        $this->env_path = base_path('.env');
        $this->env_example_path = base_path('.env.example');
    }

    /**
     * Execute the console command.
     * 1. 询问项目名称
     * 2. 询问项目域名
     * 3. 询问mysql地址，端口，用户名，密码(数据库自动创建为 adoc)
     * 4. 询问 redis 连接地址，端口，密码
     * 5. 写入 .env 文件
     * 6. 创建数据库 adoc
     * 7. 生成key，执行迁移和数据库填充
     * 8. 写入 storage/.installed.key 文件
     * @return mixed
     */
    public function handle()
    {
        $this->line('');
        $this->info('************************************');
        $this->info('*         Welcome to Adoc          *');
        $this->info('************************************');
        $this->line('');

        $force = $this->option('force');
        $installed = storage_path('.installed.key');
        if(file_exists($installed) && !$force){
            $this->error('Already Installed.');
            exit(1);
        }
        $envs = $this->readEnv();

        $APP_NAME = $this->ask('输入项目名称', $envs['APP_NAME'] ?: 'Adoc');
        $envs['APP_NAME'] = $APP_NAME;
        $APP_URL = $this->ask('输入项目地址]', $envs['APP_URL'] ?: 'http://adoc.test');
        $envs['APP_URL'] = $APP_URL;
        $DB_HOST = $this->ask('输入 MYSQL 连接地址', $envs['DB_HOST'] ?: '127.0.0.1');
        $envs['DB_HOST'] = $DB_HOST;
        $DB_PORT = $this->ask('输入 MYSQL 连接端口', $envs['DB_PORT'] ?: '3306');
        $envs['DB_PORT'] = $DB_PORT;
        $DB_USERNAME = $this->ask('输入 MYSQL 连接用户名', $envs['DB_USERNAME'] ?: 'root');
        $envs['DB_USERNAME'] = $DB_USERNAME;
        // 使用显式密码，方便安装
        $DB_PASSWORD = $this->ask('输入 MYSQL 连接密码', $envs['DB_PASSWORD'] ?: '');
        $envs['DB_PASSWORD'] = $DB_PASSWORD;
        $REDIS_HOST = $this->ask('输入 REDIS 连接地址', $envs['REDIS_HOST'] ?: '127.0.0.1');
        $envs['REDIS_HOST'] = $REDIS_HOST;
        $REDIS_PORT = $this->ask('输入 REDIS 连接端口', $envs['REDIS_PORT'] ?: '6379');
        $envs['REDIS_PORT'] = $REDIS_PORT;
        $REDIS_PASSWORD = $this->ask('输入 REDIS 连接密码', $envs['REDIS_PASSWORD'] ?: 'null');
        $envs['REDIS_PASSWORD'] = $REDIS_PASSWORD;

        $ok = $this->writeEnv($envs);
        if(!$ok){
            $this->error('配置文件写入失败，请检查权限、中文路径问题');
            exit(1);
        }else{
            $this->info('配置写入完成.');
        }
        // 底层 env 配置是静态数组，无法reload，所以动态写入mysql配置
        config([
            'database.connections.mysql.host'=> $DB_HOST,
            'database.connections.mysql.port'=> $DB_PORT,
            'database.connections.mysql.database'=> '',
            'database.connections.mysql.username'=> $DB_USERNAME,
            'database.connections.mysql.password'=> $DB_PASSWORD,
        ]);
        DB::statement('drop schema if exists adoc');
        $ok = DB::statement('CREATE SCHEMA `adoc` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
        config(['database.connections.mysql.database'=> 'adoc']);
        if(!$ok){
            $this->error('创建数据库失败，请检查数据库配置');
            exit(1);
        }else{
            $this->info('创建数据库[adoc]完成');
        }
        $this->call('key:generate');
        // 切换数据库之后要建立一个新的连接
        DB::reconnect();
        $this->call('migrate:fresh', ['--force'=> true]);
        $this->call('storage:link');
        file_put_contents($installed, now());

        $this->line('');
        $this->comment('安装成功，接下来配置 HTTP 服务器：');
        $this->comment('1、配置访问域名，推荐使用 Nginx，可参考本项目目录下的 adoc_nginx.conf');
        $this->comment('2、重启 HTTP 服务器，访问域名测试');
        $this->comment('3、访问 [域名] 开始创建项目');
    }

    protected function readEnv(){
        if (! file_exists($this->env_path)) {
            if (file_exists($this->env_example_path)) {
                copy($this->env_example_path, $this->env_path);
            } else {
                $this->error('.env.example 模版配置文件不存在');
            }
        }
        return $this->readEnvContent($this->env_path);
    }

    private function readEnvContent($path){
        $string = file_get_contents($path);
        $lines = explode("\n", $string);
        $envs = [];
        foreach ($lines as $line){
            if(empty($line)){
                $envs[] = '';
                continue;
            }
            $key = stristr($line, '=', true);
            $val = substr(stristr($line, '=', false), 1);
            $envs[$key] = $val;
        }
        return $envs;
    }

    protected function writeEnv(array $envs){
        $lines = [];
        foreach ($envs as $key => $val){
            if(is_integer($key)){
                $lines[] = '';
                continue;
            }
            $lines[] = "$key=$val";
        }
        $string = implode("\n", $lines);
        return file_put_contents($this->env_path, $string);
    }
}
