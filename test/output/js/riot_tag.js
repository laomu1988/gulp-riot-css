/**这是gulp-riot-model根据riot模板生成的文件.如需修改,请修改riot模板后重新编译*/
riot.tag('test', '<div class="test"> <h1>This is a test file</h1> <div class="content">{content}</div> </div>', function(opts) {
            this.content = 'This is content;';
        
});
riot.tag('test2', '<h1>This is a test file</h1> <div class="content">{content}</div>', function(opts) {
        this.content = 'This is content;';
    
});
