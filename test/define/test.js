define("tag/test",function(){
riot.tag('test', '<div> <h1>This is a test file</h1> <div class="content">{content}</div> </div>', '[riot-tag=test] ,test { display: block } body { background: #fff; } [riot-tag=test]:hover h1,test:hover h1 { display: block; } [riot-tag=test] h1,test h1 { color: green; } [riot-tag=test] .content,test .content { color: blue; }', function(opts) {
            this.content = 'This is content;';
        
});
});