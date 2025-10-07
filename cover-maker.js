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

    // دالة لتحديث المعاينة بناءً على المدخلات
    function updateCanvas() {
        // تحديث النص ولونه وحجمه
        designText.textContent = coverText.value;
        designText.style.color = textColor.value;
        designText.style.fontSize = `${textSize.value}px`;
        
        // تحديث لون الخلفية
        designCanvas.style.backgroundColor = backgroundColor.value;
        
        // تحديث الأبعاد (المقاس)
        const selectedSize = sizeSelector.value.split('x');
        const width = selectedSize[0] + 'px';
        const height = selectedSize[1] + 'px';

        designCanvas.style.width = width;
        designCanvas.style.height = height;
        
        // (اختياري) تعديل عرض الحاوية الأبوية لتكون متجاوبة مع الحجم
        canvasContainer.style.width = '100%';
        canvasContainer.style.maxWidth = width;
    }

    // ربط الأحداث (Events) بعناصر التحكم
    coverText.addEventListener('input', updateCanvas);
    backgroundColor.addEventListener('input', updateCanvas);
    textColor.addEventListener('input', updateCanvas);
    textSize.addEventListener('input', updateCanvas);
    sizeSelector.addEventListener('change', updateCanvas);


    // دالة التنزيل (باستخدام مكتبة html2canvas)
    downloadBtn.addEventListener('click', () => {
        // إخفاء أي عناصر غير مرغوبة قبل التقاط الصورة (مثل إشعارات، حدود)
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
