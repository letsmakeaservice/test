// HTML 요소 선택
const newTaskInput = document.getElementById('new-task');
const taskDateInput = document.getElementById('task-date');
const taskPriorityInput = document.getElementById('task-priority');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');
const viewDailyTasksBtn = document.getElementById('view-daily-tasks');
const viewWeeklyTasksBtn = document.getElementById('view-weekly-tasks');

// 로컬 저장된 tasks 불러오기
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// 페이지 로드 시 저장된 tasks 표시
document.addEventListener('DOMContentLoaded', () => {
    displayTasks(tasks);
});

// 전체 Task 보기
document.getElementById('view-all-tasks').addEventListener('click', () => {
    displayTasks(tasks);
});

// 완료된 Task 보기
document.getElementById('view-completed-tasks').addEventListener('click', () => {
    const completedTasks = tasks.filter(task => task.done);
    displayTasks(completedTasks);
});

// 할 일 추가 기능
addTaskBtn.addEventListener('click', () => {
    const taskText = newTaskInput.value;
    const taskDate = taskDateInput.value;
    const taskPriority = taskPriorityInput.value;

    if (taskText.trim() === '' || taskDate === '') return;

    const task = {
        text: taskText,
        date: taskDate,
        priority: taskPriority,
        done: false,
    };

    tasks.push(task);
    saveTasks();
    displayTasks(tasks);

    newTaskInput.value = '';
    taskDateInput.value = '';
    taskPriorityInput.value = 'P1';
});

// 할 일 표시 기능
function displayTasks(tasksToDisplay) {
    taskList.innerHTML = '';
    tasksToDisplay.forEach((task, index) => {
        const li = document.createElement('li');
        li.innerHTML = `${task.text} (Due: ${task.date}, Priority: ${task.priority}) 
                        <button class="delete-btn">Delete</button>`;
        if (task.done) li.classList.add('done');
        
        // 완료 처리 기능
        li.addEventListener('click', () => {
            tasks[index].done = !tasks[index].done;
            saveTasks();
            displayTasks(tasks);
        });

        // 삭제 기능
        li.querySelector('.delete-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            tasks.splice(index, 1);
            saveTasks();
            displayTasks(tasks);
        });

        taskList.appendChild(li);
    });
}

// 오늘 할 일 보기 기능
viewDailyTasksBtn.addEventListener('click', () => {
    const today = new Date().toISOString().split('T')[0];
    const dailyTasks = tasks.filter(task => task.date === today);
    displayTasks(dailyTasks);
});

// 1주일 할 일 보기 기능
viewWeeklyTasksBtn.addEventListener('click', () => {
    const today = new Date();
    const oneWeekLater = new Date();
    oneWeekLater.setDate(today.getDate() + 7);

    const weeklyTasks = tasks.filter(task => {
        const taskDate = new Date(task.date);
        return taskDate >= today && taskDate <= oneWeekLater;
    });

    displayTasks(weeklyTasks);
});

// 로컬 스토리지에 저장
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}