const form = document.querySelector(".todo-form");
const input = document.querySelector(".todo-input");
const theme = document.querySelector(".themes-img");
const counterText = document.querySelector(".counter");
const todoBox = document.querySelector(".todo-box");
const todoList = document.querySelector(".todo-list");
const categories = document.querySelectorAll(".todo-category");
const clearBtn = document.querySelector(".btn-clear");
const mainContainer = document.querySelector(".main");
const allCategory = document.querySelector(".all-category");
const activeCategory = document.querySelector(".active-category");
const completeCategory = document.querySelector(".completed-category");
let counter = 0;

// Event listeners
form.addEventListener("submit", addItem);
clearBtn.addEventListener("click", clearToDos);
activeCategory.addEventListener("click", showActive);
allCategory.addEventListener("click", showAll);
completeCategory.addEventListener("click", showCompleted);
window.addEventListener("DOMContentLoaded", setupItems);

// Switch themes
document.addEventListener("DOMContentLoaded", function () {
  let theme = localStorage.getItem("theme");
  if (theme) {
    applyTheme(theme);
  }

  let themeSwitcher = document.querySelector(".themes-img");
  themeSwitcher.addEventListener("click", function (event) {
    const img = event.currentTarget;

    document.documentElement.classList.toggle("dark-theme");
    mainContainer.classList.toggle("dark-main");

    if (!mainContainer.classList.contains("dark-main")) {
      setTheme("light");
      img.setAttribute("src", "img/icon-moon.svg");
      mainContainer.classList.remove("dark-main");
    } else {
      setTheme("dark");
      img.setAttribute("src", "img/icon-sun.svg");
      mainContainer.classList.add("dark-main");
    }
  });
});

// Set theme on local storage
function setTheme(theme) {
  localStorage.setItem("theme", theme);
  applyTheme(theme);
}

// Apply theme
function applyTheme(theme) {
  if (theme === "dark") {
    document.documentElement.classList.add("dark-theme");
    mainContainer.classList.add("dark-main");
  } else {
    document.documentElement.classList.remove("dark-theme");
    mainContainer.classList.remove("dark-main");
  }
}

// Set back to default
function setBackToDefault() {
  input.value = "";
}

// Delete items
function deleteItem(event) {
  const element = event.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;
  removeFromLocalStorage(id);
  counter--;
  counterText.textContent = counter;
  todoList.removeChild(element);
}

// Clear items
function clearToDos() {
  const toDos = document.querySelectorAll(".todo-item");

  if (toDos.length > 0) {
    toDos.forEach(function (todo) {
      todoList.removeChild(todo);
    });
  }

  toDos.forEach((toDo) => {
    const id = toDo.dataset.id;
    removeFromLocalStorage(id);
  });

  counter = 0;
  counterText.textContent = counter;
  setBackToDefault();
}

// Add items
function addItem(event) {
  event.preventDefault();

  const value = input.value;
  const id = new Date().getTime().toString();

  if (value) {
    createListItem(id, value);

    addToLocalStorage(id, value);
    counter++;
    counterText.textContent = counter;
    setBackToDefault();
  }
}

// Change active class for li elements
categories.forEach(function (category) {
  category.addEventListener("click", function (event) {
    const currentCategory = event.currentTarget;

    categories.forEach(function (item) {
      item.classList.remove("active");
      currentCategory.classList.add("active");
    });
  });
});

// Show active items
function showActive() {
  const toDos = document.querySelectorAll(".todo-item");
  let activeItems = 0;
  if (toDos.length > 0) {
    toDos.forEach(function (todo) {
      if (!todo.classList.contains("completed")) {
        activeItems++;
        todo.classList.remove("hidden");
        todo.classList.add("show");
      } else {
        todo.classList.add("hidden");
      }
    });
  }
  counterText.textContent = activeItems;
  setBackToDefault();
}

// Show all items
function showAll() {
  const toDos = document.querySelectorAll(".todo-item");

  if (toDos.length > 0) {
    toDos.forEach(function (todo) {
      todo.classList.remove("hidden");
      todo.classList.add("show");
    });
  }
  counterText.textContent = counter;
  setBackToDefault();
}

// Show completed items
function showCompleted() {
  const toDos = document.querySelectorAll(".todo-item");

  if (toDos.length > 0) {
    toDos.forEach(function (todo) {
      if (todo.classList.contains("completed")) {
        todo.classList.remove("hidden");
        todo.classList.add("show");
      } else {
        todo.classList.add("hidden");
      }
    });
  }

  counterText.textContent = 0;
  setBackToDefault();
}

// Add to local storage
function addToLocalStorage(id, value) {
  const toDoList = { id: id, value: value };

  let items = localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
  items.push(toDoList);
  localStorage.setItem("list", JSON.stringify(items));
}

// Remove from local storage
function removeFromLocalStorage(id) {
  let items = getLocalStorage();

  items = items.filter(function (item) {
    if (item.id !== id) {
      return item;
    }
  });
  localStorage.setItem("list", JSON.stringify(items));
}

// Get data from local storage
function getLocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}

// Display to do items from local storage
function setupItems() {
  let items = getLocalStorage();
  counter = items.length;
  counterText.textContent = counter;

  if (items.length > 0) {
    items.forEach(function (item) {
      createListItem(item.id, item.value);
    });
  }
}

// Create to do item
function createListItem(id, value) {
  const element = document.createElement("article");
  element.classList.add("todo-item");
  element.classList.add("active-item");
  element.classList.add("draggable");
  element.setAttribute("draggable", "true");

  const attr = document.createAttribute("data-id");
  attr.value = id;
  element.setAttributeNode(attr);
  element.innerHTML = `
  <div class="todo-input-box">
    <input type="checkbox" class="todo-item-checkbox" />
    <p class="todo-title">${value}</p>
  </div>
  <div class="btn-delete-box">
    <button class="delete-btn">
      <img src="img/icon-cross.svg" alt="cross icon" />
    </button>
  </div>`;

  // Delete items - Event listener
  const deleteBtn = element.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", deleteItem);

  // Delete items - Styling
  element.addEventListener("mouseover", function () {
    const deleteBtn = element.querySelector(".delete-btn");
    deleteBtn.style.display = "block";
  });

  // Delete items - Styling
  element.addEventListener("mouseout", function () {
    const deleteBtn = element.querySelector(".delete-btn");
    deleteBtn.style.display = "none";
  });

  // Checkbox - Styling
  const todoCheckbox = element.querySelector(".todo-item-checkbox");
  todoCheckbox.addEventListener("click", function () {
    const todoTitle = element.querySelector(".todo-title");
    todoCheckbox.classList.toggle("checked");
    todoTitle.classList.toggle("completed-title");
    element.classList.toggle("completed");

    if (element.classList.contains("completed")) {
      counter--;
      counterText.textContent = counter;
    } else {
      counter++;
      counterText.textContent = counter;
    }
  });

  // Drag and drop
  const draggables = document.querySelectorAll(".draggable");
  const container = document.querySelector(".todo-list");

  draggables.forEach((draggable) => {
    draggable.addEventListener("dragstart", () => {
      draggable.classList.add("dragging");
    });

    draggable.addEventListener("dragend", () => {
      draggable.classList.remove("dragging");
    });
  });

  container.addEventListener("dragover", (e) => {
    e.preventDefault();
    const afterElement = getDragAfterElement(container, e.clientY);
    const draggable = document.querySelector(".dragging");
    if (afterElement == null) {
      container.appendChild(draggable);
    } else {
      container.insertBefore(draggable, afterElement);
    }
  });

  function getDragAfterElement(container, y) {
    const draggableElements = [
      ...container.querySelectorAll(".draggable:not(.dragging)"),
    ];

    return draggableElements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY }
    ).element;
  }

  todoList.appendChild(element);
}
