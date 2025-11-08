# 💬 QChat  
یک اپلیکیشن چت زنده ساخته‌شده با **React** و **Django Channels**

---

## 🧩 معرفی پروژه  

**QChat** یک اپلیکیشن چت زنده است که برای تمرین و یادگیری مفاهیم ارتباط بلادرنگ (Real-time Communication) ساخته شده.  
در این پروژه کاربران می‌توانند به‌صورت خصوصی با هم چت کنند یا در گروه‌های عمومی پیام بفرستند.  
همچنین وضعیت آنلاین یا آفلاین بودن کاربران در لحظه قابل مشاهده است.

---

## 🚀 دمو آنلاین  
پروژه هم‌اکنون در حال اجراست و از طریق لینک زیر قابل مشاهده است:  
👉 [https://chat.farzin.pro](https://chat.farzin.pro)

---

## ⚙️ ویژگی‌ها  

- 💬 چت خصوصی (Private Chat) بین کاربران  
- 👥 چت گروهی در اتاق‌های عمومی  
- 🟢 نمایش وضعیت آنلاین و آفلاین بودن کاربران  
- 🔒 سیستم احراز هویت کاربران  
- ⚡ ارتباط بلادرنگ با استفاده از **WebSocket**  
- 🧠 طراحی مدرن و رابط کاربری ساده با **React**

---

## 🛠 تکنولوژی‌های استفاده‌شده  

| بخش | تکنولوژی‌ها |
|------|--------------|
| **Backend** | Python, Django, Django REST Framework, Django Channels |
| **Frontend** | React, JavaScript |
| **ارتباط Real-time** | WebSocket |

---

## 🧾 نصب و اجرا (محلی)  

### 🖥 پیش‌نیازها  
برای اجرای پروژه به موارد زیر نیاز دارید:  
- Python 3.12+  
- Node.js و npm  
- Redis (برای مدیریت کانال‌ها در Django Channels)

---

### ⚙️ مراحل راه‌اندازی Backend  

```bash
# کلون کردن پروژه
git clone https://github.com/yourusername/QChat.git
cd QChat/backend

# ساخت محیط مجازی
python -m venv venv
source venv/bin/activate  # در ویندوز: venv\Scripts\activate

# نصب وابستگی‌ها
pip install -r requirements.txt

# انجام مایگریشن‌ها
python manage.py migrate

# اجرای سرور
python manage.py runserver
