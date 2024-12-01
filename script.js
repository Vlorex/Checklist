// DOM Elements
const taskInput = document.getElementById("task-input");
const addButton = document.getElementById("add-button");
const taskList = document.getElementById("tasks");

// Data URL
const dataUrl = "http://localhost:3000/tasks";

// Fetch tasks from JSON
async function loadTasks() {
    try {
        const response = await fetch(dataUrl);
        const tasks = await response.json();
        renderTasks(tasks);
    } catch (error) {
        console.error("Błąd wczytywania danych:", error);
    }
}

// Render tasks
function renderTasks(tasks) {
    taskList.innerHTML = ""; // Clear list
    const completedTasks = tasks.filter(task => task.completed === true);
    const allTasks = tasks.length; // Liczba wszystkich zadań

    // Wstawienie liczby wszystkich zadań do elementu o id 'all'
    const allTasksElement = document.getElementById("all");
    allTasksElement.innerHTML = allTasks;

    // Wstawienie liczby zakończonych zadań do elementu o id 'completed'
    const completedTasksElement = document.getElementById("completed");
    completedTasksElement.innerHTML = completedTasks.length;

    const procentagre = document.getElementById("proc");
    procentagre.textContent = `${Number.parseInt((100 / allTasks) * completedTasks.length)}%`;

    // Renderowanie zadań w głównych zadaniach list
    tasks.forEach(task => {
        const taskElement = createTaskElement(task);
        taskList.appendChild(taskElement);
    });
}

// Create a task element
function createTaskElement(task) {
    const li = document.createElement("li");
    li.className = "task";
    if (task.completed) li.classList.add("completed");
    li.setAttribute("data-id", task.id);

    // Checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => toggleTask(task));

    // Task content
    const span = document.createElement("span");
    span.className = "task-content";
    span.textContent = task.content;

    // Edit button
    const editButton = document.createElement("button");
    editButton.className = "edit-button";
    editButton.textContent = "Edytuj";
    editButton.addEventListener("click", () => editTask(task));

    // Delete button
    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.textContent = "Usuń";
    deleteButton.addEventListener("click", () => deleteTask(task.id));

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(editButton);
    li.appendChild(deleteButton);

    return li;
}

// Add a new task
async function addTask() {
    const content = taskInput.value.trim();
    if (!content) return alert("Wpisz treść zadania!");

    const newTask = {
        content: content,
        completed: false
    };

    try {
        const response = await fetch(dataUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newTask)
        });
        if (!response.ok) throw new Error("Błąd podczas dodawania zadania");
        const task = await response.json();
        loadTasks();
    } catch (error) {
        console.error("Błąd dodawania zadania:", error);
    }

    taskInput.value = "";
}

// Toggle task completion
async function toggleTask(task) {
    task.completed = !task.completed;

    try {
        await fetch(`${dataUrl}/${task.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ completed: task.completed })
        });
        loadTasks();
    } catch (error) {
        console.error("Błąd zmiany statusu zadania:", error);
    }
}

// Edit a task
async function editTask(task) {
    const newContent = prompt("Edytuj zadanie:", task.content);
    if (!newContent || newContent.trim() === "") return; // Cancel or empty input

    try {
        const response = await fetch(`${dataUrl}/${task.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: newContent.trim() })
        });
        if (!response.ok) throw new Error("Błąd edycji zadania.");
        loadTasks(); // Reload tasks after successful edit
    } catch (error) {
        console.error("Błąd edytowania zadania:", error);
    }
}


// Delete a task
async function deleteTask(id) {
    try {
        await fetch(`${dataUrl}/${id}`, {
            method: "DELETE"
        });
        loadTasks();
    } catch (error) {
        console.error("Błąd usuwania zadania:", error);
    }
}

// Event Listeners
addButton.addEventListener("click", addTask);

// Initialize app
loadTasks();