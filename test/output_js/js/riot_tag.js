/** ----- created by gulp-riot-css -----*/
riot.tag('test', '<div> <h1>This is a test file</h1> <div class="content">{content}</div> </div>', '[riot-tag=test],test { display: block } [riot-tag=test].inline,test.inline { display: inline-block } body { background: #fff; } [riot-tag=test]:hover h1,test:hover h1 { display: block; } [riot-tag=test] ,test [riot-tag=test] { color: green; } [riot-tag=test] ,test [riot-tag=test] { color: blue; }', function(opts) {
            this.content = 'This is content;';
            go()
            {
                this.a = 1;
            }
        
});

define("tags/test",function(){});
riot.tag('test2', '<h1>This is a test file</h1> <div class="content">{content}</div>', '[riot-tag=test2] ,test2 [riot-tag=test2] { color: blue; background: yellow; } [riot-tag=test2] ,test2 [riot-tag=test2] { color: green; background: steelblue; }', function(opts) {
        this.content = 'This is content;';
    
});

define("tags/test2",function(){});
