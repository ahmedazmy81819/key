// قائمة كلمات عشوائية (5 و 6 حروف فقط)
const words = [
    "تفاحة", "برتقال", "موز", "فراولة", "عنب", "مانجو", "بطيخ", "شمام", "خوخ", "كمثرى",
    "طائرة", "سيارة", "قطار", "دراجة", "سفينة", "غواصة", "طائرة", "سيارة", "قطار", "دراجة",
    "مدرسة", "جامعة", "مكتبة", "مستشفى", "فندق", "مطعم", "سوق", "حديقة", "ملعب", "مسبح",
    "كمبيوتر", "هاتف", "شاشة", "لوحة", "قلم", "ورقة", "مكتب", "كرسي", "ساعة", "نظارة"
];
let usedWords = JSON.parse(localStorage.getItem('usedWords')) || [];
let secretWord = getRandomWord();
const wordLength = secretWord.length;
let attempts = 6;
let currentAttempt = 0;

// إنشاء الشبكة
const wordGrid = document.getElementById('word-grid');
const keyboard = document.getElementById('keyboard');
const message = document.getElementById('message');
const checkButton = document.getElementById('check-button');
const resultScreen = document.getElementById('result-screen');
const resultMessage = document.getElementById('result-message');
const nextButton = document.getElementById('next-button');
const homeButton = document.getElementById('home-button');

// اختيار كلمة عشوائية
function getRandomWord() {
    const availableWords = words.filter(word => !usedWords.includes(word));
    if (availableWords.length === 0) {
        alert("لقد لعبت كل الكلمات!");
        return words[0]; // إرجاع كلمة افتراضية إذا انتهت الكلمات
    }
    const randomWord = availableWords[Math.floor(Math.random() * availableWords.length)];
    usedWords.push(randomWord);
    localStorage.setItem('usedWords', JSON.stringify(usedWords));
    return randomWord;
}

// إنشاء خانات الكلمات بناءً على عدد حروف الكلمة
function createGrid() {
    wordGrid.innerHTML = '';
    wordGrid.style.gridTemplateColumns = `repeat(${wordLength}, 60px)`; // عدد الخانات حسب عدد الحروف
    for (let i = 0; i < attempts; i++) {
        for (let j = 0; j < wordLength; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            wordGrid.appendChild(cell);
        }
    }
}

// إنشاء الكيبورد الجديد
function createKeyboard() {
    keyboard.innerHTML = '';
    const keys = [
        ['ذ', 'ض', 'ص', 'ق', 'ف', 'غ', 'ع', 'ه', 'خ', 'ح', 'ج', 'د'],
        ['ش', 'س', 'ي', 'ب', 'ل', 'ا', 'ت', 'ن', 'م', 'ك', 'ط'],
        ['ئ', 'ء', 'ؤ', 'ر', 'لا', 'ى', 'ة', 'و', 'ز', 'ظ', '⌫']
    ];

    keys.forEach(row => {
        const rowElement = document.createElement('div');
        rowElement.classList.add('row');
        row.forEach(key => {
            const keyElement = document.createElement('div');
            keyElement.classList.add('key');
            keyElement.textContent = key;
            keyElement.setAttribute('data-key', key);
            if (key === '⌫') {
                keyElement.classList.add('backspace');
                keyElement.addEventListener('click', deleteLastLetter);
            } else {
                keyElement.addEventListener('click', () => handleKeyPress(key));
            }
            rowElement.appendChild(keyElement);
        });
        keyboard.appendChild(rowElement);
    });
}

// التعامل مع الضغط على الحروف
function handleKeyPress(key) {
    const cells = document.querySelectorAll('.cell');
    const startIndex = currentAttempt * wordLength;
    const endIndex = startIndex + wordLength;

    for (let i = startIndex; i < endIndex; i++) {
        if (!cells[i].textContent) {
            cells[i].textContent = key;
            break;
        }
    }

    // تفعيل تأثير الضغط على الزر
    const keyElement = document.querySelector(`.key[data-key='${key}']`);
    keyElement.classList.add('active');

    // تفعيل تأثير الألوان الدائرية
    const layers = getLayers(keyElement);
    let totalDelay = 0;

    layers.forEach((layer, layerIndex) => {
        layer.forEach((k, keyIndex) => {
            setTimeout(() => {
                k.classList.add('color-effect');
            }, (layerIndex * 50) + (keyIndex * 10)); // تأخير بين الطبقات والحروف
        });

        // حساب المدة الكلية للتأثير
        totalDelay = (layerIndex * 50) + (layer.length * 10);
    });

    // إزالة التأثيرات بعد انتهاء الانتشار
    setTimeout(() => {
        keyElement.classList.remove('active');
        layers.forEach(layer => {
            layer.forEach(k => {
                k.classList.remove('color-effect');
            });
        });
    }, totalDelay);
}

// دالة للحصول على الطبقات الدائرية
function getLayers(startKey) {
    const keyboard = document.getElementById('keyboard');
    const keysArray = Array.from(keyboard.querySelectorAll('.key'));
    const startIndex = keysArray.indexOf(startKey);
    const layers = [];

    // إحداثيات الحروف في الـ grid
    const gridSize = 10; // عدد الأعمدة
    const rows = Math.ceil(keysArray.length / gridSize);

    // تحويل الفهرس إلى إحداثيات (x, y)
    const startX = startIndex % gridSize;
    const startY = Math.floor(startIndex / gridSize);

    // تحديد الطبقات الدائرية
    for (let radius = 1; radius <= Math.max(gridSize, rows); radius++) {
        const layer = [];
        for (let x = startX - radius; x <= startX + radius; x++) {
            for (let y = startY - radius; y <= startY + radius; y++) {
                if (Math.abs(x - startX) === radius || Math.abs(y - startY) === radius) {
                    const index = y * gridSize + x;
                    if (index >= 0 && index < keysArray.length) {
                        layer.push(keysArray[index]);
                    }
                }
            }
        }
        if (layer.length > 0) {
            layers.push(layer);
        }
    }

    return layers;
}

// مسح آخر حرف
function deleteLastLetter() {
    const cells = document.querySelectorAll('.cell');
    const startIndex = currentAttempt * wordLength;
    const endIndex = startIndex + wordLength;

    for (let i = endIndex - 1; i >= startIndex; i--) {
        if (cells[i].textContent) {
            cells[i].textContent = '';
            break;
        }
    }
}

// التحقق من الكلمة المدخلة
function checkWord() {
    const cells = document.querySelectorAll('.cell');
    const startIndex = currentAttempt * wordLength;
    const endIndex = startIndex + wordLength;
    const guessedWord = Array.from(cells).slice(startIndex, endIndex).map(cell => cell.textContent).join('');

    if (guessedWord.length === wordLength) {
        for (let i = 0; i < wordLength; i++) {
            const cell = cells[startIndex + i];
            const key = document.querySelector(`.key[data-key='${guessedWord[i]}']`);

            if (guessedWord[i] === secretWord[i]) {
                cell.classList.add('correct');
                key.classList.add('correct');
            } else if (secretWord.includes(guessedWord[i])) {
                cell.classList.add('present');
                key.classList.add('present');
            } else {
                cell.classList.add('absent');
                key.classList.add('absent');
            }
        }

        if (guessedWord === secretWord) {
            showResult("مبروك! انت فزت!", "#6aaa64");
        } else {
            currentAttempt++;
            if (currentAttempt === attempts) {
                showResult(`للأسف! الكلمة الصحيحة كانت: ${secretWord}`, "#ff4d4d");
            }
        }
    }
}

// عرض شاشة النتيجة
function showResult(msg, color) {
    resultMessage.textContent = msg;
    resultMessage.style.color = color;
    resultScreen.classList.remove('hidden');
}

// إعادة تعيين اللعبة
function resetGame() {
    secretWord = getRandomWord();
    currentAttempt = 0;
    createGrid();
    createKeyboard();
    resultScreen.classList.add('hidden');
}

// العودة للصفحة الرئيسية
function goHome() {
    window.location.href = "index.html"; // يمكنك تغيير هذا ليناسب الصفحة الرئيسية
}

// بدء اللعبة
createGrid();
createKeyboard();

// إضافة أحداث للأزرار
checkButton.addEventListener('click', checkWord);
nextButton.addEventListener('click', resetGame);
homeButton.addEventListener('click', goHome);
