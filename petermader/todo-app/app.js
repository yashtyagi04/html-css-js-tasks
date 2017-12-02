document.addEventListener('DOMContentLoaded', () => {

    // this array will store objects representing a todo item
    // these objects have three properties:
    // * text:     the text an item contains
    // * complete: true or false, whether the todo is completed or not
    // * element:  the DOM element associated with the todo item
    const todos = [];

    // a dictionary of the todo filters currently available:
    const filters = {
        active: item => !item.complete,
        complete: item => item.complete,
        all: () => true
    };

    // find some important elements in the DOM
    const itemTemplate = document.getElementById('item-template');
    const newItemInput = document.getElementById('item-new');
    const itemList     = document.getElementById('item-list');
    const itemsLeft    = document.getElementById('items-left');

    // applies the given filter function to the todo list
    const setFilter = filter => {
        todos.forEach(todo => {
            if (filter(todo)) {
                todo.element.classList.remove('hidden');
            } else {
                todo.element.classList.add('hidden');
            }
        });
    };
    
    let selectedFilterButton = document.getElementById('filter-all');
    Object.entries(filters).forEach(([ key, filter ]) => {
        const button = document.getElementById(`filter-${key}`);
        console.log(`filter-${key}`);
        button.addEventListener('click', () => {
            setFilter(filter);
            button.classList.add('selected');
            selectedFilterButton.classList.remove('selected');
            selectedFilterButton = button;
        });
    });

    // creates a todo item and appends it to the 'todos' array and to the <ul> DOM list
    const createItem = text => {
        const { content } = itemTemplate;
        const clone = document.importNode(content, true);        
        
        const todo = { 
            text, 
            complete: false,
            element: clone.querySelector('li')
        };
        todos.push(todo);

        const completeElement = clone.querySelector('.item-complete-checkbox');
        completeElement.addEventListener(
            'change', 
            () => setComplete(todo, completeElement.checked)
        );

        const textElement = clone.querySelector('.item-text');
        textElement.addEventListener('dblclick', editItem.bind(null, todo));
        textElement.textContent = text;

        const inputElement = clone.querySelector('.item-edit');
        inputElement.addEventListener('keyup', e => {
            if (e.key === 'Enter') {
                confirmEdit(todo);
            } else if (e.key === 'Escape') {
                cancelEdit(todo);
            }
        });
        inputElement.addEventListener('blur', cancelEdit.bind(null, todo));

        const removeButton = clone.querySelector('.item-remove');
        removeButton.addEventListener('click', removeItem.bind(null, todo));

        // add the item to the visible part of the DOM
        itemList.insertBefore(clone, itemList.firstChild);

        save();

        return todo;
    };

    // sets the given item's 'complete' property and displays it in the DOM
    const setComplete = (item, complete) => {
        const { element } = item;
        item.complete = complete;
        element.classList[complete ? 'add' : 'remove']('complete');

        save();
    };

    // start to edit the given item's text
    const editItem = item => {
        const { element } = item;
        element.classList.add('edit');
        const input = element.querySelector('.item-edit');
        input.value = item.text;
        input.focus();
    };

    // confirm the edit: update the given item, return to the normal view
    const confirmEdit = item => {
        const { element } = item;
        const newText = element.querySelector('.item-edit').value;
        item.text = newText;
        element.querySelector('.item-text').textContent = newText;
        element.classList.remove('edit');

        save();
    };

    // cancel the edit: return to the normal view without updating the text
    const cancelEdit = item => {
        const { element } = item;
        element.classList.remove('edit');
    };

    // remove the given item from the list
    const removeItem = item => {
        const index = todos.indexOf(item);
        todos.splice(index, 1);
        console.log(todos);
        item.element.remove();

        save();
    };

    // save the application's current state to the local storage
    const save = () => {
        // display how many todos are active
        const number = todos.filter(filters.active).length;
        itemsLeft.textContent = `${number} item${number === 1 ? '' : 's'} left`;

        // keep only the 'text' and 'complete' property, throw away the DOM element
        const data = todos.map(({ text, complete }) => ({ text, complete }));

        // JSONify the data and write it to the local storage
        window.localStorage.setItem('todos', JSON.stringify(data));
    };

    // read the previous application state from the local storage
    const readFromStorage = () => {
        const data = window.localStorage.getItem('todos');
        if (!data) {
            return;
        }
        try {
            console.log(data);
            JSON.parse(data).forEach(({ text, complete }) => {
                const item = createItem(text);
                setComplete(item, complete);
                const checkbox = item.element.querySelector('.item-complete-checkbox');
                checkbox.checked = complete;

            });
        } catch (e) {
            console.error(e);
        }
    };

    // listen for the Enter key to create a new todo item
    newItemInput.addEventListener('keyup', e => {
        if (e.key === 'Enter' && newItemInput.value.length > 0) {
            createItem(newItemInput.value);
            newItemInput.value = '';
        }
    });

    // restore the previous application state
    readFromStorage();

});
