document.addEventListener('DOMContentLoaded', () => {
    // 1. تحديد العناصر الرئيسية في الصفحة
    const designCanvas = document.getElementById('designCanvas');
    const designText = document.getElementById('designText');
    const canvasContainer = document.getElementById('canvasContainer');
    const downloadBtn = document.getElementById('downloadBtn');

    // 2. تحديد عناصر التحكم (Inputs)
    const sizeSelector = document.getElementById('sizeSelector');
    const coverText = document.getElementById('coverText');
    const backgroundColor = document.getElementById('backgroundColor');
    const textColor = document.getElementById('textColor');
    const textSize = document.getElementById('textSize');
    
    // عناصر التحكم بالصورة
    const imageUpload = document.getElementById('imageUpload');
    const removeImageBtn = document.getElementById('removeImageBtn');
    
    // عنصر التحكم بالخطوط (الإضافة الجديدة)
    const fontSelector = document.getElementById('fontSelector');
    
    // دالة لتحديث المعاينة بناءً على المدخلات
    function updateCanvas() {
        // تحديث النص ولونه وحجمه
        designText.textContent = coverText.value;
        designText.style.color = textColor.value;
        designText.style.fontSize = `${textSize.value}px`;
        
        // تحديث نوع الخط
        designText.style.fontFamily = fontSelector.value;
        
        // تحديث لون الخلفية (إذا لم تكن هناك صورة خلفية)
        if (!designCanvas.style.backgroundImage || designCanvas.style.backgroundImage === 'none') {
            designCanvas.style.backgroundColor = backgroundColor.value;
        }
        
        // تحديث الأبعاد (المقاس)
        const selectedSize = sizeSelector.value.split('x');
        const width = selectedSize[0] + 'px';
        const height = selectedSize[1] + 'px';

        designCanvas.style.width = width;
        designCanvas.style.height = height;
        
        // تعديل عرض الحاوية الأبوية لتكون متجاوبة مع الحجم
        canvasContainer.style.width = '100%';
        canvasContainer.style.maxWidth = width;
    }

    // ربط الأحداث (Events) بعناصر التحكم
    coverText.addEventListener('input', updateCanvas);
    backgroundColor.addEventListener('input', updateCanvas);
    textColor.addEventListener('input', updateCanvas);
    textSize.addEventListener('input', updateCanvas);
    sizeSelector.addEventListener('change', updateCanvas);
    fontSelector.addEventListener('change', updateCanvas); // ربط حدث اختيار الخط

    // **********************************************
    // منطق التحكم بالصورة
    // **********************************************

    imageUpload.addEventListener('change', function(e) {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            
            reader.onload = function(event) {
                // ضبط الصورة المرفوعة كخلفية
                designCanvas.style.backgroundImage = `url(${event.target.result})`;
                designCanvas.style.backgroundSize = 'cover';
                designCanvas.style.backgroundPosition = 'center';
                
                // إظهار زر الإزالة
                removeImageBtn.style.display = 'block';
            };
            
            reader.readAsDataURL(e.target.files[0]);
        }
    });

    removeImageBtn.addEventListener('click', function() {
        // إزالة صورة الخلفية والعودة إلى اللون
        designCanvas.style.backgroundImage = 'none';
        designCanvas.style.backgroundColor = backgroundColor.value; // العودة للون المختار
        imageUpload.value = ''; // مسح الملف من حقل الرفع
        removeImageBtn.style.display = 'none';
        updateCanvas(); // تحديث إضافي للتأكد
    });
    
    // **********************************************
    // دالة التنزيل (باستخدام مكتبة html2canvas)
    // **********************************************

    downloadBtn.addEventListener('click', () => {
        downloadBtn.disabled = true;
        downloadBtn.textContent = 'جاري المعالجة...';

        html2canvas(designCanvas, { 
            scale: 2, // لضمان جودة عالية في الصورة الناتجة
            logging: false 
        }).then(canvas => {
            const imageURL = canvas.toDataURL("image/png");
            
            // إنشاء رابط تحميل وهمي
            const link = document.createElement('a');
            link.href = imageURL;
            link.download = 'Cover_Design_' + Date.now() + '.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            downloadBtn.disabled = false;
            downloadBtn.innerHTML = '<i class="fas fa-download me-2"></i> تنزيل الغلاف (PNG)';
        });
    });

    // تشغيل التحديث الأولي عند تحميل الصفحة
    updateCanvas();
});
