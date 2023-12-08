//Находим элементы на странцие

const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const taskList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

let tasks = [];

if(localStorage.getItem('tasks')){
    tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach((task)=>renderTask(task));
}



checkEmptyList();

//Добавление задачи
form.addEventListener('submit', addTask);

//Удаление задачи
taskList.addEventListener('click', deleteTask);

//Отмечаем задачу завершенной
taskList.addEventListener('click', doneTask)


function addTask(event) {
    event.preventDefault();//чтобы чтраница не перезагружалась
    const taskText = taskInput.value;

    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false,
    };

    tasks.push(newTask);

    saveToLocalStorage();

    renderTask(newTask);

    //Отчищаем поле ввода и возвращаем на него фокус

    taskInput.value = "";
    taskInput.focus();

    checkEmptyList();
}

function deleteTask(event) {

    if (event.target.dataset.action !== 'delete') return;


    //проверкка что клик был по кнопке удалит задачу

    const parentNode = event.target.closest('.list-group-item');//ищет снаружи элемента

    const id = Number(parentNode.id);

    const index = tasks.findIndex((task) => task.id === id);


    tasks.splice(index, 1);

    parentNode.remove();

    saveToLocalStorage();


    //пкогда нет задач показать список пуст

    checkEmptyList();
}

function doneTask(event) {
    if (event.target.dataset.action !== 'done') return;

    const parentNode = event.target.closest('.list-group-item');

    const id = Number(parentNode.id);

    const task = tasks.find((task) => (task.id === id));
    //меняем значение done
    task.done = !task.done

    saveToLocalStorage();

    const taskTitle = parentNode.querySelector('.task-title');
    taskTitle.classList.toggle('task-title--done');
}

function checkEmptyList() {
    if (tasks.length === 0) {
        const emptyListHtml = `<li id="emptyList" class="list-group-item empty-list">
        <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
        <div class="empty-list__title">Список дел пуст</div>
    </li>`;

        taskList.insertAdjacentHTML('afterbegin', emptyListHtml);
    }

    if (tasks.length > 0) {
        const emptyListEl = document.querySelector('#emptyList');
        emptyListEl ? emptyListEl.remove() : null;
    }
}

function saveToLocalStorage(){
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

function renderTask(task){
    const cssClass = task.done ? "task-title task-title--done" : "task-title";

    const taskHtml = `
    <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
    <span class="${cssClass}">${task.text}</span>
    <div class="task-item__buttons">
        <button type="button" data-action="done" class="btn-action">
            <img src="./img/tick.svg" alt="Done" width="18" height="18">
        </button>
        <button type="button" data-action="delete" class="btn-action">
            <img src="./img/cross.svg" alt="Done" width="18" height="18">
        </button>
    </div>
</li>`

    taskList.insertAdjacentHTML('beforeend', taskHtml);
}
