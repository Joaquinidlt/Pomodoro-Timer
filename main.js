const tasks = []; // aqui voy almacenando las tareas que puedo ir  ejecutando
let time = 0; // esta me va a llevar la cuenta regresiva y la inicializo en 0
let timer = null;
let timerBreak = null;
let current = null; // esta me dice la tarea que se esta ejecutando

const bAdd = document.querySelector("#bAdd");
const itTask = document.querySelector("#itTask");
const form = document.querySelector("#form");
const taskName = document.querySelector('#time #taskName');// aqui hago una consulta a mi etiqueta "#time" y "#taskNmae".

renderTime();
renderTasks();

form.addEventListener("submit", e => { // le digo que ejecute una funcion cuando se ejecute el efecto de "submit"
    e.preventDefault(); // con esto hacemos que cuando nosotros enviemos nuestro formulario, realmente no se envie.
    // anulamos el funcionamiento nativo.
    if (itTask.value !== "") {
        createTask(itTask.value)
        itTask.value = ""; // elimino el texto de mi input
        renderTasks();
    }
});

function createTask(value) {

    const newTask = {
        id: (Math.random() * 100).toString(36).slice(3),
        title: value,
        completado: false,
    };

    tasks.unshift(newTask); // lo agrego a mi arreglo
}

function renderTasks() {
    const html = tasks.map((task) => { // con esto, cada uno de mis arreglos en tasks va a tener este "html"
        return `
            <div class="task">
                <div class="completed">${task.completed
                ? `<span class="done">Done</span>`
                : `<button class="start-button" data-id="${task.id}">Start</button>`
            }</div>
                <div class="title">${task.title}</div>
            </div>
        `;
    });

    const tasksContainer = document.querySelector("#tasks");
    tasksContainer.innerHTML = html.join("");

    const startButtons = document.querySelectorAll('.task .start-button'); // con querySelectorAll me va a devolver todas las coincidencias que le ponga

    startButtons.forEach(button => {
        button.addEventListener('click', e => {
            if (!timer) { // pregunto si no existe timer, para saber que no hay una actividad en progreso
                const id = button.getAttribute('data-id');
                startButtonHandler(id);
                button.textContent = "In progress...";
            }
        });
    });
}

function startButtonHandler(id) {
    time = 5;
    current = id; // A nuestra variable "current" va a almacenar nuestro "id" de la actividad actual
    const taskIndex = tasks.findIndex((task) => task.id === id); // aca busco el task que tiene el "id" que estoy recibiendo como parametro, lo almaceno en "taskIndex".

    taskName.textContent = tasks[taskIndex].title; // en esta linea, con "tasks[taskIndex].title" busco el nombre de mi tarea en curso, y la muestro.
    renderTime();
    timer = setInterval(() => { // setInterval() me permite ejecutar una funcion de forma indefinida hasta que la detenga.
        timerHandler(id);
    }, 1000); // este segundo parametro es cuanto tiempo voy a ejecutar esta funcion, pongo 1000 por que estamos contando con milisegundos.
}

function timerHandler(id) {
    time--; // cada vez que se ejecute, cada segundo, le digo que "time" se decremente en "1"
    renderTime();

    if (time === 0) {
        clearInterval(timer);
        markCompleted(id);
        timer = null;
        renderTasks();
        startBreak();
    }
}

function renderTime() { // esta funcion me va a permitir darle formato a un numero.
    const timeDiv = document.querySelector('#time #value');
    const minutes = parseInt(time / 60); // "parseInt" nos permite transformar a un entero.
    const seconds = parseInt(time % 60);

    timeDiv.textContent = `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

function markCompleted(id) {
    const taskIndex = tasks.findIndex((task) => task.id === id); // aca busco el task que tiene el "id" que estoy recibiendo como parametro, lo almaceno en "taskIndex".
    tasks[taskIndex].completed = true;
}

function startBreak() {
    time = 3;
    taskName.textContent = 'Break';
    renderTime();
    timerBreak = setInterval(() => {
        timerBreakHandler();
    }, 1000);
}

function timerBreakHandler() {
    time--; // cada vez que se ejecute, cada segundo, le digo que "time" se decremente en "1"
    renderTime();// Renderizamos en cada cambio el tiempo

    if (time === 0) { // validamos si nuestro tiempo llego a "0"
        clearInterval(timerBreak); // vamos a limpiarlo
        current = null;
        timerBreak = null;
        taskName.textContent = "";
        renderTasks();// por ultimo renderizo las tareas
    }
}