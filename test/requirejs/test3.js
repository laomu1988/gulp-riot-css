riot.tag('test3', ' <h1>This is a test file</h1> <div class="content">{content}</div>', '[riot-tag=test3] .h1,test3 .h1{ color: red;}', function(opts) {
        this.content = 'This is content;';
    
});

define("tag/test3",function(){});
