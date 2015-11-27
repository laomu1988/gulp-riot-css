gulp-riot-css
=============

## 版本更新
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

## 项目起因
    riot模板中css样式会被直接添加到head中,容易造成污染.
    解决方式非常简单,riot渲染模板后,会在渲染盒子上增加属性riot-tag
    所以我们只要把css样式放在[riot-tag=tagName]中即可.
    假如直接使用<tagName><tagName>则不存在[riot-tag=tagName],所以还需要将节点包裹在tagName中.

## 项目说明
* 拆分riot中sytle标签,包裹在[riot-tag=**]标签中输出
* 分别生成单独的scs和js文件,可以分别定义输出文件目录
* ie7已经支持属性选择器,riot使用h5和es5插件可以兼容到ie8
* 该方式适用与某一模块的单独样式,对通用样式,建议写在其他单独的文件中

## 使用方式
* 首先你需要安装gulp-riot-css和gulp
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
* 参数 类型  默认值 说明
* js string 'riot_tag.js' 指定生成的js存放位置及文件名
* css string '' 指定生成的css存放位置及文件名,扩展名为scss或sass或less时,直接将style包裹在属性标签内部,
                当为空时,则不单独生成style,直接将style包含在tag模板内
* define boolean 是否使用define标签包裹，便于requirejs引用
## 示例
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
