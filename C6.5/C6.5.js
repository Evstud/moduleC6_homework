const btn = document.querySelector('.btn');

const scrWidth = window.screen.width;
const scrHeight = window.screen.height;

btn.addEventListener('click', () => {
  alert(`Screen width is ${scrWidth},\n\screen height is ${scrHeight}.`);
})
