gulp-riot-css
=============
## 项目起因
    riot模板中css样式会被直接添加到head中,容易造成污染，比如说两个模块中都有h1标签，那么同时使用这两个模块的话就会相互影响。
    解决方法：
        给模块内样式选择器添加范围限定，比如说，属性选择器[riot-tag=tagName]或者标签选择器tagName。
        使用gulp-riot-css可以自动给riot模块内css样式选择器添加范围限定。
        并且可以将外部的css引入到模块内，单独加载模块时无需另外加载样式文件

## 项目说明
* 拆分riot中sytle标签,包裹在属性选择器[riot-tag=**]或者标签选择器中输出
* 可以生成单独的css和js，也可以只生成js文件（css样式部分在js内部），还可以引入外部的css
* 分别生成单独的scs和js文件,可以分别定义输出文件目录
* ie7已经支持属性选择器,riot使用h5和es5插件可以兼容到ie8
* 该方式适用与某一模块的单独样式,对通用样式,建议不要写在模块内

## 使用方式
首先你需要安装gulp-riot-css和gulp
    npm install -d gulp-riot-css
    npm install -d gulp

```javascript
var gulp = require('gulp');
var riot_css = require('gulp-riot-css');

gulp.task('riot_css', function () {
    gulp.src(['./*.html'])
        .pipe(riot_css({css: 'css/riot_tag.css', js: 'js/riot_tag.js'}))
        .pipe(gulp.dest('./output'));
});

gulp.task('default', ["riot_css"]);
```

## 参数说明
* gulp调用时参数
参数  |   类型   |  默认值  | 说明
------|----------|----------|------
js    | string   | 'riot_tag.js' |  指定生成的js存放位置及文件名
css   | string   |  ''       |  指定生成的css存放位置及文件名,扩展名为scss或sass或less时,直接将style包裹在属性标签内部,当为空时,则不单独生成style,直接将style包含在tag模板内
type  | string   |  'all'    | 指定输出css限定范围使用属性选择器还是标签选择器。'all'同时输出两种模式,'attr'输出属性选择器,'tagName'输出标签选择器
define| boolean  | false    |是否使用define标签包裹，便于requirejs引用

* 模块内引入外部css
> 在模块内增加style节点<style src="test.css" addtag="true"></style>,将会自动引入test.css文件并增加样式范围限定。参考test/test3.html
参数 |  说明
------------
src  |  引入的css文件位置
addtag | css中样式选择器是否增加范围限定



## 示例（参考test目录下文件）
```html
<test>
    <style>
        h1 {
            color: green;
        }
        .content {
            color: blue;
        }
    </style>
    <h1>This is a test file</h1>
    <div class="content">{content}</div>
    <script>
        this.content = 'This is content;';
    </script>
</test>
```
将生成
```css
/**这是gulp-riot-model根据riot模板生成的文件.如需修改,请修改riot模板后重新编译*/
[riot-tag=test] h1,test h1
{
  color: green;
}
[riot-tag=test] .content,test .content
{
  color: blue;
}
```
和
```javascript
/** ----- created by gulp-riot-css -----*/
riot.tag('test', '<h1>This is a test file</h1> <div class="content">{content}</div>', function(opts) {
        this.content = 'This is content;';

});
```

## 版本更新
### 0.3.1
* 引入外部css文件
### 0.3.0
* 修复@media媒体选择器bug
### 0.2.9
* 修复范围限定词bug
### 0.2.8
* 删除注释
* 减少体积，根据参数只使用一种选择器样式
### 0.2.7
* 修复.__root和.__self bug
### 0.2.6
* 判断是否存在重复文件，重复时提示错误
### 0.2.5
* 修改define生成方式，改为tag外部，不包裹riot.tag内容
* 空文件时不生成内容
* 0.2.4 修复错误：多重条件选择时(例如：.__self.cls) 转换时不能增加空格
* 0.2.3 增加define参数，便于requirejs引用:define值为string或true，为string时，define代表标签前缀，例如define='tag_',则生成define('tag_tagName',function(){});
* 0.2.2 不指定js文件名时,将按照tag名称输出js文件
* 0.2.1 style在tag内部时,可以包含.__root和.__self
* 0.2.0 当没有css路径参数时,style样式保存到tag内部,不单独生成css文件
* 0.1.9 修复riot升级后无法编译错误(固定版本为2.2.4)
* 0.1.9 样式增加节点名称选择器
* 0.1.8 生成less和scss时,将.__root替换为@at-root(跳出选择器范围)
* 0.1.7 生成less和scss时,将.__self替换为&(指定本节点属性)
* 0.1.6 修复部分错误
* 0.1.5 根据css扩展名(sass,scss,less) 直接将style用标签包裹,便于之后sass或less编译
