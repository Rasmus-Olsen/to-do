"use strict";

document.addEventListener("DOMContentLoaded", init);

// Henter gemte opgaver fra localStorage eller starter med en tom liste.
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Tilføj event listener til formularen og vis eksisterende opgaver
function init() {
  document.querySelector(".todo-form").addEventListener("submit", addTask);
  renderTasks();
}

// Tilføjer en ny opgave
function addTask(event) {
  event.preventDefault();

  const taskInput = document.querySelector(".task-input").value.trim();
  const quantity = document.querySelector(".quantity-input").value || 1;
  const errorMessage = document.querySelector(".error-message");

  // Tjekker, om opgaveteksten er tom
  if (taskInput === "") {
    errorMessage.classList.add("visible");
    return;
  } else {
    errorMessage.classList.remove("visible");
  }

  // Opretter en ny opgave
  const newTask = {
    id: crypto.randomUUID(), // Genererer et unikt ID for opgaven ved hjælp af randomUUID()
    task: taskInput,
    quantity: quantity,
    done: false,
  };

  // Tilføjer opgaven til listen og gemmer
  tasks.push(newTask);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  // Nulstiller inputfelterne og opdaterer visningen
  document.querySelector(".task-input").value = "";
  document.querySelector(".quantity-input").value = "";
  renderTasks();
}

// Opdaterer og viser opgavelisten
function renderTasks() {
  const todoList = document.querySelector(".todo-list");
  const doneList = document.querySelector(".done-list");
  todoList.innerHTML = "";
  doneList.innerHTML = "";

  // Går igennem alle opgaver i tasks-arrayet og genererer HTML-indhold for hver opgave
  tasks.forEach((task) => {
    const template = document.getElementById("task-template");
    const li = template.content.cloneNode(true).querySelector("li");
    li.setAttribute("data-task-id", task.id); // Tilføjer data-task-id-attribut til li
    const taskText = li.querySelector(".task-text");

    // Viser opgaveteksten og antal, hvis relevant
    taskText.textContent = task.quantity > 1 ? `${task.task} (${task.quantity})` : task.task;

    // Opdaterer udseendet af opgaven afhængigt af status
    if (task.done) {
      li.classList.add("done-task");
    } else {
      li.classList.remove("done-task");
    }

    // Tilføjer event listener til li for at håndtere klik på knapper
    li.addEventListener("click", handleTaskAction);

    // Tilføjer opgaven til den rigtige liste
    if (task.done) {
      doneList.appendChild(li);
    } else {
      todoList.appendChild(li);
    }
  });
}

// Håndterer klik på knapperne "Færdig", "Fortryd" og "Slet"
function handleTaskAction(event) {
  const li = event.currentTarget; // Det aktuelle li-element
  const taskId = li.getAttribute("data-task-id"); // Henter task ID fra data-attributten
  const buttonClass = event.target.classList; // Får den klasse af den knap, der blev klikket på

  if (buttonClass.contains("done-btn")) {
    markDone(taskId);
  } else if (buttonClass.contains("undo-btn")) {
    undoTask(taskId);
  } else if (buttonClass.contains("delete-btn")) {
    deleteTask(taskId);
  }
}

// Markerer en opgave som færdig
function markDone(id) {
  const task = tasks.find((task) => task.id === id);
  task.done = true;
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

// Fortryder en færdig opgave
function undoTask(id) {
  const task = tasks.find((task) => task.id === id);
  task.done = false;
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

// Sletter en opgave fra listen
function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}
