/** ----- created by gulp-riot-css -----*/
riot.tag('test', '<div> <h1>This is a test file</h1> <div class="content">{content}</div> </div>', 'test { display: block } test.inline { display: inline-block } body { background: #fff; } test:hover h1 { display: block; } test h1 { color: green; } test .content { color: blue; }', function(opts) {
            this.content = 'This is content;';
            go()
            {
                this.a = 1;
            }
        
});

define("tags/test",function(){});
riot.tag('test2', '<h1>This is a test file</h1> <div class="content">{content}</div>', 'test2 h1 { color: blue; background: yellow; } test2 .content { color: green; background: steelblue; }', function(opts) {
        this.content = 'This is content;';
    
});

define("tags/test2",function(){});
