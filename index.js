const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount = 0;

handleSlider();
setIndicator("#ccc");

function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min) * 100 / (max - min)) + "% 100%";
    // backgroundSize width:((passwordLength - min) * 100 / (max - min)) + "% ,height "100%"
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    //shadow homework
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
    return getRndInteger(0, 9);
}

function generateLowerCase() {
    return String.fromCharCode(getRndInteger(97, 123));
}

function generateUpperCase() {
    return String.fromCharCode(getRndInteger(65, 91));
}

function generateSymbol() {
    // return symbols[getRndInteger(0, symbols.length)];
    //another way
    return symbols.charAt(getRndInteger(0, symbols.length));
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
    } else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = 'copied';
    } catch (e) {
        copyMsg.innerText = 'failed';
    }
    //to make span tag visible
    copyMsg.classList.add('active');

    //to make span tag invisible
    setTimeout(() => {
        copyMsg.classList.remove('active');
    }, 2000);
}

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
});

copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value) {
        copyContent();
    }
});

function shufflePassword(array) {
    //Fisher Yates method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked) {
            checkCount++;
        }
    });
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}
allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
});

generateBtn.addEventListener('click', () => {
    if (checkCount == 0) return;
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    //remove old password
    password = "";

    //let's put the checkboxes
    let funcArray = [];
    if (uppercaseCheck.checked) {
        funcArray.push(generateUpperCase);
    }
    if (lowercaseCheck.checked) {
        funcArray.push(generateLowerCase);
    }
    if (numbersCheck.checked) {
        funcArray.push(generateRandomNumber);
    }
    if (symbolsCheck.checked) {
        funcArray.push(generateSymbol);
    }
    //compulsory addition
    for (let i = 0; i < funcArray.length; i++) {
        password += funcArray[i]();
    }
    //remaining addition
    for (let i = 0; i < passwordLength - funcArray.length; i++) {
        let randIndex = getRndInteger(0, funcArray.length);
        password += funcArray[randIndex]();
    }
    //shuffle the password
    password = shufflePassword(Array.from(password));

    //show in UI
    passwordDisplay.value = password;
    calcStrength();
});