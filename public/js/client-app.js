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
        // Task management
        document.getElementById('addTaskBtn')?.addEventListener('click', () => this.showAddTaskModal());
        document.getElementById('saveTaskBtn')?.addEventListener('click', () => this.handleSaveTask());
        document.getElementById('closeTaskModal')?.addEventListener('click', () => this.hideAddTaskModal());
        document.getElementById('cancelTaskBtn')?.addEventListener('click', () => this.hideAddTaskModal());
        
        // Exercise management
        document.getElementById('startExerciseBtn')?.addEventListener('click', () => this.startExercise());
        document.getElementById('completeExerciseBtn')?.addEventListener('click', () => this.completeExercise());
        
        // Reflection management
        document.getElementById('saveReflectionBtn')?.addEventListener('click', () => this.saveReflection());
        
        // Settings
        document.getElementById('settingsBtn')?.addEventListener('click', () => this.showSettingsModal());
        document.getElementById('closeSettingsModal')?.addEventListener('click', () => this.hideSettingsModal());
        
        // Mood rating
        document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.addEventListener('click', () => this.selectMood(btn));
        });

        // Close modals when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });
    }

    updateUI() {
        this.updateCurrentDate();
        this.updateProgress();
        this.updateReflectionDate();
    }

    updateCurrentDate() {
        const today = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const dateElement = document.getElementById('currentDate');
        if (dateElement) {
            dateElement.textContent = today.toLocaleDateString('en-US', options);
        }
    }

    updateReflectionDate() {
        const today = new Date();
        const options = { month: 'long', day: 'numeric', year: 'numeric' };
        const reflectionDateElement = document.getElementById('reflectionDate');
        if (reflectionDateElement) {
            reflectionDateElement.textContent = today.toLocaleDateString('en-US', options);
        }
    }

    updateUserDisplay() {
        const userNameElement = document.getElementById('userName');
        const userStreakElement = document.getElementById('userStreak');
        
        if (userNameElement) {
            userNameElement.textContent = `Welcome back, ${this.currentUser.name}`;
        }
        if (userStreakElement) {
            userStreakElement.textContent = `Day ${this.currentUser.currentStreak} of your journey`;
        }
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
            },
            {
                title: 'Body Scan Meditation',
                type: 'Mindset',
                content: 'Lie down comfortably and mentally scan your body from head to toe. Notice any tension or sensations without trying to change them.'
            },
            {
                title: 'Affirmation Practice',
                type: 'Mindset',
                content: 'Choose 3 positive affirmations that resonate with you. Repeat each one 10 times with conviction and feeling.'
            },
            {
                title: 'Mindful Walking',
                type: 'Mindset',
                content: 'Take a 10-minute walk focusing on each step. Feel the ground beneath your feet and notice your surroundings.'
            }
        ];
        
        const today = new Date();
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
        this.currentExercise = exercises[dayOfYear % exercises.length];
        this.renderExercise();
    }

    renderExercise() {
        if (!this.currentExercise) return;
        
        const titleElement = document.getElementById('exerciseTitle');
        const typeElement = document.getElementById('exerciseType');
        const contentElement = document.getElementById('exerciseContent');
        
        if (titleElement) titleElement.textContent = this.currentExercise.title;
        if (typeElement) typeElement.textContent = this.currentExercise.type;
        if (contentElement) contentElement.innerHTML = `<p>${this.currentExercise.content}</p>`;
    }

    startExercise() {
        this.showNotification('Exercise Started!', 'Great work beginning your daily practice.');
        document.getElementById('startExerciseBtn').style.display = 'none';
        document.getElementById('completeExerciseBtn').style.display = 'inline-flex';
    }

    completeExercise() {
        this.showNotification('Exercise Completed!', 'Excellent work on your daily practice.');
        document.getElementById('startExerciseBtn').style.display = 'inline-flex';
        document.getElementById('completeExerciseBtn').style.display = 'none';
        
        // Update exercise count
        const exerciseCount = document.getElementById('exercisesCompleted');
        if (exerciseCount) {
            exerciseCount.textContent = parseInt(exerciseCount.textContent || '0') + 1;
        }
    }

    showAddTaskModal() {
        const modal = document.getElementById('addTaskModal');
        if (modal) modal.style.display = 'block';
    }

    hideAddTaskModal() {
        const modal = document.getElementById('addTaskModal');
        if (modal) modal.style.display = 'none';
        
        // Clear form
        const titleInput = document.getElementById('taskTitle');
        const descInput = document.getElementById('taskDescription');
        if (titleInput) titleInput.value = '';
        if (descInput) descInput.value = '';
    }

    showSettingsModal() {
        const modal = document.getElementById('settingsModal');
        if (modal) modal.style.display = 'block';
    }

    hideSettingsModal() {
        const modal = document.getElementById('settingsModal');
        if (modal) modal.style.display = 'none';
    }

    handleSaveTask() {
        const titleInput = document.getElementById('taskTitle');
        const descInput = document.getElementById('taskDescription');
        const prioritySelect = document.getElementById('taskPriority');
        const categorySelect = document.getElementById('taskCategory');
        
        if (!titleInput || !descInput || !prioritySelect || !categorySelect) return;
        
        const title = titleInput.value.trim();
        const description = descInput.value.trim();
        const priority = prioritySelect.value;
        const category = categorySelect.value;
        
        if (!title) {
            this.showNotification('Please enter a task title', 'error');
            return;
        }

        this.addTask({ title, description, priority, category });
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
        this.showNotification('Task Added!', 'New task has been added to your list.');
    }

    renderTasks() {
        const container = document.getElementById('tasksContainer');
        if (!container) return;

        if (this.tasks.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">No tasks yet. Add some to get started!</p>';
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
                <div class="task-priority ${task.priority}">${task.priority}</div>
            </div>
        `).join('');
    }

    toggleTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            this.renderTasks();
            this.updateProgress();
            
            if (task.completed) {
                this.showNotification('Task Completed!', 'Great job on completing your task!');
            }
        }
    }

    updateProgress() {
        const completedTasks = this.tasks.filter(task => task.completed).length;
        const totalTasks = this.tasks.length;
        
        const tasksCompletedElement = document.getElementById('tasksCompleted');
        const currentStreakElement = document.getElementById('currentStreak');
        const progressBarElement = document.getElementById('dailyProgressBar');
        
        if (tasksCompletedElement) tasksCompletedElement.textContent = completedTasks;
        if (currentStreakElement) currentStreakElement.textContent = this.currentUser.currentStreak;
        
        const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
        if (progressBarElement) progressBarElement.style.width = `${progressPercentage}%`;
    }

    saveReflection() {
        const answerInput = document.getElementById('reflectionAnswer');
        if (!answerInput) return;
        
        const answer = answerInput.value.trim();
        if (!answer) {
            this.showNotification('Please write your reflection', 'error');
            return;
        }
        
        this.showNotification('Reflection Saved!', 'Your daily reflection has been recorded.');
        answerInput.value = '';
    }

    selectMood(selectedBtn) {
        document.querySelectorAll('.mood-btn').forEach(btn => btn.classList.remove('selected'));
        selectedBtn.classList.add('selected');
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
            animation: slideInRight 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }
}

// Add CSS animation for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    window.app = new TransformationApp();
});
