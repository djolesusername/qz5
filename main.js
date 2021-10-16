//theme changing logic

const $purple = document.getElementById("purple");
const $light = document.getElementById("light");
const $dark = document.getElementById("dark");

function getCurrentTheme() {
  let theme;

  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    theme = "dark";
  } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
    theme = "light";
  }

  localStorage.getItem("calc.theme") ? (theme = localStorage.getItem("calc.theme")) : null;
  if (theme === "light") {
    document.getElementById("light").checked = true;
  }
  if (theme === "dark") {
    document.getElementById("dark").checked = true;
  }
  if (theme === "purple") {
    document.getElementById("purple").checked = true;
  }

  return theme;
}

function loadTheme(theme) {
  const root = document.querySelector(":root");
  root.setAttribute("color-scheme", `${theme}`);
}

$purple.addEventListener("click", () => {
  theme = "purple";
  localStorage.setItem("calc.theme", `${theme}`);
  loadTheme(theme);
});

$light.addEventListener("click", () => {
  theme = "light";
  localStorage.setItem("calc.theme", `${theme}`);
  loadTheme(theme);
});

$dark.addEventListener("click", () => {
  theme = "dark";
  localStorage.setItem("calc.theme", `${theme}`);
  loadTheme(theme);
});

window.addEventListener("DOMContentLoaded", () => {
  loadTheme(getCurrentTheme());
});

// CSS animation button for keydown event

const handleAnimation = (event) => {
  try {
    const buttonToAnimate = document.querySelector(`div[data-type="${event.keyCode}"]`);
    if (!buttonToAnimate) {
      return;
    }
    buttonToAnimate.classList.add("activekey");
  } catch (err) {
    console.log("key not used");
  }
};

//Calculator logic
const screen = document.getElementById("screen");
let acceptedOperations = ["/", "*", "+", "-"];
let clearOrExec = ["Delete", "Enter"];
let numberRegex = /\d/;
let input = "0";
let operationsRegex = /[-,+,*,/]/gi;
//helper variable to deal with .
let subinput = "";

const inputReset = () => {
  if (input == 0 && input.length == 1) {
    input = "";
    subinput = "";
  }
};

const handleDigit = (numberInput) => {
  inputReset();
  input = input.concat(numberInput);
  subinput = subinput.concat(numberInput);
  screen.innerHTML = input;
};

const handleReset = () => {
  input = "0";
  subinput = "";
  screen.innerHTML = input;
};

const handleDelete = () => {
  if (input.length === 1) {
    handlenumInputet();
    return;
  }
  input = input.slice(0, -1);
  subinput = subinput.slice(0, -1);
  screen.innerHTML = input;
};

const handleOperation = (e) => {
  if (acceptedOperations.indexOf(input[input.length - 1]) !== -1) {
    input = input.slice(0, -1).concat(e);
    screen.innerHTML = input;
    return;
  }
  input = input.concat(e);
  screen.innerHTML = input;
  subinput = "";
};

//on = sign takes input and does the math :)

const goCalc = () => {
  let result;
  let numInput = input.split(operationsRegex);
  let operations;
  operations = input.match(operationsRegex);
  if (!operations) {
    return;
  }
  if (numInput.length < 2) {
    return;
  }

  if (!input.match(/[0-9]$/)) {
    return;
  }

  while (operations.indexOf("*") >= 0) {
    let value1 = numInput[operations.indexOf("*")];
    let value2 = numInput[operations.indexOf("*") + 1];

    let operationResult = value1 * value2;
    result = operationResult;
    //ubacujem rezultat na mesto druge vrednosti
    numInput[operations.indexOf("*") + 1] = operationResult;
    // brisem prvu vrednost i izvrsenu operaciju
    numInput.splice(operations.indexOf("*"), 1);
    operations.splice(operations.indexOf("*"), 1);
  }

  while (operations.indexOf("/") >= 0) {
    let value1 = numInput[operations.indexOf("/")];
    let value2 = numInput[operations.indexOf("/") + 1];
    if (value2 == 0) {
      input = "0";
      return;
    }

    if (value2 !== 0) {
      let operationResult = value1 / value2;
      result = operationResult;

      //ubacujem rezultat na mesto druge vrednosti
      numInput[operations.indexOf("/") + 1] = operationResult;
      // brisem prvu vrednost i izvrsenu operaciju
      numInput.splice(operations.indexOf("/"), 1);
      operations.splice(operations.indexOf("/"), 1);
    }
  }

  while (operations.indexOf("-") >= 0) {
    let value1 = numInput[operations.indexOf("-")];
    let value2 = numInput[operations.indexOf("-") + 1];

    let operationResult = value1 - value2;
    result = operationResult;

    //ubacujem rezultat na mesto druge vrednosti
    numInput[operations.indexOf("-") + 1] = operationResult;
    // brisem prvu vrednost i izvrsenu operaciju
    numInput.splice(operations.indexOf("-"), 1);
    operations.splice(operations.indexOf("-"), 1);
  }
  while (operations.indexOf("+") >= 0) {
    let value1 = numInput[operations.indexOf("+")];
    let value2 = numInput[operations.indexOf("+") + 1];

    let operationResult = Number(value1) + Number(value2);
    result = operationResult;

    //ubacujem rezultat na mesto druge vrednosti
    numInput[operations.indexOf("+") + 1] = operationResult;
    // brisem prvu vrednost i izvrsenu operaciju
    numInput.splice(operations.indexOf("+"), 1);
    operations.splice(operations.indexOf("+"), 1);
  }

  input = String(result);
  subinput = String(result);
  screen.innerHTML = input;
};

//keyboard eventlistenrs
window.addEventListener("keydown", function (e) {
  //handle CSS animation
  handleAnimation(e);
  //handling digits
  if (e.key.match(numberRegex)) {
    handleDigit(e.key);
    return;
  }
  //Check if we are dealing with operation.
  // making sure that last typed input isn't an operation already - in which case we replace it
  //if last typed input is . operator is ignored
  if (acceptedOperations.indexOf(e.key) !== -1 && input[input.length - 1] !== ".") {
    handleOperation(e.key);
    return;
  }
  //removing one character
  if (e.key == "Delete") {
    handleDelete();
    return;
  }
  //handling . avoiding .. with subinput throught out the logic
  //and making sure that . doesn't go next to operation sign
  if (e.key == "." && acceptedOperations.indexOf(input[input.length - 1]) === -1) {
    if (subinput.indexOf(".") !== -1) {
      return;
    }
    input = input.concat(e.key);
    subinput = subinput.concat(e.key);
    screen.innerHTML = input;
    return;
  }

  if (e.key === "c") {
    handleReset();
  }
});

//mouse event listeners
document.querySelectorAll(".key").forEach((item) => {
  item.addEventListener("click", (event) => {
    handleDigit(event.target.textContent);
  });
});
document.getElementById("reset").addEventListener("click", function () {
  handleReset();
});

document.getElementById("delete").addEventListener("click", function () {
  handleDelete();
});

document.getElementById("equals").addEventListener("click", function () {
  goCalc();
});

document.querySelectorAll(".operation").forEach((item) => {
  item.addEventListener("click", (event) => {
    if (input[input.length - 1] !== ".") {
      let sign = event.target.textContent;
      if (sign == "x") {
        sign = "*";
      }
      handleOperation(sign);
    }
  });
});
