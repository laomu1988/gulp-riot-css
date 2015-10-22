gulp-riot-css
=============
# 项目起因
    riot模板中样式内容使用时会直接写入body的style中,使用的是全局属性,非常容易造成污染.
    解决方式非常简单,riot渲染模板后,会在渲染盒子上增加属性riot-tag,所以我们只要把style放在[riot-tag="model-name"]中即可.

# 项目说明
* 拆分riot中sytle标签,包裹在[riot-tag=**]标签中输出
* 分别生成单独的scs和js文件,可以分别定义输出文件目录
* ie7已经支持属性选择器,riot使用h5和es5插件可以兼容到ie8

# 使用方式
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
* css string 'riot_tag.css' 指定生成的css存放位置及文件名
* js string 'riot_tag.js' 指定生成的js存放位置及文件名
* note string '这是gulp-riot-model根据riot模板生成的文件.如需修改,请修改riot模板后重新编译'  文件顶部注释
* tab string '  ' css tab标签(默认两个空格)

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
[riot-tag=test] h1
{
  color: green;
}
[riot-tag=test] .content
{
  color: blue;
}
```
和
```javascript
/**这是gulp-riot-model根据riot模板生成的文件.如需修改,请修改riot模板后重新编译*/
riot.tag('test', '<h1>This is a test file</h1> <div class="content">{content}</div>', function(opts) {
        this.content = 'This is content;';
    
});
```
