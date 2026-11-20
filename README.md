# Saman Premium 🌙

یک اپلیکیشن PWA موبایل‌فرست، فوق‌العاده شیک، خصوصی و مینیمال برای ترکینگ چرخه ماهانه و تعامل دونفره، ساخته‌شده با **Next.js (App Router)**، **TypeScript**، **Tailwind CSS**، **Lucide React** و **Supabase**.

---

## 💎 ساختار پروژه و ویژگی‌های پیاده‌سازی‌شده در این فاز

1. **تنظیمات کامل PWA و موبایل‌فرست:**
   - فایل `public/manifest.json` با قابلیت اجرای مستقل (`standalone`)، تم تیره لوکس (`#0c0a0f`) و آیکون‌های وکتور و استاندارد.
   - متاتگ‌های پیشرفته Apple (`apple-mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style`) و `viewport-fit=cover` برای پشتیبانی بی‌نقص از تمام‌صفحه و بریدگی ناچ (Notch) در iOS و Android.

2. **اتصال پایگاه داده و RLS در Supabase (`schema.sql`):**
   - ایجاد جدول `profiles` شامل فیلدهای `id`, `email`, `role`, `name`, `created_at`, `updated_at`.
   - فعال‌سازی **Row Level Security (RLS)** و پالیسی‌های دسترسی امن برای خواندن و ویرایش پروفایل‌ها.
   - تریگر خودکار `on_auth_user_created` جهت ثبت و همگام‌سازی سریع پروفایل هنگام احراز هویت.

3. **سیستم احراز هویت بسته (Closed Whitelist Auth):**
   - تعیین دقیق ایمیل‌های مجاز در `.env.local` با متغیرهای `ALLOWED_EMAIL_HER` و `ALLOWED_EMAIL_HIM`.
   - مقایسه دقیق و مستقل از حروف بزرگ و کوچک (`toLowerCase()`) در کلاینت، سرور و Middleware.
   - رد بلافاصله هرگونه ایمیل غیرمجاز با پیام شفاف به زبان فارسی.

4. **دو داشبورد و شل ناوبری مجزا برای نقش‌های `her` و `him`:**
   - هدایت هوشمند و خودکار بر اساس نقش (`/dashboard/her` برای بانو و `/dashboard/him` برای آقا).
   - جلوگیری از دسترسی متقاطع به داشبورد طرف مقابل.
   - شل ناوبری شناور زیرین (Bottom Navigation) با ۵ بخش آماده برای توسعه فیچرهای آینده (خانه، چرخه ماهانه، مراقبت دونفره، ثبت روزانه، تنظیمات).

---

## 🚀 راهنمای راه‌اندازی و اجرا

### ۱. نصب وابستگی‌ها
در پوشه پروژه دستور زیر را اجرا کنید:
```bash
npm install
```

### ۲. تنظیم متغیرهای محیطی (`.env.local`)
فایل `.env.local` را باز کرده و اطلاعات پروژه Supabase و ایمیل‌های مد نظر خود را وارد کنید:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

ALLOWED_EMAIL_HER=her@example.com
ALLOWED_EMAIL_HIM=him@example.com

NEXT_PUBLIC_ALLOWED_EMAIL_HER=her@example.com
NEXT_PUBLIC_ALLOWED_EMAIL_HIM=him@example.com
```

### ۳. اجرای اسکریپت دیتابیس در Supabase
محتویات فایل `schema.sql` را در بخش **SQL Editor** پنل کاربری Supabase اجرا کنید.

### ۴. اجرای برنامه در حالت توسعه
```bash
npm run dev
```
برنامه روی آدرس `http://localhost:3000` آماده بهره‌برداری است.
