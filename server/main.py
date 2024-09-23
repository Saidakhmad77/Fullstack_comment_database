from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin  #preventing CORS errors
from flask_sqlalchemy import SQLAlchemy
import sqlalchemy

app = Flask(__name__)
CORS(app)

db = sqlalchemy.create_engine(
    "mariadb+pymysql://root:@localhost:3306/simpledb", echo=True
)
""" app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False


db = SQLAlchemy(app) """

@app.route('/')
def hello():
    return "Hello World"

@app.route('/api/comment/', methods=["GET"])
def get_comments_route():
    
    get_comments()
    
    return jsonify({"message": "All comments retrieved"}), 200


@app.route('/api/comment/', methods=["POST"])
def add_comment_route():
    data = request.get_json()
    print(data)
    
    username = data.get("username")
    comment = data.get("comment_text")
    
    add_comment(username, comment)
    
    return jsonify({"message": "Comment successfully added"}), 200

@app.route("/api/comment/", methods=["PUT"])
@cross_origin()
def update_comment_route():
    data = request.get_json()
    print(data)
    
    comment_id = data.get("comment_id")
    comment = data.get("comment_text")
    
    update_comment(comment_id, comment)
    
    return jsonify({"message": "Comment successfully updated"}), 200


@app.route("/api/comment/", methods=["DELETE"])
@cross_origin()
def delete_comment_route():
    data = request.get_json()
    print(data)
    
    comment_id = data.get("comment_id")
    #comment_text = data.get("comment_text")
    
    delete_comment(comment_id)
    
    return jsonify({"message": "Comment successfully deleted"}), 200



def get_comments():
    with db.connect() as conn:
        result = conn.execute(sqlalchemy.text("SELECT * FROM comments"))
        conn.commit()


def add_comment(username, comment_text):
    with db.connect() as conn:
        result = conn.execute(sqlalchemy.text(
            """
            INSERT INTO `comments` (`comment_id`, `username`, `comment_text`) VALUES (NULL, :username, :comment_text)
            """),
        {
            "username": username,
            "comment_text": comment_text
        })
        conn.commit()
    return get_comments()


def update_comment(comment_id, comment_text):
    with db.connect() as conn:
        result = conn.execute(sqlalchemy.text(
            """
            UPDATE `comments`
            SET `comment_text` = :comment_text
            WHERE `comment_id` = :comment_id
            """
        ),
        {
            "comment_id": comment_id,
            "comment_text": comment_text
        })
        conn.commit()
    return get_comments()

def delete_comment(comment_id):
    with db.connect() as conn:
        result = conn.execute(sqlalchemy.text(
            """
            DELETE FROM `comments`
            WHERE `comment_id` = :comment_id
            """
        ),
        {
            "comment_id": comment_id
        })
        conn.commit()
    return get_comments()


if __name__=="__main__":
    #get_comments()
    app.run(debug=True)
    #add_comment("Ali", "Ali's comment")