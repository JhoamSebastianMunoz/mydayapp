import React, { useState, useEffect } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { TaskInput } from './Components/TaskInput/TaskInput';
import { TaskList } from './Components/TaskList/TaskList';
import { Footer } from './Components/Footer/Footer';
import '../src/App.css'

export const App = () => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const storedTasks = JSON.parse(localStorage.getItem('mydayapp-reactjs'));
        if (storedTasks) setTasks(storedTasks);
    }, []);

    useEffect(() => {
        localStorage.setItem('mydayapp-reactjs', JSON.stringify(tasks));
    }, [tasks]);

    const addTask = (title) => {
        const newTask = { id: Date.now(), title: title.trim(), completed: false };
        setTasks([...tasks, newTask]);
    };

    const toggleTaskCompletion = (id) => {
        setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
    };

    const updateTask = (id, newTitle) => {
        setTasks(tasks.map(task => task.id === id ? { ...task, title: newTitle.trim() } : task));
    };

    const deleteTask = (id) => {
        setTasks(tasks.filter(task => task.id !== id));
    };

    const clearCompleted = () => {
        setTasks(tasks.filter(task => !task.completed));
    };

    const filterTasks = (filter) => {
        if (filter === 'pending') {
            return tasks.filter(task => !task.completed);
        }
        if (filter === 'completed') {
            return tasks.filter(task => task.completed);
        }
        return tasks;
    };

    const location = useLocation();
    const filter = location.pathname.replace('/', '') || 'all';
    const filteredTasks = filterTasks(filter);

    // Calcular el número de tareas pendientes
    const pendingTasksCount = tasks.filter(task => !task.completed).length;

    return (
        <div className="app">
            <div className='container-header' >
                <p className='title' >My Day</p>
                <p className='subtitle' >All my tasks in one place</p>
                <TaskInput addTask={addTask} />
            </div>
            {tasks.length > 0 && (
                <>
                <div className='container-main-footer' >
                    <TaskList 
                        tasks={filteredTasks} 
                        toggleTaskCompletion={toggleTaskCompletion} 
                        updateTask={updateTask}
                        deleteTask={deleteTask}
                    />
                    <Footer 
                        tasksCount={pendingTasksCount}  // Pasar el contador de tareas pendientes al Footer
                        filter={filter} 
                        clearCompleted={clearCompleted} 
                    />
                </div>
                </>
                
            )}
        </div>
    );
};
