/**
 * =======================================================
 * ملف JavaScript الرئيسي والنهائي (main-script.js)
 * الوظيفة: التحصين الأمني، تفعيل واجهة المستخدم، والإرسال المحلي الفعال (محاكاة).
 * =======================================================
 */

// 1. دالة لتحصين مدخلات المستخدم ومنع هجمات XSS
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
    
    // أ. وظائف عامة (السنة وقائمة التنقل)
    const currentYear = new Date().getFullYear();
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = currentYear;
    }
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
        });
    }
    
    // ب. تحديث النصائح الأمنية 
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

    // ج. التحصين والإرسال المحلي لنموذج الاتصال (استعادة الوظيفة القديمة)
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        const emailInput = document.getElementById('email');
        const emailError = document.getElementById('email-error');
        const submitButton = contactForm.querySelector('.submit-button');

        let isSubmitting = false;

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
            if (isSubmitting) return; 

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
            
            // محاكاة عملية الإرسال التي كانت تعمل لديك (Simulated Success)
            setTimeout(() => {
                // هنا يتم تحصين المدخلات فقط، دون إرسالها فعلياً عبر شبكة
                const formData = new FormData(contactForm);
                const name = sanitizeInput(formData.get('name'));

                // تم التوجيه إلى صفحة الشكر الجاهزة لديك
                window.location.href = 'شكراً.html'; 

            }, 1000); // تأخير بسيط لمحاكاة الإرسال
        });
    }
});
