/** ----- created by gulp-riot-css -----*/
riot.tag('test', '<div> <h1>This is a test file</h1> <div class="content">{content}</div> </div>', '[riot-tag=test] h1,test h1 { color: green; } [riot-tag=test] .content,test .content { color: blue; }', function(opts) {
            this.content = 'This is content;';
        
});
riot.tag('test2', '<h1>This is a test file</h1> <div class="content">{content}</div>', '[riot-tag=test2] h1,test2 h1 { color: blue; background: yellow; } [riot-tag=test2] .content,test2 .content { color: green; background: steelblue; }', function(opts) {
        this.content = 'This is content;';
    
});
