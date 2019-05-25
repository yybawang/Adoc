<!DOCTYPE HTML>
<!--
	Ethereal by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
-->
<html>
<head>
    <title>Adoc - A Doc editor</title>
    <meta charset="utf-8" />
    <meta name="description" content="API文档编辑, show me the doc" />
    <meta name="keywords" content="api doc,doc,api文档,文档编辑,在线文档,markdown文档,adoc" />
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
    <link rel="stylesheet" href="{{asset('/assets/css/main.css')}}" />
    <noscript><link rel="stylesheet" href="{{asset('/assets/css/noscript.css')}}" /></noscript>
</head>
<body class="is-preload">

<!-- Page Wrapper -->
<div id="page-wrapper">
    
    <!-- Wrapper -->
    <div id="wrapper">
        
        <!-- Panel (Banner) -->
{{--        可以用它临时分享文档--}}
        <section class="panel banner right">
            <div class="content color0 span-3-75">
                <h1 class="major">Hello</h1>
                <p>一个<strong>轻松</strong>的 Markdown 文档编辑器</p>
                <p><strong>设计完整</strong>的 API 文档工作流</p>
                <p title="简单清晰 right?">💚️ Nice to meet you ...again :)</p>
                <ul class="actions">
                    <li><a href="#first" class="button primary color1 circle icon fa-angle-right">Next</a></li>
{{--                    <li><a href="/project">项目列表</a></li>--}}
                </ul>
            </div>
            <div class="image filtered span-1-75" data-position="25% 25%">
                <img src="{{asset('/images/pic01.jpg')}}" alt="" />
                <div style="position:absolute;top:5rem;left:3rem;">
                    <h2 class="major">Go</h2>
                    <h4><a target="_self" href="/project">项目列表</a></h4>
                    <h4><a target="_self" href="/project_add">新建项目</a></h4>
                    <h4><a target="_self" href="/login">登录</a></h4>
                    <h4><a target="_self" href="/register">注册</a></h4>
                </div>
            </div>
        </section>
        
        <!-- Panel (Spotlight) -->
        <section class="panel spotlight medium right" id="first">
            <div class="content span-7">
                <h2 class="major">Write</h2>
                <p>我们只采用了 Markdown 做为<strong>唯一</strong>的文档编辑格式，这样会更好的统一风格，它易于排版，易于学习</p>
                <p>更重要的是它应该是你必备的<strong>专业技能</strong></p>
                <p>可以在这里<a target="_blank" href="//'">查看</a> Markdown 语法教程</p>
                <p>💛 Enjoy Writing ;)</p>
            </div>
            <div class="image filtered tinted" data-position="top left">
                <img src="{{asset('/images/pic02.jpg')}}" alt="" />
            </div>
        </section>
        
        <!-- Panel -->
        <section class="panel color1">
            <div class="intro joined">
                <h2 class="major">About</h2>
                <p>为了提升开发与使用的愉悦感，选择了 Laravel + React + Mysql，它们都经得起考验，我希望 Adoc 也是</p>
                <div>Laravel 5.8</div>
                <div>React 16.8.6</div>
                <div>Mysql 5.7</div>
                <div>Bootstrap v4</div>
                <p>💙 Yes,  I do</p>
            </div>
            <div class="inner">
                <ul class="grid-icons three connected">
                    <li><span class="icon fa-diamond"><span class="label">Lorem</span></span></li>
                    <li><span class="icon fa-camera-retro"><span class="label">Ipsum</span></span></li>
                    <li><span class="icon fa-cog"><span class="label">Dolor</span></span></li>
                    <li><span class="icon fa-paper-plane"><span class="label">Sit</span></span></li>
                    <li><span class="icon fa-bar-chart"><span class="label">Amet</span></span></li>
                    <li><span class="icon fa-code"><span class="label">Nullam</span></span></li>
                </ul>
            </div>
        </section>
        
        <!-- Panel (Spotlight) -->
        <section class="panel spotlight large left">
            <div class="content span-5">
                <h2 class="major">Adoc</h2>
                <p>就叫它 Adoc 吧，Just another markdown doc editor</p>
                <p>这是一个免费开源的项目，代码已托管 <a target="_blank" href="//github.com/yybawang/adoc">Github</a>，你可以随时查看它，并且可以 <a target="_blank" href="//github.com/yybawang/adoc">Star</a> 它</p>
                <p>❤️ I hope Adoc can help you</p>
            </div>
            <div class="image filtered tinted" data-position="top right">
                <img src="{{asset('/images/pic03.jpg')}}" alt="" />
            </div>
        </section>
        
        <!-- Panel -->
        <section class="panel">
            <div class="intro color2">
                <h2 class="major">Finally</h2>
                <p>Try me</p>
                <p>🍻🍻🍻🍻🍻 Cheers!</p>
                <p>😘</p>
            </div>
        </section>
        
        <!-- Copyright -->
        <div class="copyright">&copy; 由 <a target="_blank" href="//github.com/yybawang">yybawang</a> 设计和编码 💜</div>
    
    </div>

</div>

<!-- Scripts -->
<script src="{{asset('/assets/js/jquery.min.js')}}"></script>
<script src="{{asset('/assets/js/browser.min.js')}}"></script>
<script src="{{asset('/assets/js/breakpoints.min.js')}}"></script>
<script src="{{asset('/assets/js/main.js')}}"></script>

</body>
</html>
