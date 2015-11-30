/** ----- created by gulp-riot-css -----*/
riot.tag2('test', '<div> <h1>This is a test file</h1> <div class="content">{content}</div> </div>', '', '', function(opts) {
            this.content = 'This is content;';
            this.go = function()
            {
                this.a = 1;
            }.bind(this)
}, '{ }');
riot.tag2('test2', '<h1>This is a test file</h1> <div class="content">{content}</div>', '', '', function(opts) {
        this.content = 'This is content;';
}, '{ }');
