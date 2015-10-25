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
    opt.js = opt.js || 'riot_tag.js';
    opt.css = opt.css || 'riot_tag.css';
    opt.tab = opt.tag || '  ';
    opt.newLine = gutil.linefeed;
    opt.note = '/**' + (opt.note || '这是gulp-riot-model根据riot模板生成的文件.如需修改,请修改riot模板后重新编译') + '*/' + opt.newLine;
    var js = opt.note, css = opt.note, backFile = null;

    function SpliteFile(file) {
        var $ = cheerio.load(String(file.contents) + '', {decodeEntities: false});
        var root = $.root();
        var children = $.root().children();
        var tagName = '';
        if (children.length > 0) {
            tagName = children[0].name;
        }
        // console.log('tagName:', tagName);
        var style = $('style');
        css += styleAddTag(style.html(), tagName) + opt.newLine;
        style.remove();
        js += compile($.html()) + opt.newLine;
    }

    /** 为css增加外围标签*/
    function styleAddTag(style, tag) {
        var cssExt = path.extname(opt.css).substring(1).toLowerCase();
        var isCss = true;
        if (cssExt === 'less' || cssExt === 'scss' || cssExt === 'sass') {
            isCss = false;
        }
        tag = '[riot-tag=' + tag + '] ';

        if (!isCss) {
            return tag + '{\n' + style.trim() + '\n}\n';
        }

        style += '';
        style = style.trim();
        style = style.replace(/([^\{]*)\{([^\}]*)\}*/g, function (a, selector, style, d) {
            selector = selector.replace(';', '');
            var selectors = selector.split(',');
            selector = '';
            for (var i = 0; i < selectors.length; i++) {
                var s = selectors[i].trim();
                if (s) {
                    selector += (selector ? ', ' : '' ) + tag + s;
                }
            }
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
        SpliteFile(file);
        cb();
    }

    /**当所有一系列的文件处理完毕后会调用endStream*/
    function endStream(cb) {
        // no files passed in, no file goes out
        if (!backFile) {
            cb();
            return;
        }

        var jsFile = backFile.clone({contents: false});
        jsFile.path = path.join(backFile.base, opt.js);
        jsFile.contents = new Buffer(js);
        this.push(jsFile);

        var cssFile = backFile.clone({content: false});
        cssFile.contents = new Buffer(css);
        cssFile.path = path.join(backFile.base, opt.css);
        this.push(cssFile);

        cb();
    }

    return through.obj(bufferContents, endStream);
};
