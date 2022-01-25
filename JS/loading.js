  const wait = (delay = 0) =>
  new Promise(resolve => setTimeout(resolve, delay));

const setVisible = (elementOrSelector, visible) => 
  (typeof elementOrSelector === 'string'
    ? document.querySelector(elementOrSelector)
    : elementOrSelector
  ).style.display = visible ? 'block' : 'none';

setVisible('.container', false);
setVisible('#loading', true);
document.querySelector("footer").style.position = 'relative';
document.querySelector("footer").style.top = '1000%';

document.addEventListener('DOMContentLoaded', () =>
  wait(1000).then(() => {
    setVisible('.container', true);
    setVisible('#loading', false);
  }));