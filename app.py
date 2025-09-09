from flask import Flask, render_template, abort, request

app = Flask(__name__)

units = [
    {
        'id': 1,
        'title': 'Pico',
        'image': 'unit1.jpg',
        'detail_image': 'pico_detail.jpg',
        'photos': [
            {'filename': 'detail_pico1.jpg', 'description': 'Отображение без счётчика'},
            {'filename': 'detail_pico2.jpg', 'description': 'Отображение с счётчиком'},
            {'filename': 'detail_pico3.jpg', 'description': 'Отображение без счётчика'},
            {'filename': 'detail_pico4.jpg', 'description': 'Отображение с счётчиком'},
        ],
        'description': 'Надёжный и качественный сантехнический узел.',
    },
    {
        'id': 2,
        'title': 'Nano',
        'image': 'unit2.jpg',
        'detail_image': 'nano_detail.jpg',
        'photos': [
            {'filename': 'detail_nano1.jpg', 'description': 'Отображение без счётчика'},
            {'filename': 'detail_nano2.jpg', 'description': 'Отображение с счётчиком'},
            {'filename': 'detail_nano3.jpg', 'description': 'Отображение без счётчика'},
            {'filename': 'detail_nano4.jpg', 'description': 'Отображение с счётчиком'},
        ],
        'description': 'Современный дизайн и высокая эффективность.',
    },
    {
        'id': 3,
        'title': 'Micro',
        'image': 'unit3.jpg',
        'detail_image': 'micro_detail.jpg',
        'photos': [
            {'filename': 'detail_micro1.jpg', 'description': 'Отображение без счётчика'},
            {'filename': 'detail_micro2.jpg', 'description': 'Отображение с счётчиком'},
            {'filename': 'detail_micro3.jpg', 'description': 'Отображение без счётчика'},
            {'filename': 'detail_micro4.jpg', 'description': 'Отображение с счётчиком'},
        ],
        'description': 'Прост в установке и долговечен в применении.',
    },
    {
        'id': 4,
        'title': 'Milli',
        'image': 'unit4.jpg',
        'detail_image': 'milli_detail.jpg',
        'photos': [
            {'filename': 'detail_milli1.jpg', 'description': 'Отображение без счётчика'},
            {'filename': 'detail_milli2.jpg', 'description': 'Отображение с счётчиком'},
            {'filename': 'detail_milli3.jpg', 'description': 'Отображение без счётчика'},
            {'filename': 'detail_milli4.jpg', 'description': 'Отображение с счётчиком'},
        ],
        'description': 'Идеален для любой системы водоснабжения.',
    },
    {
        'id': 5,
        'title': 'Mini',
        'image': 'unit5.jpg',
        'detail_image': 'mini_detail.jpg',
        'photos': [
            {'filename': 'detail_mini1.jpg', 'description': 'Отображение без счётчика'},
            {'filename': 'detail_mini2.jpg', 'description': 'Отображение с счётчиком'},
            {'filename': 'detail_mini3.jpg', 'description': 'Отображение без счётчика'},
            {'filename': 'detail_mini4.jpg', 'description': 'Отображение с счётчиком'},
        ],
        'description': 'Надёжность проверена временем.',
    },
    {
        'id': 6,
        'title': 'Centri',
        'image': 'unit6.jpg',
        'detail_image': 'centri_detail.jpg',
        'photos': [
            {'filename': 'detail_centri1.jpg', 'description': 'Отображение без счётчика'},
            {'filename': 'detail_centri2.jpg', 'description': 'Отображение с счётчиком'},
            {'filename': 'detail_centri3.jpg', 'description': 'Отображение без счётчика'},
            {'filename': 'detail_centri4.jpg', 'description': 'Отображение с счётчиком'},
        ],
        'description': 'Отличное соотношение цены и качества.',
    }
]

# Новая главная страница
@app.route('/')
def main_home():
    # Просто показываем страницу с ссылкой на каталог
    return render_template('main_index.html')

# Страница каталога (бывший index.html)
@app.route('/catalog')
def catalog():
    return render_template('index.html', units=units)

# Страница конкретного узла
@app.route('/unit/<int:unit_id>')
def unit_page(unit_id):
    unit = next((u for u in units if u['id'] == unit_id), None)
    if not unit:
        abort(404)
    return render_template('unit.html', unit=unit)

# Страница сравнения
@app.route('/compare')
def compare():
    ids_list = request.args.getlist('units')
    if not ids_list:
        return "Не выбраны узлы для сравнения", 400
    try:
        ids_list = list(map(int, ids_list))
    except ValueError:
        return "Неверный формат данных", 400
    selected_units = [u for u in units if u['id'] in ids_list]
    if not selected_units:
        return "Выбранные узлы не найдены", 404
    return render_template('compare.html', units=selected_units)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5002)

