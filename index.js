'use strict';

var through = require('through2');
var path = require('path');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var File = gutil.File;
var cheerio = require('cheerio');
var compile = require('riot').compile;

/**分两步进行,1.拆分,2.编译
 * 1.拆分: cheerio获取style; 获取外围节点名称
 * 2.编译生成riot和js文件
 * */
module.exports = function (opt) {
    opt = opt || {};
    opt.js = opt.js || '';
    opt.css = opt.css || '';
    opt.define = opt.define || false;// 是否使用define标签包裹js
    opt.tab = opt.tag || '  ';
    opt.newLine = gutil.linefeed;
    opt.note = '/**' + (opt.note || ' ----- created by gulp-riot-css -----') + '*/' + opt.newLine;
    var js = opt.note, css = opt.note, backFile = null;

    function SpliteFile(file, that) {
        var $ = cheerio.load(String(file.contents) + '', {decodeEntities: false});
        var root = $.root();
        var children = $.root().children();
        var tagName = '';
        if (children.length > 0) {
            tagName = children[0].name;
        }
        // console.log('tagName:', tagName);
        var style = $('style');
        var style_addTag = styleAddTag(style.html(), tagName);
        if (opt.css) {
            css += styleAddTag(style.html(), tagName) + opt.newLine;
            style.remove();
        }
        else {
            style.html(style_addTag);
        }
        var tempJs = compile($.html()) + opt.newLine;
        if (typeof opt.define == 'string') {
            tempJs = 'define("' + opt.define + tagName + '",function(){' + opt.newLine + tempJs + '});';
        }
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
        var attrTag = '[riot-tag=' + tag + '] ';

        if (!isCss) {
            style = style.replace(/\.__self(?=\W)/g, '&');
            style = style.replace(/\.__root(?=\W)/g, '@at-root');
            return attrTag + ', ' + tag + ' {\n' + style.trim() + '\n}\n';
        }

        style += '';
        style = style.trim();
        // 匹配选择器
        style = style.replace(/([^\{]*)\{([^\}]*)\}*/g, function (a, selector, style, d) {
            selector = selector.replace(';', '');
            var selectors = selector.split(',');
            selector = '';
            for (var i = 0; i < selectors.length; i++) {
                var s = selectors[i].trim();
                if (s) {
                    // console.log('selector: ',s);
                    if (s.indexOf('.__self') >= 0) {
                        s = s.replace('.__self', '');
                    }
                    s = s.trim();
                    if (s.indexOf('.__root') >= 0) {
                        s = s.replace('.__root', '');
                        s = s.trim();
                        selector += s;
                        continue;
                    }
                    selector += (selector ? ', ' : '' ) + attrTag + s + ',' + tag + ' ' + s;
                    selector = selector.replace(/\s+\:/g, ':');
                }
            }
            //console.log(selector);
            // 格式化
            style = style.trim();
            style = style.replace(/[\r\n]+\s*/g, '\n' + opt.tab);
            return selector + '\n{\n' + opt.tab + style.trim() + '\n}\n';
        });
        return style.trim();
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
        var file = backFile.clone({contents: false});
        file.path = path.join(backFile.base, name);
        file.contents = new Buffer(content);
        that.push(file);
    }

    return through.obj(bufferContents, endStream);
};
