riot.tag('test', '<div> <h1>This is a test file</h1> <div class="content">{content}</div> </div>', '[riot-tag=test],test{ display: block} [riot-tag=test].inline,test.inline{ display: inline-block} body{ background: #fff;} [riot-tag=test]:hover h1,test:hover h1{ display: block;} [riot-tag=test] h1,test h1{ color: green;} [riot-tag=test] .content,test .content{ color: blue;} @media screen and(max-width: 600px){ [riot-tag=test] .h1,test .h1{ color: red;} [riot-tag=test] .h1,test .h1{ color: red;} [riot-tag=test] .h1,test .h1{ color: red;}}', function(opts) {
            this.content = 'This is content;';
            go()
            {
                this.a = 1;
            }
        
});
