// Присваиваем переменной url эхо-сервера
const echoUrl = "wss://echo-ws-service.herokuapp.com";

// Объявляем переменные согласно нодам
const textInp = document.querySelector('.user_inp');
const btnSend = document.querySelector('.btn_send');
const btnGeo = document.querySelector('.btn_geo');
const chatWrap = document.querySelector('.chat_wrap');
const chatTxt = document.querySelector('.chat_txt');

// функция вывода сообщения пользователя в окно чата
function writeToScreen(message){
  // создаем контейнер div
  let preDiv = document.createElement("div");
  // создаем элемент с тегом <p>
  let pre = document.createElement("p");
  // добавляем стилей для div
  preDiv.style.display = "flex";
  preDiv.style.marginRight = "10px";
  // добавляем стили для <p> из файла css
  pre.classList.add('userMessage');
  // записываем в <p> текст сообщения
  pre.innerHTML = message;
  // размещаем элементы в DOM
  preDiv.appendChild(pre);
  chatTxt.appendChild(preDiv);
  // отображаем последние сообщения в чате
  chatWrap.scrollTop = chatWrap.scrollHeight - chatWrap.clientHeight;
  
}  

// функция вывода сообщения эхо-сервера в окно чата
// функция аналогична ф-ии writeToScreen() только сообщения выводятся слева
function writeToScreenEcho(message){
  let preDiv = document.createElement("div");
  let pre = document.createElement("p");
  preDiv.style.display = "flex";
  preDiv.style.marginLeft = "10px";
  pre.classList.add('echoMessage');
  preDiv.appendChild(pre);
  pre.innerHTML = message;
  chatTxt.appendChild(preDiv);
  chatWrap.scrollTop = chatWrap.scrollHeight - chatWrap.clientHeight;
}  

let websocket;

// при фокусе на input
textInp.onfocus = () => {
  // открываем WebSocket-соединение
  websocket = new WebSocket(echoUrl);
  // при успешном открытии - сообщение в консоль
  websocket.onopen = function(evt){
    console.log('Connected.');
  };
  // при закрытии - сообщение в консоль
  websocket.onclose = function(evt){
    console.log('Disconnected');
  };
  // при получении сообщения от сервера инициализируем функцию вывода сообщения в окно чата
  websocket.onmessage = function(evt){
    writeToScreenEcho(evt.data);
  };
  // при ошибке соединения - выводим сообщение в окно чата
  websocket.onerror = function(evt){
    writeToScreenEcho('Error' + evt.data);
  };
};

// назначаем обработчик событий на клик по кнопке отправки сообщения
btnSend.addEventListener('click', () => {
  // записываем сообщение в переменную message
  const message = textInp.value;
  // выводим сообщение в окно чата
  writeToScreen(message);
  // отправляем данные на по WebSocket-соединению
  websocket.send(message);
});

// при закрытии окна браузера закрываем соединение
window.onclose = () => {
  websocket.close();
  websocket = null;
  console.log("Disconnected");
};

// функция, выводящая текст об ошибке при попытке получить данные о местоположении
const error = () => {
  writeToScreen("Невозможно получить ваше местоположение");
}

// функция, срабатывающая при успешном получении геолокации
const success = (position) => {
  //   console.log('position', position);
  // записываем координаты в переменные
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  // подготавливаем контейнер и ссылку для вывода сообщения в окно чата
  let preDiv = document.createElement("div");
  const link = document.createElement("a");
  preDiv.classList.add('geoDiv');
  link.classList.add('link');
  link.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
  link.textContent = 'Ссылка на карту с геолокацией';
  link.target = "_blank";
  // размещаем элементы в DOM
  preDiv.appendChild(link);
  chatTxt.appendChild(preDiv);
  // отображаем последние сообщения в чате
  chatWrap.scrollTop = chatWrap.scrollHeight - chatWrap.clientHeight;
}  

// назначаем обработчик событий на клик по кнопке геолокации
btnGeo.addEventListener('click', () => {
  // проверяем возможность браузера обрабатывать данные по геолокации
  if (!navigator.geolocation){
    writeToScreen("Geolocation не поддерживается вашим браузером");
    // инициализируем функцию получения данных о геолокации
  } else {
    navigator.geolocation.getCurrentPosition(success, error);
  }
});