from flask import Flask, render_template, redirect, request, url_for

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('pathfinding.html')

@app.route('/cron')
def cron():
    return "OK!"

if __name__ == "__main__":
    app.run()
