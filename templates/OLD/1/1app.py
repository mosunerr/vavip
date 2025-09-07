from flask import Flask, render_template, abort, request

app = Flask(__name__)

units = [
    {
        'id': 1,
        'title': 'Pico',
        'image': 'unit1.jpg',
        'detail_image': 'pico_detail.jpg',
        'video': 'unit1.mp4',
        'description': 'Надёжный и качественный сантехнический узел.',
    },
    {
        'id': 2,
        'title': 'Nano',
        'image': 'unit2.jpg',
        'detail_image': 'nano_detail.jpg',
        'video': 'unit2.mp4',
        'description': 'Современный дизайн и высокая эффективность.',
    },
    {
        'id': 3,
        'title': 'Micro',
        'image': 'unit3.jpg',
        'detail_image': 'micro_detail.jpg',
        'video': 'unit3.mp4',
        'description': 'Прост в установке и долговечен в применении.',
    },
    {
        'id': 4,
        'title': 'Milli',
        'image': 'unit4.jpg',
        'detail_image': 'milli_detail.jpg',
        'video': 'unit4.mp4',
        'description': 'Идеален для любой системы водоснабжения.',
    },
    {
        'id': 5,
        'title': 'Mini',
        'image': 'unit5.jpg',
        'detail_image': 'mini_detail.jpg',
        'video': 'unit5.mp4',
        'description': 'Надёжность проверена временем.',
    },
    {
        'id': 6,
        'title': 'Centri',
        'image': 'unit6.jpg',
        'detail_image': 'centri_detail.jpg',
        'video': 'unit6.mp4',
        'description': 'Отличное соотношение цены и качества.',
    },
]

@app.route('/')
def home():
    return render_template('index.html', units=units)

@app.route('/unit/<int:unit_id>')
def unit_page(unit_id):
    unit = next((u for u in units if u['id'] == unit_id), None)
    if not unit:
        abort(404)
    return render_template('unit.html', unit=unit)

@app.route('/compare')
def compare():
    ids_list = request.args.getlist('units')  # Получаем список выбранных ID

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
    app.run(debug=True)