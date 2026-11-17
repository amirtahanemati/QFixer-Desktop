# سند معماری کلان نرم‌افزار QFixer Desktop

## ۱. مقدمه و اهداف
نرم‌افزار QFixer Desktop بر پایه معماری سه لایه تفکیک‌شده (Decoupled 3-Tier Architecture) طراحی شده است تا ضمن حفظ بیشترین سرعت پردازش، پایداری حافظه و بالاترین ضریب امنیت و حریم خصوصی را برای کاربران ویندوز فراهم آورد.

```
+--------------------------------------------------------------------+
|                  Frontend Layer (React + Vite + TS)                |
|  - Workspace UI / Viewport         - Toolbars & Mask Editor        |
|  - Zustand Stores & i18n           - Comparison (Slider/Side-by)   |
+--------------------------------------------------------------------+
                                  |
                                  | Tauri IPC (Typed Commands / Events)
                                  v
+--------------------------------------------------------------------+
|                   Desktop Core (Rust / Tauri 2)                    |
|  - Lifecycle & Window Manager      - File & Path Validation        |
|  - Process Supervisor / Watchdog   - Local SQLite State Engine     |
+--------------------------------------------------------------------+
                                  |
                                  | Versioned Stdio IPC (JSON Lines + Temp Files)
                                  v
+--------------------------------------------------------------------+
|             Engine Layer (Python CV & AI Worker Process)           |
|  - Content & Feature Detection     - Protection Mask Generator     |
|  - Classical CV & Morph Filters    - ONNX Runtime Inference        |
|  - Non-destructive Pipeline        - Quality Metrics Evaluator     |
+--------------------------------------------------------------------+
```

## ۲. تفکیک وظایف (Separation of Concerns)

### ۲.۱. لایه رابط کاربری (Frontend / React)
- پیاده‌سازی شده با React 18/19 و TypeScript در ساختار ماژولار مبتنی بر قابلیت‌ها (Feature-driven).
- عدم اجرای مستقیم توابع سیستمی یا اجرای مستقیم پایتون؛ تمام درخواست‌ها از طریق رابط‌های تایپ‌شده به هسته Rust فرستاده می‌شوند.
- پشتیبانی کامل از RTL و رابط کاربری فارسی به عنوان زبان پیش‌فرض و استفاده از CSS Logical Properties.

### ۲.۲. لایه هسته دسکتاپ بومی (Rust Core)
- مدیریت چرخه حیات فرآیند Worker پایتون (راه‌اندازی، پایش سلامت با Ping/Pong، تشخیص قفل شدن یا Crash و بازیابی خودکار).
- کنترل سطح دسترسی و اعتبارسنجی قطعی مسیرهای فایل، پوشه‌های موقت و خروجی‌ها.
- میزبانی پایگاه داده سبک SQLite برای ذخیره متادیتای پروژه‌ها، گره‌های تاریخچه و تنظیمات کاربر.
- ارسال پیام‌های پیشرفت پردازش (Progress) و لغو درخواست‌ها (Cancel) بدون مسدود شدن نخ اصلی رابط کاربری.

### ۲.۳. لایه موتور پردازش تصویر (Python Worker)
- اجرا به عنوان یک پروسه مستقل تحت نظارت Rust.
- بهره‌مندی از OpenCV، NumPy، Pillow و scikit-image برای پردازش‌های کلاسیک و فیلترهای محلی.
- استراتژی دو مرحله‌ای: ابتدا تحلیل محتوا (تشخیص متن، فرمول، خطوط نمودار و ایجاد Protection Mask) و سپس اعمال فیلترهای نویزگیری و تصحیح سایه با اعمال ماسک حفاظتی.
- بهره‌گیری اختیاری از ONNX Runtime برای شتاب‌دهی پردازش با GPU بدون نیاز به بسته‌های سنگین چند گیگابایتی.
