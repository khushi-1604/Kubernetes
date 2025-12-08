from flask import Flask
import os

app = Flask(__name__)

@app.route("/ping")
def ping():
    return "pong"

port = int(os.environ.get("PORT", 8080))
app.run(host="0.0.0.0", port=port)
