var fs = require('fs');
var express = require('express');
var app = express();

// TODO: back data with PostgreSQL or some other DB
// TODO: create a legit repository interface
var repo = (function () {
    var json, todos;
    
    if (!fs.existsSync('todos.json')) {
        fs.writeFileSync(
            'todos.json',
            JSON.stringify({ user: "JMAD", todos: [] }),
            'utf-8'
        );
    }
    
    json = fs.readFileSync('todos.json', 'utf-8');
    todos = JSON.parse(json);
    
    console.log('raw todos @ startup:', json);
    
    return {
        getAll: function () {
            return todos.todos;
        },
        get: function (name) {
            var todosByName = this.getAll().filter(function (todo) {
                return todo.name === name;
            });
            
            return todosByName[0];
        },
        add: function (name) {
            todos.todos.push({
                name: name,
                done: false
            });
        },
        save: function () {
            console.log('saving...', todos);
            fs.writeFileSync('todos.json', JSON.stringify(todos), 'utf-8');
        }
    };
}());


// TODO: read and implement response best practices
app.get('/todos', function (req, res) {
    res.statusCode = 200;
    res.end(JSON.stringify(repo.getAll()));
});


app.get('/todos/:name', function (req, res) {
    console.log("looking for todo:", req.params.name);
    var requestedTodo = repo.get(req.params.name);
    
    res.statusCode = (requestedTodo ? 200 : 404);
    res.end(JSON.stringify(requestedTodo || {}));
});

app.post('/todos/:name', function (req, res) {
    console.log(req.params.name);
    
    res.statusCode = 200;
    res.end();
    
    repo.add(req.params.name);
    repo.save();
});

app.put('/todos/:name', function (req, res) {
    var todo = repo.get(req.params.name);
    var done = ((req.query.done || false) === "true");
    
    res.statusCode = (todo ? 200 : 404);
    res.end();
    
    if (todo) {
        todo.done = done;
        repo.save();
    }
});


// manipulating a todo's list of sub-items
app.get('/todos/:name/items', function (req, res) {
    
});

app.get('/todos/:name/items/:itemName', function (req, res) {
    
});

// TODO: create virtual directory that looks like root but lives in ./content
app.use(express.static('/'))

// TODO: add a more helpful startup message that includes host and port
app.listen(8080, function () { console.log('online!'); });