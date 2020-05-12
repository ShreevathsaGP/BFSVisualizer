from flask import Flask, render_template, redirect, url_for, request

app = Flask(__name__)

# Just in case
@app.route('/<random>')
def random(random):
    return redirect(url_for('home'))

@app.route('/')
def home():
    return render_template('pathfinding.html')

if __name__ == "__main__":
    app.run(debug=True)