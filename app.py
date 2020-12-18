from flask import Flask, request, render_template, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__, template_folder="build", static_folder="build/static")

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///scores.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)
db.create_all()

class Score(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    time_recorded = db.Column(db.String(80), nullable=False)
    username = db.Column(db.String(80), nullable=False)
    score = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return f"Score(id: {self.id}, time_recorded: {self.time_recorded}, username: {self.username}, score: {self.score})"


@app.route("/")
def index():
    return render_template("index.html")

@app.route("/manifest.json")
def manifest():
    return send_from_directory("build", "manifest.json")

@app.route("/favicon.ico")
def favicon():
    return send_from_directory("build", "favicon.ico")

@app.route("/post", methods=["POST"])
def post_score():
    entry_properties = request.get_json()
    db.session.add(
        Score(
            time_recorded=entry_properties["time_recorded"],
            username=entry_properties["username"],
            score=entry_properties["score"],
        )
    )
    db.session.commit()
    return "[SCORE POST SUCCESS]"


@app.route("/highscore", methods=["GET"])
def get_highscore():
    print("Hello")
    try:
        highscore = Score.query.order_by(Score.score.desc()).first().score
    except AttributeError:
        highscore = 0
    return jsonify(score=highscore)

if __name__ == "__main__":
    app.run()
