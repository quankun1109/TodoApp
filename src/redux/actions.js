export const addTodo = (title, dueDate, priority) => ({
    type: 'ADD_TODO',
    payload: {
        id: new Date().getTime(),
        title,
        dueDate,
        priority,
    },
});

export const updateTodo = (id, updates) => ({
    type: 'UPDATE_TODO',
    id,
    updates,
});

export const deleteTodo = (id) => ({
    type: 'DELETE_TODO',
    payload: id,
});

export const setTodos = (todos) => ({
    type: 'SET_TODOS',
    payload: todos,
});

export const setUser = (user) => ({
    type: 'SET_USER',
    payload: user,
});
