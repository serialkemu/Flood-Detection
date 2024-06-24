from flask import Flask, request

app = Flask(__name__)


@app.route("/data", methods=["POST"])
def receive_data():
    data = request.get_data()

    print(f"Received data: {data.decode('utf-8')}")
    return "Data received successfully"


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
