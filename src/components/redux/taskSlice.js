import { createSlice } from '@reduxjs/toolkit';
import storage from '../../storage';

const taskSlice = createSlice({
    name: 'tasks',
    initialState: storage.getTasks(),
    reducers: {
        addTask: (state, action) => {
            const newTask = storage.addTask(action.payload);
            state.push(newTask);
        },
        deleteTask: (state, action) => {
            storage.deleteTask(action.payload);
            return state.filter(task => task.id !== action.payload);
        },
        updateTask: (state, action) => {
            const { id, updates } = action.payload;
            storage.updateTask(id, updates);
            const task = state.find(task => task.id === id);
            if (task) {
                Object.assign(task, updates);
            }
        },
        reorderTasks: (state, action) => {
            return action.payload;
        },
    },
});

export const { addTask, deleteTask, updateTask, reorderTasks } = taskSlice.actions;

export default taskSlice.reducer;
