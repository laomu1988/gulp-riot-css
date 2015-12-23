riot.tag('test', '<div> <h1>This is a test file</h1> <div class="content">{content}</div> </div>', '[riot-tag=test],test { display: block } [riot-tag=test].inline,test.inline { display: inline-block } body { background: #fff; } [riot-tag=test]:hover h1,test:hover h1 { display: block; } [riot-tag=test] ,test [riot-tag=test] { color: green; } [riot-tag=test] ,test [riot-tag=test] { color: blue; }', function(opts) {
            this.content = 'This is content;';
            go()
            {
                this.a = 1;
            }
        
});

define("tag/test",function(){});
