let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// show task modal
document.getElementById('add-btn').addEventListener('click', () => {
    document.getElementById('task-modal').style.display = 'flex';
});

// hide task modal
document.getElementById('cancel-btn').addEventListener('click', () => {
    document.getElementById('task-modal').style.display = 'none';
});

// process form data
document.getElementById('task-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const title = document.getElementById('task-title').value;
    const summary = document.getElementById('task-summary').value;
    createTaskElement(title, summary, false);
    tasks.push({
        title,
        summary,
        completed: false
    });
    saveTasks();
    document.getElementById('task-modal').style.display = 'none';
    document.getElementById('task-title').value = '';
    document.getElementById('task-summary').value = '';
    updateNoTasksMessage();
});

// adds task element to DOM
function createTaskElement(title, summary, isCompleted) {
    const taskDiv = document.createElement('div');
    taskDiv.className = 'task';
    taskDiv.innerHTML = `
        <input type="checkbox" class="task-checkbox" ${isCompleted ? 'checked' : ''} onchange="toggleCompleted(this, '${title}', '${summary}')">
        <div class="task-details ${isCompleted ? 'completed' : ''}">
            <h3>${title}</h3>
            <p>${summary}</p>
        </div>
        <button class="delete-btn" onclick="deleteTask(this.parentElement, '${title}', '${summary}')">
            <i class="fas fa-trash-alt"></i>
        </button>
    `;
    // onclick and onchange => html events
    document.querySelector('.tasks').appendChild(taskDiv);
}

// updates task status
function toggleCompleted(checkbox, title, summary) {
    const isCompleted = checkbox.checked;
    tasks = tasks.map(task => {
        if (task.title === title && task.summary === summary) {
            return {
                title: task.title,
                summary: task.summary,
                completed: isCompleted
            };
        } else {
            return task;
        }
    });
    saveTasks();
    checkbox.parentElement.querySelector('.task-details').classList.toggle('completed', isCompleted);
}

// removes task from DOM and updates task array
function deleteTask(taskDiv, title, summary) {
    taskDiv.remove();
    tasks = tasks.filter(task => {
        return !(task.title === title && task.summary === summary);
    });
    saveTasks();
    updateNoTasksMessage();
}

// saves current tasks to localStorage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// displays or hides "no tasks" message based on current status
function updateNoTasksMessage() {
    const tasksContainer = document.querySelector('.tasks');
    const message = tasksContainer.querySelector('.no-tasks-message');
    if (tasks.length === 0 && !message) {
        const warning = document.createElement("p");
        warning.textContent = "You have no tasks.";
        warning.className = 'no-tasks-message';
        tasksContainer.appendChild(warning);
    } else if (message) {
        message.remove();
    }
}

// init tasks and theme on DOM load
document.addEventListener('DOMContentLoaded', function() {
    tasks.forEach(task => {
        createTaskElement(task.title, task.summary, task.completed);
    });
    updateNoTasksMessage();

    const toggleButton = document.getElementById('theme-toggle');
    const iconSun = toggleButton.querySelector('.fa-sun');
    const iconMoon = toggleButton.querySelector('.fa-moon');

    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'light') {
        document.body.classList.add('light-mode');
        iconSun.style.display = 'none';
        iconMoon.style.display = 'inline-block';
    }

    // toggles theme mode and updates icon accordingly
    toggleButton.addEventListener('click', function() {
        document.body.classList.toggle('light-mode');
        if (document.body.classList.contains('light-mode')) {
            localStorage.setItem('theme', 'light');
            iconSun.style.display = 'none';
            iconMoon.style.display = 'inline-block';
        } else {
            localStorage.setItem('theme', 'dark');
            iconSun.style.display = 'inline-block';
            iconMoon.style.display = 'none';
        }
    });
});