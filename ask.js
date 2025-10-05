// ملف: api/ask.js
// هذا الملف سيعمل على خوادم Vercel (Serverless Function)

const { GoogleGenAI } = require('@google/genai');

// الدالة الرئيسية التي تستجيب لطلبات موقعك
module.exports = async (req, res) => {
    // 1. يجب أن نرسل هنا رأس HTTP (Header) للسماح بالوصول من موقعك (CORS)
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Content-Type', 'application/json');

    // 2. التحقق من أن المفتاح السري موجود (يتم جلبه من إعدادات Vercel)
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        // رسالة تنبيه إذا لم يتم وضع المفتاح في إعدادات Vercel
        return res.status(500).json({ error: 'خطأ داخلي: المفتاح الأمني غير موجود. الرجاء وضعه كمتغير بيئي في Vercel.' });
    }
    
    // 3. التحقق من طريقة الطلب (يجب أن تكون POST)
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'عذراً، يجب أن يكون الطلب POST.' });
    }
    
    let ai;
    try {
        ai = new GoogleGenAI(apiKey);
    } catch (e) {
        return res.status(500).json({ error: 'خطأ في تهيئة الذكاء الاصطناعي.' });
    }

    try {
        // استقبال السؤال المرسل من الواجهة الأمامية (Frontend)
        const userQuestion = req.body.question;
        if (!userQuestion) {
            return res.status(400).json({ error: 'الرجاء إرسال سؤال صالح.' });
        }

        // 4. هندسة الأوامر (البرومبت) لضمان الإجابة بصفتك أنت!
        const prompt = `أنت خبير أمن سيبراني وهكر أخلاقي ومطور محترف واسمك محمد. مهمتك هي الإجابة بدقة وبعمق وبأسلوب عربي محترف على الأسئلة التقنية والأمنية. سؤال المستخدم: ${userQuestion}`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        // 5. إرسال الإجابة إلى المتصفح
        res.status(200).json({ answer: response.text });

    } catch (error) {
        console.error('Gemini Error:', error);
        res.status(500).json({ error: 'عذراً، حدث خطأ أثناء التواصل مع الذكاء الاصطناعي. قد تكون المشكلة في المفتاح أو الخدمة.' });
    }
};
