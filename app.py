import os
from flask import Flask, render_template, request, redirect, url_for, flash

# Абсолютные пути к ПРОЕКТИРОВАНИЕ BIMу
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
TEMPLATES_DIR = os.path.join(BASE_DIR, 'templates')
STATIC_DIR = os.path.join(BASE_DIR, 'static')

# Явно задаём папки шаблонов и статики
app = Flask(__name__, template_folder=TEMPLATES_DIR, static_folder=STATIC_DIR)
app.config['TEMPLATES_AUTO_RELOAD'] = True  # удобная автоперезагрузка шаблонов в разработке
app.secret_key = 'your_secret_key_here'  # Для flash-сообщений (замени на случайную строку, e.g., os.urandom(24))

# Единственный маршрут: главная страница
@app.route('/')
def main_home():
    return render_template('main_index.html')

# Новый маршрут: обработка формы обратной связи (POST)
@app.route('/feedback', methods=['POST'])
def feedback():
    if request.method == 'POST':
        name = request.form.get('name', '').strip()
        phone = request.form.get('phone', '').strip()
        email = request.form.get('email', '').strip()
        message = request.form.get('message', '').strip()
        
        # Базовая валидация: все поля заполнены
        if not all([name, phone, email, message]):
            flash('Заполните все поля!', 'error')  # Ошибка (покажи в шаблоне)
            return redirect(url_for('main_home'))
        
        # Здесь обработка: сохрани в файл/БД/email (пока в консоль для теста)
        print(f"Новое сообщение: Имя={name}, Телефон={phone}, Email={email}, Сообщение={message}")
        flash('Спасибо! Ваше сообщение отправлено.', 'success')  # Успех
        return redirect(url_for('main_home'))

if __name__ == '__main__':
    # На проде debug=False; порт/хост можно оставить как есть для разработки
    app.run(debug=True, host='0.0.0.0', port=5002)
