import os
from flask import Flask, render_template

# Абсолютные пути к проекту
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
TEMPLATES_DIR = os.path.join(BASE_DIR, 'templates')
STATIC_DIR = os.path.join(BASE_DIR, 'static')

# Явно задаём папки шаблонов и статики
app = Flask(__name__, template_folder=TEMPLATES_DIR, static_folder=STATIC_DIR)
app.config['TEMPLATES_AUTO_RELOAD'] = True  # удобная автоперезагрузка шаблонов в разработке

# Единственный маршрут: главная страница
@app.route('/')
def main_home():
    return render_template('main_index.html')

if __name__ == '__main__':
    # На проде debug=False; порт/хост можно оставить как есть для разработки
    app.run(debug=True, host='0.0.0.0', port=5002)
