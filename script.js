// تهيئة Canvas باستخدام Fabric.js
const canvas = new fabric.Canvas('canvas', {
    width: 600,
    height: 400,
    backgroundColor: '#ffffff',
});

// عناصر التحكم
const inputText = document.getElementById('inputText');
const fontSize = document.getElementById('fontSize');
const rotation = document.getElementById('rotation');
const textColor = document.getElementById('textColor');
const bgColor = document.getElementById('bgColor');
const shadowColor = document.getElementById('shadowColor');
const shadowBlur = document.getElementById('shadowBlur');
const letterSpacing = document.getElementById('letterSpacing');
const textAlign = document.getElementById('textAlign');
const fontFamily = document.getElementById('fontFamily');
const bgImage = document.getElementById('bgImage');

// تحديث النص
function updateText() {
    const text = new fabric.Text(inputText.value, {
        left: 100,
        top: 100,
        fontSize: parseInt(fontSize.value),
        fill: textColor.value,
        angle: parseInt(rotation.value),
        shadow: new fabric.Shadow({
            color: shadowColor.value,
            blur: parseInt(shadowBlur.value),
            offsetX: 5,
            offsetY: 5,
        }),
        charSpacing: parseInt(letterSpacing.value),
        textAlign: textAlign.value,
        fontFamily: fontFamily.value,
    });
    canvas.clear();
    canvas.add(text);
    canvas.setBackgroundColor(bgColor.value, canvas.renderAll.bind(canvas));
}

// إضافة أشكال
function addShape(shape) {
    let newShape;
    if (shape === 'circle') {
        newShape = new fabric.Circle({
            radius: 50,
            fill: '#ff0000',
            left: 100,
            top: 100,
        });
    } else if (shape === 'rect') {
        newShape = new fabric.Rect({
            width: 100,
            height: 100,
            fill: '#00ff00',
            left: 100,
            top: 100,
        });
    }
    canvas.add(newShape);
}

// تحميل خلفية مخصصة
bgImage.addEventListener('change', function (e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = function (f) {
        const imgObj = new Image();
        imgObj.src = f.target.result;
        imgObj.onload = function () {
            const img = new fabric.Image(imgObj);
            img.scaleToWidth(600);
            img.scaleToHeight(400);
            canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
        };
    };
    reader.readAsDataURL(file);
});

// حفظ النص كصورة
function downloadAsImage() {
    html2canvas(document.querySelector("#canvas-container")).then(canvas => {
        const link = document.createElement('a');
        link.download = 'text-image.png';
        link.href = canvas.toDataURL();
        link.click();
    });
}

// حفظ النص كـ PDF
function downloadAsPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text(inputText.value, 10, 10);
    doc.save('text.pdf');
}

// تفاعل عناصر التحكم
fontSize.addEventListener('input', updateText);
rotation.addEventListener('input', updateText);
textColor.addEventListener('input', updateText);
bgColor.addEventListener('input', updateText);
shadowColor.addEventListener('input', updateText);
shadowBlur.addEventListener('input', updateText);
letterSpacing.addEventListener('input', updateText);
textAlign.addEventListener('change', updateText);
fontFamily.addEventListener('change', updateText);
