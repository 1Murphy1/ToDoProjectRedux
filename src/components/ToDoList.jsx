import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteTask, updateTask, reorderTasks } from './redux/taskSlice';
import TaskForm from './taskForm';
import TodoItem from './ToDoItem';
import EditModal from './editModal';
import ShareModal from './shareModal';
import DeleteConfirmationModal from './deleteConfirmationModal';

function TodoList() {
    const tasks = useSelector((state) => state.tasks);
    const dispatch = useDispatch();

    const [title, setTitle] = useState('');
    const [about, setAbout] = useState('');
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [editTask, setEditTask] = useState(null);
    const [isShareModalOpen, setShareModalOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);
    const [isDeleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);

    const handleDeleteTask = (taskId) => {
        setTaskToDelete(taskId);
        setDeleteConfirmationOpen(true);
    };

    const confirmDeleteTask = () => {
        dispatch(deleteTask(taskToDelete));
        setDeleteConfirmationOpen(false);
    };

    const handleEditTask = (task) => {
        setEditTask(task);
        setEditModalOpen(true);
    };

    const handleSaveEdit = (newTitle, newAbout) => {
        dispatch(updateTask({ id: editTask.id, updates: { title: newTitle, about: newAbout } }));
        setEditModalOpen(false);
    };

    const handleDragStart = (e, index) => {
        e.dataTransfer.setData('index', index);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e, index) => {
        const fromIndex = e.dataTransfer.getData('index');
        const updatedTasks = [...tasks];
        const [draggedTask] = updatedTasks.splice(fromIndex, 1);
        updatedTasks.splice(index, 0, draggedTask);
        dispatch(reorderTasks(updatedTasks));
    };

    return (
        <div className="createTaskContainer">
            <TaskForm title={title} setTitle={setTitle} about={about} setAbout={setAbout} />
            <div className="task-list">
                {tasks.length === 0 ? (
                    <p className="task-list-none">No tasks</p>
                ) : (
                    tasks.map((task, index) => (
                        <div
                            key={task.id}
                            className="taskContainer"
                            draggable
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, index)}
                            data-task-id={task.id}
                        >
                            <TodoItem
                                task={task}
                                onDelete={handleDeleteTask}
                                onEdit={handleEditTask}
                                onShare={() => setShareModalOpen(true)}
                            />
                        </div>
                    ))
                )}
            </div>
            {isEditModalOpen && <EditModal task={editTask} onSave={handleSaveEdit} onClose={() => setEditModalOpen(false)} />}
            {isShareModalOpen && <ShareModal onClose={() => setShareModalOpen(false)} />}
            {isDeleteConfirmationOpen && (
                <DeleteConfirmationModal onConfirm={confirmDeleteTask} onCancel={() => setDeleteConfirmationOpen(false)} />
            )}
        </div>
    );
}

export default TodoList;
