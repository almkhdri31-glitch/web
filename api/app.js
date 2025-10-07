// في ملف app.js

// تحديد العناصر الأساسية في الصفحة
const statusOutput = document.getElementById('statusOutput');
const fileInput = document.getElementById('fileInput');
const originalCanvas = document.getElementById('originalCanvas');
const processButton = document.getElementById('processButton');
const outputCanvas = document.getElementById('outputCanvas');

// ----------------------------------------------------
// 1. وظيفة التأكد من جاهزية OpenCV
// يتم استدعاء هذه الوظيفة عند تحميل ملف opencv.js (انظر index.html)
// ----------------------------------------------------
function onOpenCvReady() {
    // التحقق من أن الكائن cv متاح، وهو كائن المكتبة الرئيسي
    if (typeof cv !== 'undefined' && cv.Mat) {
        statusOutput.innerText = 'أدوات المعالجة جاهزة ✅. قم بتحميل الصورة.';
        processButton.disabled = false; // تفعيل زر المعالجة
        console.log('OpenCV.js جاهز للاستخدام.');
    } else {
        statusOutput.innerText = '⚠️ حدث خطأ في تحميل أدوات المعالجة.';
    }
}

// ----------------------------------------------------
// 2. وظيفة قراءة الصورة وعرضها في Canvas
// ----------------------------------------------------
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            // ضبط حجم عنصر الـ Canvas ليتناسب مع الصورة
            originalCanvas.width = img.width;
            originalCanvas.height = img.height;
            outputCanvas.width = img.width;
            outputCanvas.height = img.height;

            // رسم الصورة في الـ Canvas (لتقرأها OpenCV لاحقاً)
            const ctx = originalCanvas.getContext('2d');
            ctx.drawImage(img, 0, 0, img.width, img.height);
            
            statusOutput.innerText = 'تم تحميل الصورة بنجاح. اضغط على "تنقية".';
        };
        img.src = event.target.result;
    };

    reader.readAsDataURL(file);
});

// ----------------------------------------------------
// 3. دالة المعالجة الرئيسية (سيكون هذا هو قلب عمل OpenCV)
// ----------------------------------------------------
processButton.addEventListener('click', () => {
    if (!originalCanvas.getContext('2d')) {
        alert("الرجاء تحميل صورة أولاً.");
        return;
    }
    
    statusOutput.innerText = 'جاري المعالجة... يرجى الانتظار.';
    
    // ****** هنا سيتم وضع كود OpenCV.js المتقدم *****
    // وظائف (Perspective Correction), (Shadow Removal), (Binarization)
    
    // حالياً، سنقوم بنسخ الصورة الأصلية فقط لإظهار أن الكود يعمل
    const src = cv.imread(originalCanvas);
    const dst = src.clone(); // إنشاء نسخة طبق الأصل

    // عرض النتيجة في outputCanvas
    cv.imshow(outputCanvas, dst);
    
    // تنظيف الذاكرة (مهم جداً عند استخدام OpenCV)
    src.delete();
    dst.delete();

    statusOutput.innerText = 'تمت المعالجة (تجريبي).';
    document.getElementById('downloadButton').disabled = false;
});

// ----------------------------------------------------
// 4. دالة التنزيل (سنفعلها لاحقاً لإنشاء PDF)
// ----------------------------------------------------
document.getElementById('downloadButton').addEventListener('click', () => {
    alert("وظيفة التنزيل إلى PDF سيتم تطويرها لاحقاً!");
});
