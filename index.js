'use strict';

var through = require('through2');
var path = require('path');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var File = gutil.File;
var cheerio = require('cheerio');
var compile = require('riot').compile;
var fs = require('fs');

/**分两步进行,1.拆分,2.编译
 * 1.拆分: cheerio获取style; 获取外围节点名称
 * 2.编译生成riot和js文件
 * */
module.exports = function (opt) {
    opt = opt || {};
    opt.js = opt.js || '';
    opt.css = opt.css || '';
    opt.type = opt.type || 'all';
    opt.define = opt.define || false;// 是否使用define标签包裹js
    opt.tab = opt.tag || '  ';
    opt.newLine = gutil.linefeed;
    opt.note = '/**' + (opt.note || ' ----- created by gulp-riot-css -----') + '*/' + opt.newLine;

    // 输出选择器内容
    switch (opt.type.toLowerCase()) {
        case 'tagname':
            opt.tagName = true;
            break;
        case 'attr':
            opt.attr = true;
            break;
        case 'all':
        default:
            opt.tagName = true;
            opt.attr = true;
    }
    var js = opt.note, css = opt.note, backFile = null;

    var tags = {};

    function SpliteFile(file, that) {
        var $ = cheerio.load(String(file.contents) + '', {decodeEntities: false});
        var root = $.root();
        var children = $.root().children();
        var tagName = '';
        if (children.length > 0) {
            tagName = children[0].name;
        }
        if (!tagName) {
            return;
        }
        tagName = tagName.trim();
        if (tags[tagName]) {
            console.error("重复： ", tagName, file.path, tags[tagName]);
        }
        tags[tagName] = file.path;

        // console.log('tagName:', tagName);
        var style = $('style');
        var style_html = style.html();
        // console.log('todo: style标签通过src引入外部文件');
        if (style.attr('src')) {
            var source = path.join(path.dirname(file.path), style.attr('src'));
            style_html = fs.readFileSync(source, 'utf8') + '';
            if (style.attr('addtag')) {
                style_html = styleAddTag(style_html, tagName);
            }
        } else {
            style_html = styleAddTag(style.html(), tagName);
        }

        if (opt.css) {
            css += style_html + opt.newLine;
            style.remove();
        }
        else {
            style.html(style_html);
        }
        var tempJs = compile($.html()) + opt.newLine;
        if (typeof opt.define == 'string') {
            tempJs = tempJs + opt.newLine + 'define("' + opt.define + tagName + '",function(){});' + opt.newLine;
        }
        /* else if (opt.define == true) {
         tempJs = tempJs + opt.newLine + 'define(function(){});' + opt.newLine;
         }*/
        if (opt.js) {
            js += tempJs;
        }
        else {
            pushFile(tagName + '.js', tempJs, that);
        }
    }

    /** 为css增加外围标签*/
    function styleAddTag(style, tag) {
        if (!style) {
            return '';
        }
        var cssExt = path.extname(opt.css).substring(1).toLowerCase();
        var isCss = true;
        if (cssExt === 'less' || cssExt === 'scss' || cssExt === 'sass') {
            isCss = false;
        }
        var attrTag = '[riot-tag=' + tag + ']';

        // 删除注释
        style = style.replace(/\/\*[\w\W]*?\*\//g, '');

        // 输出到scss、sass或less
        if (!isCss) {
            style = style.replace(/\.__self(?=\W)/g, '&');
            style = style.replace(/\.__root(?=\W)/g, '@at-root');
            var scope = '';
            if (opt.attr) {
                scope += attrTag;
            }
            if (opt.tagName) {
                scope += (scope ? ',' : '') + tag;
            }
            return scope + ' {\n' + style.trim() + '\n}\n';
        }

        style += '';
        style = style.trim();
        // 匹配选择器
        style = style.replace(/([^\{\}]*)\{/g, function (a, selector) {
            if (selector) {
                if (selector.indexOf('@media') >= 0) {
                    return '\n' + a.trim();
                }
                selector = selector.replace(';', '');
                var selectors = selector.split(',');
                selector = '';
                for (var i = 0; i < selectors.length; i++) {
                    var s = selectors[i].trim();
                    selector += (selector ? ', ' : '' ) + replaceSelector(s, tag);
                }
                selector = selector.replace(/\s+:/g, ':');
                return '\n' + selector + '\n{\n';
            }
        });
        style = beautify(style);
        return style.trim();
    }

    // 美化样式格式
    function beautify(style) {
        return style.replace(/[\{\n\s\};]+/g, function (str) {
            if (str.indexOf('}') >= 0) {
                return str.trim().replace(/\s+/g, '') + '\n';
            }
            return str.trim() + ' ';
        });
    }

    /**替换选择器*/
    function replaceSelector(selector, tag) {
        var attrTag = '[riot-tag=' + tag + ']';
        var temp = selector;
        if (selector.indexOf('.__self') >= 0) {
            selector = '';
            if (opt.attr) {
                selector = temp.replace(/\.__self/, attrTag);
            }
            if (opt.tagName) {
                selector += (selector ? ',' : '') + temp.replace(/\.__self/, tag);
            }
        }
        //s = s.trim();
        if (selector.indexOf('.__root') >= 0) {
            selector = selector.replace(/\.__root/, '');
            return selector;
        }
        // 假如自身不带有限定范围词(.__self)，则增加限定
        if (selector.indexOf(attrTag) == -1 && temp.indexOf('.__self') == -1) {
            temp = selector;
            selector = '';
            if (opt.attr) {
                selector = attrTag + ' ' + temp;
            }
            if (opt.tagName) {
                selector += (selector ? ',' : '') + tag + ' ' + temp;
            }
            return selector;
        } else {
            return selector;
        }
    }


    function bufferContents(file, enc, cb) {
        // 空文件直接跳转
        if (file.isNull()) {
            cb();
            return;
        }
        // we don't do streams (yet)
        if (file.isStream()) {
            this.emit('error', new PluginError('gulp-html', 'Streaming not supported'));
            cb();
            return;
        }
        backFile = file;
        SpliteFile(file, this);
        cb();
    }

    /**当所有一系列的文件处理完毕后会调用endStream*/
    function endStream(cb) {
        // no files passed in, no file goes out
        if (!backFile) {
            cb();
            return;
        }
        if (opt.js) {
            pushFile(opt.js, js, this);
        }
        if (opt.css) {
            pushFile(opt.css, css, this);
        }
        cb();
    }

    function pushFile(name, content, that) {
        if (!that) {
            console.error('未知文件流!');
        }
        if (content.trim().length == 0) {
            return;
        }
        // console.log(that);
        var file = backFile.clone({contents: false});
        file.path = path.join(backFile.base, name);
        file.contents = new Buffer(content);
        that.push(file);
    }

    return through.obj(bufferContents, endStream);
};
