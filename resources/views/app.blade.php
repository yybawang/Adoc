<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="icon" href="data:;base64,iVBORw0KGgo=" />
    <link href="{{mix('css/app.css', '/dist')}}" rel="stylesheet" type="text/css">
    <title>{{config('app.name')}}</title>
</head>
<body>
<div id="app"></div>
<div id="example"></div>
<script src="{{mix('js/manifest.js', '/dist')}}"></script>
<script src="{{mix('js/vendor.js', '/dist')}}"></script>
<script src="{{mix('js/app.js', '/dist')}}"></script>
</body>
</html>
