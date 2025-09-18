(function () {
  "use strict";

  
  const boardKeyFromSummary = (summaryText) => `todo_board_${summaryText.toLowerCase()}`;

  function ensureListContainer(detailsEl) {
    
    let list = detailsEl.querySelector("ul.task-list");
    if (!list) {
      list = document.createElement("ul");
      list.className = "task-list";
      
      const after = detailsEl.querySelector("p.par");
      if (after && after.nextSibling) {
        detailsEl.insertBefore(list, after.nextSibling);
      } else {
        detailsEl.appendChild(list);
      }
    }
    return list;
  }

  function loadTasks(storageKey) {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return [];
      const data = JSON.parse(raw);
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }

  function saveTasks(storageKey, tasks) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(tasks));
    } catch {
      
    }
  }

  function renderTasks(listEl, tasks) {
    listEl.innerHTML = "";
    tasks.forEach((task, index) => {
      const li = document.createElement("li");
      li.className = "task-item";

      const span = document.createElement("span");
      span.textContent = task.text;
      span.className = "task-text";

      const delBtn = document.createElement("button");
      delBtn.textContent = "Delete";
      delBtn.className = "del";
      delBtn.addEventListener("click", (e) => {
        e.preventDefault();
        tasks.splice(index, 1);
        renderTasks(listEl, tasks);
        const summaryText = listEl.closest("details").querySelector("summary").textContent.trim();
        saveTasks(boardKeyFromSummary(summaryText), tasks);
      });

      li.appendChild(span);
      li.appendChild(delBtn);
      listEl.appendChild(li);
    });
  }

  function promptForTask(summaryText) {
    const input = prompt(`Add a task to ${summaryText}:`, "");
    if (input && input.trim().length > 0) {
      return { text: input.trim() };
    }
    return null;
  }

  function setupBoard(detailsEl) {
    const summaryEl = detailsEl.querySelector("summary");
    if (!summaryEl) return;

    const summaryText = summaryEl.textContent.trim();
    const storageKey = boardKeyFromSummary(summaryText);
    const listEl = ensureListContainer(detailsEl);

    
    const tasks = loadTasks(storageKey);
    renderTasks(listEl, tasks);

    
    const addBtn = detailsEl.querySelector("button:not(.del)");
    if (addBtn) {
      addBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const task = promptForTask(summaryText);
        if (task) {
          tasks.push(task);
          renderTasks(listEl, tasks);
          saveTasks(storageKey, tasks);
        }
      });
    }

    
    const clearBtn = detailsEl.querySelector("button.del");
    if (clearBtn) {
      clearBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (tasks.length === 0) return;
        const ok = confirm(`Clear all tasks in ${summaryText}?`);
        if (!ok) return;
        tasks.splice(0, tasks.length);
        renderTasks(listEl, tasks);
        saveTasks(storageKey, tasks);
      });
    }
  }

  function main() {
    const allDetails = document.querySelectorAll(".board1 details, .board2 details, .board3 details, .board4 details, .board5 details");
    allDetails.forEach(setupBoard);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", main);
  } else {
    main();
  }
})(); 