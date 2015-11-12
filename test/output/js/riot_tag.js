/** ----- created by gulp-riot-css -----*/
riot.tag('test', '<div> <h1>This is a test file</h1> <div class="content">{content}</div> </div>', function(opts) {
            this.content = 'This is content;';
        
});
riot.tag('test2', '<h1>This is a test file</h1> <div class="content">{content}</div>', function(opts) {
        this.content = 'This is content;';
    
});
