async function fetchTodos() {
    const data = await fetch('/todos');
    const jsonData = await data.json();
    return jsonData.todos;
}

async function addTodo() {
    const todoToAdd = document.getElementsByTagName('input')[0];
    console.log(todoToAdd.value);
    await fetch('/todos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ todo: todoToAdd.value })
    });
    appendTodos([todoToAdd.value]);
}

async function main() {
    const todos = await fetchTodos();
    appendTodos(todos);
}

function appendTodos(todos) {
    todos.forEach((todo, i) => {
        const pTag = document.createElement('p');
        pTag.innerText = todo;
        pTag.setAttribute('todo_id', i);
        pTag.addEventListener('click', async function(e) {
            await deleteTodo(e.target.getAttribute("todo_id"));
        })
        document.getElementById('todos').appendChild(pTag);
    })
}

async function deleteTodo(index) {
    await fetch('/todos/' + index, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    document.getElementById('todos').innerHTML = '';
    await main();
}

main()