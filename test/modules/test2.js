riot.tag('test2', '<h1>This is a test file</h1> <div class="content">{content}</div>', '[riot-tag=test2] ,test2 [riot-tag=test2] { color: blue; background: yellow; } [riot-tag=test2] ,test2 [riot-tag=test2] { color: green; background: steelblue; }', function(opts) {
        this.content = 'This is content;';
    
});
