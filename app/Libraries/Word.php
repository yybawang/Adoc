<?php
/**
 * 原生写入 word 文档
 */
namespace App\Libraries;

use Illuminate\Support\Facades\Storage;

class Word {
    protected $html = '';
    protected $count = 1;
    
    public function addPost($post){
        $html = <<<EOT
<h1>{$this->count}、{$post->name}</h1>
{$post->html}
EOT;

        $this->html .= $html;
        $this->count++;
        return $this;
    }
    
    /**
     * 保存文件并返回 url
     * @param string $path
     * @return mixed
     */
    public function save(string $path){
        $css = file_get_contents(public_path('editor.md/css/editormd.min.css'));
        $html = <<<EOT
<html
    xmlns:v="urn:schemas-microsoft-com:vml"
    xmlns:o="urn:schemas-microsoft-com:office:office"
    xmlns:w="urn:schemas-microsoft-com:office:word"
    xmlns="http://www.w3.org/TR/REC-html40">
<head>
    <meta http-equiv=Content-Type content="text/html; charset=utf-8">
    <meta name=ProgId content=Word.Document>
    <meta name=Generator content="Microsoft Word 11">
    <meta name=Originator content="Microsoft Word 11">
    <xml><w:WordDocument><w:View>Print</w:View></xml>
    <style>
        table
        {
            border-collapse: collapse;
            border: none;
            width: 100%;
        }
        th,td
        {
            padding-left: 6px;
            padding-right: 6px;
            border: solid #CCC 1px;
        }
        .codebg{
                word-break: break-all;
                background:silver;mso-highlight:silver;
            }
{$css}</style>
</head>
<body>
<div class="markdown-body editormd-html-preview">
{$this->html}
</div>
</body>
</html>
EOT;
        $html = str_replace([
            '<pre><code>',
            '</code></pre>',
        ], [
            '<table width="100%" class="codebg"><pre><code>',
            '</code></pre></table>',
        ], $html);
        $save_path = 'exports/'.date('Ymd').'/'.date('Hi').'/'.$path;
        $var = Storage::put($save_path, $html);
        if(!$var){
            exception('写入文件失败');
        }
        return Storage::url($save_path);
    }
}
