/**
 * =======================================================
 * ملف JavaScript الرئيسي والمحصَّن (main-script.js)
 * المحتوى: وظائف الأمن، التفاعل، وتحديث التاريخ
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
    
    // ج. تحديث النصائح الأمنية (لصفحة index.html)
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

    // د. التحصين الفعلي لنموذج الاتصال (Contact Form Logic)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');
        const emailError = document.getElementById('email-error');
        const submitButton = contactForm.querySelector('.submit-button');

        let isSubmitting = false;

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); 

            if (isSubmitting) {
                return; 
            }

            if (!validateEmail(emailInput.value)) {
                if (emailError) emailError.style.display = 'block';
                return;
            } else {
                if (emailError) emailError.style.display = 'none';
            }

            isSubmitting = true;
            submitButton.disabled = true;
            submitButton.textContent = 'جاري الإرسال...';
            
            // التنظيف والتحصين الأمني للمدخلات
            const formPayload = {
                name: sanitizeInput(nameInput.value),
                email: emailInput.value, 
                message: sanitizeInput(messageInput.value)
            };

            // محاكاة عملية الإرسال:
            // في مشروع حقيقي، سيتم إرسال formPayload إلى خادم باستخدام Fetch API أو XMLHttpRequest
            setTimeout(() => {
                // بدلاً من التنبيه، سيتم توجيه المستخدم لصفحة الشكر
                // alert(`تم إرسال رسالتك بنجاح يا ${formPayload.name}! شكراً لتواصلك.`);
                
                // توجيه لصفحة الشكر (شكراً.html)
                window.location.href = 'شكراً.html';

                // لا حاجة لـ contactForm.reset() لأننا سننتقل لصفحة أخرى
            }, 1500); 
        });
    }

    // هنا يمكنك إضافة محتوى ملفات ask.js و js_cv-script.js
    // مثال:
    // if (document.body.classList.contains('ask-page')) {
    //     // كود ask.js
    // }
    // if (document.body.classList.contains('cv-page')) {
    //     // كود js_cv-script.js
    // }

});
