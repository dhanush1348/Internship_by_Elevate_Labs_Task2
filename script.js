document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("taskInput");
  const addTaskBtn = document.getElementById("addTaskBtn");
  const taskList = document.getElementById("taskList");
  const priorityInput = document.getElementById("priorityInput");
  const deadlineInput = document.getElementById("deadlineInput");

  const priorityMap = { High: 1, Medium: 2, Low: 3 };
  const tasks = [];

  addTaskBtn.addEventListener("click", () => {
    const taskText = taskInput.value.trim();
    const priority = priorityInput.value;
    const deadline = deadlineInput.value;

    if (taskText === "") return;

    const taskObj = {
      text: taskText,
      priority: priority,
      deadline: deadline || "23:59",
      timestamp: new Date(),
      completed: false,
      suspended: false
    };

    tasks.push(taskObj);
    renderTasks();

    taskInput.value = "";
    deadlineInput.value = "";
    priorityInput.value = "Medium";
  });

  function renderTasks() {
    taskList.innerHTML = "";

    // Sort by deadline then priority
    tasks.sort((a, b) => {
      const timeA = getTimeObj(a.deadline);
      const timeB = getTimeObj(b.deadline);
      if (timeA < timeB) return -1;
      if (timeA > timeB) return 1;
      return priorityMap[a.priority] - priorityMap[b.priority];
    });

    const now = new Date();

    tasks.forEach((task, index) => {
      const li = document.createElement("li");
      const deadlineTime = getTimeObj(task.deadline);
      const isOverdue = now > deadlineTime && !task.completed;

      if (task.completed) li.classList.add("completed");
      if (task.suspended) li.classList.add("suspended");
      if (isOverdue) li.classList.add("not-done");

      const taskContent = document.createElement("div");
      taskContent.className = "task-text";
      taskContent.innerHTML = `
        <strong>${task.text}</strong><br/>
        <span class="priority">Priority: ${task.priority}</span><br/>
        <span class="deadline">Deadline: ${task.deadline}</span><br/>
        <span class="timestamp">Created: ${task.timestamp.toLocaleString()}</span>
      `;

      if (isOverdue) {
        const notDoneLabel = document.createElement("span");
        notDoneLabel.className = "not-done-label";
        notDoneLabel.textContent = "❌ Not Done (Deadline Missed)";
        taskContent.appendChild(notDoneLabel);
      }

      const completeBtn = document.createElement("button");
      completeBtn.textContent = "Compleated";
      completeBtn.className = "compleated";
      completeBtn.addEventListener("click", () => {
        task.completed = !task.completed;
        task.suspended = false;
        renderTasks();
      });

      const suspendBtn = document.createElement("button");
      suspendBtn.textContent = "Suspend";
      suspendBtn.className = "suspend";
      suspendBtn.addEventListener("click", () => {
        task.suspended = !task.suspended;
        task.completed = false;
        renderTasks();
      });

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.className = "delete";
      deleteBtn.addEventListener("click", () => {
        tasks.splice(index, 1);
        renderTasks();
      });

      li.appendChild(taskContent);
      li.appendChild(completeBtn);
      li.appendChild(suspendBtn);
      li.appendChild(deleteBtn);
      taskList.appendChild(li);
    });
  }

  function getTimeObj(timeStr) {
    const [hour, min] = timeStr.split(":").map(Number);
    const now = new Date();
    now.setHours(hour);
    now.setMinutes(min);
    now.setSeconds(0);
    now.setMilliseconds(0);
    return now;
  }
});
