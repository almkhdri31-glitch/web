/**
 * =======================================================
 * ملف JavaScript الرئيسي والمحصَّن (main-script.js)
 * المحتوى: وظائف الأمن، التفاعل، وتحديث التاريخ، وإرسال نموذج Web3Forms
 * =======================================================
 */

// 1. دالة لتنظيف مدخلات المستخدم ومنع هجمات XSS
const sanitizeInput = (text) => {
    if (!text) return '';
    // تحويل الرموز الخطيرة إلى ما يقابلها من كيانات HTML
    let sanitized = text.replace(/&/g, '&amp;')
                        .replace(/</g, '&lt;')
                        .replace(/>/g, '&gt;')
                        .replace(/"/g, '&quot;')
                        .replace(/'/g, '&#39;');
    return sanitized.trim();
};

// 2. دالة محسّنة للتحقق من صحة البريد الإلكتروني
const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(String(email).toLowerCase());
};

// 3. وظيفة تشغيلية عند تحميل الصفحة بالكامل
document.addEventListener('DOMContentLoaded', () => {
    
    // أ. تحديث سنة حقوق النشر (Footer)
    const currentYear = new Date().getFullYear();
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = currentYear;
    }

    // ب. تفعيل قائمة الجوال (Menu Toggle)
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
        });
    }
    
    // ج. تحديث النصائح الأمنية 
    const securityTips = [
        "استخدم المصادقة الثنائية (2FA) لكل حساباتك الهامة لزيادة الأمان.",
        "قم بتحديث نظام التشغيل والتطبيقات باستمرار لسد الثغرات الأمنية.",
        "استخدم مدير كلمات مرور لإنشاء وتخزين كلمات مرور قوية وفريدة.",
        "احذر من رسائل البريد الإلكتروني العشوائية (Phishing) ولا تضغط على روابط مشبوهة.",
        "قم بإجراء نسخ احتياطي لبياناتك بانتظام لتجنب فقدانها بسبب هجمات الفدية."
    ];

    const tipElement = document.getElementById('security-tip');
    if(tipElement) {
        const randomIndex = Math.floor(Math.random() * securityTips.length);
        tipElement.textContent = "نصيحة اليوم: " + securityTips[randomIndex];
    }

    // د. التحصين والإرسال الفعلي لنموذج الاتصال (Web3Forms Logic)
    const contactForm = document.getElementById('contact-form');
    // مفتاح الوصول العام لـ Web3Forms الذي تم استخلاصه من ملفاتك (الصورة المرفقة)
    const WEB3FORMS_ACCESS_KEY = "b2ed5633-7b5f-46c3-b087-5bb11a7da5a0"; 
    
    if (contactForm) {
        const emailInput = document.getElementById('email');
        const emailError = document.getElementById('email-error');
        const submitButton = contactForm.querySelector('.submit-button');

        let isSubmitting = false;

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault(); 

            if (isSubmitting) {
                return; 
            }
            
            // التحقق من صحة البريد الإلكتروني
            if (!validateEmail(emailInput.value)) {
                if (emailError) emailError.style.display = 'block';
                return;
            } else {
                if (emailError) emailError.style.display = 'none';
            }

            isSubmitting = true;
            submitButton.disabled = true;
            submitButton.textContent = 'جاري الإرسال...';
            
            // جمع البيانات وتحصينها
            const formData = new FormData(contactForm);
            const formPayload = {
                'access_key': WEB3FORMS_ACCESS_KEY,
                'name': sanitizeInput(formData.get('name')),
                'email': formData.get('email'), // البريد لا يحتاج تحصين ضد XSS هنا، بل تحقق
                'message': sanitizeInput(formData.get('message'))
            };

            try {
                const response = await fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(formPayload)
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    // التوجيه إلى صفحة الشكر بعد الإرسال الناجح
                    window.location.href = 'شكراً.html'; 
                } else {
                    // في حالة وجود خطأ في الإرسال
                    console.error("Web3Forms Error:", result);
                    alert("عذراً، حدث خطأ أثناء الإرسال. يرجى المحاولة لاحقاً.");
                    
                    // التوجيه لصفحة الخطأ التي لديك (error.html)
                    window.location.href = 'error.html'; 
                }
            } catch (error) {
                console.error("Network or API Error:", error);
                alert("عذراً، حدث خطأ في الاتصال بالشبكة. يرجى المحاولة لاحقاً.");
                window.location.href = 'error.html';
            } finally {
                // إعادة تهيئة الحالة إذا لم يحدث توجيه (للحماية من الأخطاء)
                isSubmitting = false;
                submitButton.disabled = false;
                submitButton.textContent = 'إرسال الرسالة';
            }
        });
    }

    // **********************************************
    // ملاحظة: هنا يمكنك إضافة كود ask.js و js_cv-script.js
    // **********************************************
});
