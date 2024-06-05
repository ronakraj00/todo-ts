import { v4 as uuidv4 } from 'uuid';

type Task = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
};

let totalCompletedTask: number = 0;
let totalTodoTask: number = 0;

const todoCount = document.querySelector('#todo-count');
const completedCount = document.querySelector('#completed-count');

const completedList = document.querySelector('#completed');
const list = document.querySelector<HTMLUListElement>('#list');
const form = document.getElementById('new-task-form') as HTMLFormElement | null;
const input = document.querySelector<HTMLInputElement>('#new-task-title');
const tasks: Task[] = loadTasks();

function renderTasks() {
  const list = document.querySelector<HTMLUListElement>('#list');
  if (list == null) return;
  list.textContent = '';
  const completed = document.querySelector('#completed');
  if (completed == null) return;
  else completed.textContent = '';

  totalCompletedTask = 0;
  totalTodoTask = 0;

  tasks.forEach((task) => {
    if (task.completed) {
      totalCompletedTask += 1;
      addCompletedItem(task);
    } else {
      totalTodoTask += 1;
      addListItem(task);
    }
  });
  setCounts();
}

function setCounts() {
  if (todoCount == null || completedCount == null) return;
  todoCount.textContent = totalTodoTask as unknown as string;
  completedCount.textContent = totalCompletedTask as unknown as string;
}

renderTasks();

form?.addEventListener('submit', (e) => {
  e.preventDefault();
  if (input?.value == '' || input?.value == null) return;
  const newTask: Task = {
    id: uuidv4(),
    title: input.value,
    completed: false,
    createdAt: new Date(),
  };
  tasks.push(newTask);
  saveTasks();
  addListItem(newTask);
  input.value = '';
});

function addCompletedItem(task: Task) {
  const item = createTaskLi(task);
  completedList?.append(item);
}

function createTaskLi(task: Task): HTMLLIElement {
  const item = document.createElement('li');
  const label = document.createElement('label');
  const checkbox = document.createElement('input');
  checkbox.addEventListener('change', () => {
    task.completed = checkbox.checked;
    saveTasks();
    renderTasks();
  });
  checkbox.type = 'checkbox';
  checkbox.checked = task.completed;
  label.append(checkbox, task.title);
  item.append(label);
  return item;
}

function addListItem(task: Task) {
  const item = createTaskLi(task);
  list?.append(item);
}

function saveTasks() {
  localStorage.setItem('TASKS', JSON.stringify(tasks));
}

function loadTasks(): Task[] {
  const taskJSON = localStorage.getItem('TASKS');
  if (taskJSON == null) return [];
  return JSON.parse(taskJSON);
}
