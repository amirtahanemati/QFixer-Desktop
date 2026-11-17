# نرمافزار QFixer Desktop (کیوفیکسر دسکتاپ)

[![Platform](https://img.shields.io/badge/Platform-Windows%2010%20%7C%2011-blue.svg)](https://microsoft.com)
[![Framework](https://img.shields.io/badge/Framework-Tauri%202.0-orange.svg)](https://tauri.app)
[![Frontend](https://img.shields.io/badge/Frontend-React%2018%20%7C%20TypeScript-61dafb.svg)](https://react.dev)
[![Engine](https://img.shields.io/badge/Engine-Python%20CV%20Worker-yellow.svg)](https://python.org)
[![License](https://img.shields.io/badge/License-Proprietary-green.svg)](#)

> **QFixer Desktop** یک نرمافزار تخصصی، حرفهای، سریع و کاملاً آفلاین جهت پاکسازی، بهبود کیفیت و بازسازی تصاویر آموزشی (سؤالات امتحانی، کنکور، کتابها، جزوات، نمودارهای علمی و فرمولها) با حفظ قطعی محتوای علمی و ساختار بصری است.

---

## 🎯 مأموریت و فلسفه طراحی

**اصل حیاتی پروژه: حفظ محتوای اصلی تصویر همواره مهمتر از میزان پاکسازی است.**

در پردازش تصاویر آموزشی، کوچکترین دگرگونی در حروف، اعداد، علائم ریاضی، توانها، اندیسها، محورهای مختصات یا خطوط هندسی ممکن است مفهوم علمی سؤال را مخدوش کند. QFixer با بهرهگیری از یک موتور چندمرحلهای و ایجاد ماسکهای محافظتی (Protection Masks)، خطوط و متن را ایمن نگه داشته و سایهها، نویزها، لکهها و واترمارکها را پاکسازی میکند.

---

## 🚀 ویژگیهای کلیدی

- **کاملاً آفلاین و امن:** هیچ دادهای به سرورهای ابری ارسال نمیشود و تمام فرآیندهای تحلیل و پردازش روی پردازنده و کارت گرافیک محلی سیستم اجرا میشوند.
- **رابط کاربری پیشفرض فارسی (RTL):** طراحی ارگونومیک، مدرن و مینیمال با پشتیبانی استاندارد از زبان فارسی، فونت محلی خوانا (وزیرمتن) و تمهای تیره و روشن.
- **معماری ماژولار سه‌لایه:**
  - **رابط کاربری (React + Vite + TypeScript + Tailwind + shadcn/ui)**
  - **هسته دسکتاپ بومی (Rust + Tauri 2 IPC)**
  - **موتور پردازش تصویر و هوش مصنوعی (Python + OpenCV + NumPy + SciPy + ONNX Runtime)**
- **پروتکل ارتباطی امن و نسخهدار (IPC):** تبادل دادهها از طریق پیامهای ساختاریافته بدون سربار Base64 برای فایلهای حجیم.
- **سیستم ماسک چندگانه:** ماسک حذف (Removal)، ماسک حفاظت (Protection) و ماسک بازسازی (Reconstruction).
- **مدیریت هوشمند سختافزار:** انتخاب خودکار یا دستی پردازشگر با پشتیبانی از شتابدهندههای گرافیکی (NVIDIA CUDA / DirectML) و قابلیت جایگزین روی CPU و پردازش کاشیکاریشده (Tiled Processing).

---

## 🛠 پشته فناوری (Tech Stack)

| لایه | فناوریها |
|---|---|
| **پوسته دسکتاپ** | Tauri 2.x, Rust 1.80+ |
| **فرانت‌اند** | React 18/19, TypeScript 5.x, Vite, Tailwind CSS |
| **مدیریت وضعیت و فرم** | Zustand, Zod |
| **چندزبانه (i18n)** | i18next, react-i18next (fa-IR, en-US) |
| **موتور پردازش تصویر** | Python 3.11+, OpenCV 4.x, NumPy, Pillow, scikit-image |
| **هوش مصنوعی و یادگیری ماشین** | ONNX Runtime, PyTorch (Optional) |
| **پایگاه داده محلی** | SQLite 3 |
| **محیط تست** | Vitest, Pytest, Cargo Test |

---

## 📁 ساختار مخزن پروژه

```text
qfixer-desktop/
├── apps/
│   └── desktop/                 # پوسته دسکتاپ Tauri و رابط کاربری React
│       ├── src/                 # کدهای فرانت‌اند (کامپوننتها، صفحات، هوکها، استورها)
│       └── src-tauri/           # هسته بومی Rust و تنظیمات امنیتی Tauri 2
├── engines/
│   └── image-engine/            # موتور محاسباتی پایتون و الگوریتمهای CV
├── packages/
│   └── shared-contracts/        # پروتکل مشترک ارتباطی IPC و اسکیمای پیامها
├── models/                      # رجیستری و تعاریف مدلهای محلی
├── docs/                        # مستندات جامع معماری، امنیت و راهنماها
├── scripts/                     # اسکریپتهای بیلد، تست و بسته‌بندی
└── tests/                       # آزمونهای یکپارچگی سیستمی
```

---

## ⚙️ پیش‌نیازها و راه‌اندازی محیط توسعه

### ابزارهای لازم:
1. **Node.js**: نسخه 20 به بالا (همراه با `pnpm` یا `npm`)
2. **Rust & Cargo**: ابزار رسمی Rustup (تارگت MSVC یا GNU)
3. **Python**: نسخه 3.10 تا 3.13 همراه با `pip`
4. **WebView2 Runtime**: معمولاً روی ویندوز 10 و 11 به صورت پیش‌فرض نصب است.

### مراحل نصب و آماده‌سازی:

```bash
# ۱. دریافت کد منبع و جابجایی به شاخه توسعه
git clone https://github.com/organization/qfixer-desktop.git
cd qfixer-desktop
git checkout dev

# ۲. نصب وابستگی‌های فرانت‌اند
cd apps/desktop
pnpm install

# ۳. راه‌اندازی محیط مجازی پایتون و وابستگی‌های موتور تصویر
cd ../../engines/image-engine
python -m venv .venv
.venv\Scripts\activate
pip install -e .

# ۴. اجرای برنامه در حالت توسعه (Dev Mode)
cd ../../apps/desktop
pnpm tauri dev
```

---

## 🧪 اجرای تست‌ها

```bash
# تست فرانت‌اند
cd apps/desktop
pnpm test

# تست هسته Rust
cd apps/desktop/src-tauri
cargo test

# تست موتور پایتون
cd engines/image-engine
pytest
```

---

## 📄 مستندات تکمیلی

- [معماری کلان نرمافزار](docs/architecture.md)
- [پروتکل ارتباطی IPC](docs/ipc-protocol.md)
- [پایپ‌لاین پردازش تصویر](docs/image-pipeline.md)
- [مدیریت مدل‌های محلی](docs/model-management.md)
- [خط‌مشی امنیت](docs/security.md)
- [راهنمای آزمون‌ها](docs/testing.md)
- [راهنمای بسته‌بندی برای ویندوز](docs/packaging.md)

---

## 📜 مشارکت و قوانین

لطفاً پیش از ارسال تغییرات، راهنمای [CONTRIBUTING.md](CONTRIBUTING.md) و توافقنامه سبک کدنویسی را مطالعه نمایید.
تمامی گزارش‌های آسیب‌پذیری و مسائل امنیتی طبق [SECURITY.md](SECURITY.md) پیگیری می‌شوند.
