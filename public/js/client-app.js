// Client App JavaScript
class TransformationApp {
    constructor() {
        this.currentUser = null;
        this.tasks = [];
        this.init();
    }

    init() {
        this.loadUserData();
        this.setupEventListeners();
        this.updateUI();
        this.loadDailyExercise();
    }

    loadUserData() {
        const savedUser = localStorage.getItem('transformationApp_user');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
        } else {
            this.currentUser = {
                name: 'Client',
                startDate: new Date().toISOString(),
                currentStreak: 0,
                totalDays: 1
            };
        }
        this.updateUserDisplay();
    }

    setupEventListeners() {
        document.getElementById('addTaskBtn')?.addEventListener('click', () => this.showAddTaskModal());
        document.getElementById('saveTaskBtn')?.addEventListener('click', () => this.handleSaveTask());
        document.getElementById('startExerciseBtn')?.addEventListener('click', () => this.startExercise());
        document.getElementById('saveReflectionBtn')?.addEventListener('click', () => this.saveReflection());
        
        // Mood rating
        document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.addEventListener('click', () => this.selectMood(btn));
        });
    }

    updateUI() {
        this.updateCurrentDate();
        this.updateProgress();
    }

    updateCurrentDate() {
        const today = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        document.getElementById('currentDate').textContent = today.toLocaleDateString('en-US', options);
    }

    updateUserDisplay() {
        document.getElementById('userName').textContent = `Welcome back, ${this.currentUser.name}`;
        document.getElementById('userStreak').textContent = `Day ${this.currentUser.currentStreak} of your journey`;
    }

    loadDailyExercise() {
        const exercises = [
            {
                title: 'Mindful Breathing',
                type: 'Mindset',
                content: 'Find a comfortable position and focus on your breath. Inhale deeply for 4 counts, hold for 4, exhale for 6. Repeat this cycle for 5 minutes.'
            },
            {
                title: 'Gratitude Journaling',
                type: 'Mindset',
                content: 'Take 5 minutes to write down 3 specific things you are grateful for today. Be as detailed as possible about why each thing matters to you.'
            }
        ];
        
        const today = new Date();
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
        this.currentExercise = exercises[dayOfYear % exercises.length];
        this.renderExercise();
    }

    renderExercise() {
        if (!this.currentExercise) return;
        document.getElementById('exerciseTitle').textContent = this.currentExercise.title;
        document.getElementById('exerciseType').textContent = this.currentExercise.type;
        document.getElementById('exerciseContent').innerHTML = `<p>${this.currentExercise.content}</p>`;
    }

    startExercise() {
        this.showNotification('Exercise Started!', 'Great work beginning your daily practice.');
    }

    showAddTaskModal() {
        document.getElementById('addTaskModal').style.display = 'block';
    }

    handleSaveTask() {
        const title = document.getElementById('taskTitle').value.trim();
        const description = document.getElementById('taskDescription').value.trim();
        
        if (!title) {
            this.showNotification('Please enter a task title', 'error');
            return;
        }

        this.addTask({ title, description });
        this.hideAddTaskModal();
    }

    addTask(taskData) {
        const newTask = {
            id: Date.now(),
            ...taskData,
            completed: false,
            date: new Date().toISOString()
        };
        
        this.tasks.push(newTask);
        this.renderTasks();
        this.updateProgress();
    }

    renderTasks() {
        const container = document.getElementById('tasksContainer');
        if (!container) return;

        if (this.tasks.length === 0) {
            container.innerHTML = '<p>No tasks yet. Add some to get started!</p>';
            return;
        }

        container.innerHTML = this.tasks.map(task => `
            <div class="task-item ${task.completed ? 'completed' : ''}" data-task-id="${task.id}">
                <div class="task-checkbox ${task.completed ? 'checked' : ''}" onclick="app.toggleTask(${task.id})">
                    ${task.completed ? '<i class="fas fa-check"></i>' : ''}
                </div>
                <div class="task-content">
                    <div class="task-title">${task.title}</div>
                    <div class="task-description">${task.description}</div>
                </div>
            </div>
        `).join('');
    }

    toggleTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            this.renderTasks();
            this.updateProgress();
        }
    }

    updateProgress() {
        const completedTasks = this.tasks.filter(task => task.completed).length;
        const totalTasks = this.tasks.length;
        
        document.getElementById('tasksCompleted').textContent = completedTasks;
        document.getElementById('exercisesCompleted').textContent = '0';
        document.getElementById('currentStreak').textContent = this.currentUser.currentStreak;
        
        const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
        document.getElementById('dailyProgressBar').style.width = `${progressPercentage}%`;
    }

    saveReflection() {
        const answer = document.getElementById('reflectionAnswer').value.trim();
        if (!answer) {
            this.showNotification('Please write your reflection', 'error');
            return;
        }
        
        this.showNotification('Reflection Saved!', 'Your daily reflection has been recorded.');
        document.getElementById('reflectionAnswer').value = '';
    }

    selectMood(selectedBtn) {
        document.querySelectorAll('.mood-btn').forEach(btn => btn.classList.remove('selected'));
        selectedBtn.classList.add('selected');
    }

    hideAddTaskModal() {
        document.getElementById('addTaskModal').style.display = 'none';
        document.getElementById('taskTitle').value = '';
        document.getElementById('taskDescription').value = '';
    }

    showNotification(title, message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <div class="notification-content">
                <h4>${title}</h4>
                <p>${message}</p>
            </div>
        `;

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? 'var(--error-color)' : 'var(--success-color)'};
            color: white;
            padding: 1rem;
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            max-width: 300px;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    window.app = new TransformationApp();
});
