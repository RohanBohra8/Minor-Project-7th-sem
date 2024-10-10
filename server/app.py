
from langchain.prompts import PromptTemplate

from langchain_google_genai import ChatGoogleGenerativeAI

from flask import Flask,request, jsonify, Response
from flask_cors import CORS
from dotenv import load_dotenv

import sqlite3
import os

import util.scrapper as scrapper
import util.db as db
import routes.qa as qa

app = Flask(__name__)
CORS(app)


# Load from .env file
load_dotenv()


llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-pro",
    temperature=0,
    max_tokens=None,
    timeout=None,
    max_retries=2
)


db.init_db()
conn = sqlite3.connect('session.db', check_same_thread=False)
c = conn.cursor()

@app.route("/search", methods = ['POST'])
def search():
    
        user_input = None
    
        if request.method == 'POST':
            user_input = request.json
    
        if user_input is None:
            return
        
        url = ""
    
        if request.method == 'POST':
            url = user_input.get('url')

        article_content, title, image_url = scrapper.scrape_medium(url)
    
        c.execute("INSERT INTO Session (article_content) VALUES (?)", (article_content,))
        session_id = c.lastrowid

        print(session_id)

        conn.commit()
    
        response = {'session_id': session_id, 'title': title, 'image_url': image_url}
    
        return jsonify(response)


@app.route("/summarize", methods = ['POST'])
def summarize():


    user_input = None

    if request.method == 'POST':
        user_input = request.json

    if user_input is None:
        return
    
    url = ""

    if request.method == 'POST':
        session_id = user_input.get('session_id')

    result = c.execute("SELECT article_content FROM Session WHERE session_id = ?", (session_id,))
    article_content = result.fetchone()[0]

    template = """Prompt: You are a summarizer tool. Your task is to condense the content of the text delimited by triple backticks into a detailed summary. Include keypoints in your summary. You are not required to write anything other than the summary itself``{text}```

    Summary: """

    prompt = PromptTemplate(template=template, input_variables=["text"])

    chain = prompt | llm
    response = chain.invoke(
        {
           "text": article_content
        }
    )

    print(response.content)
    response = {'summary': response.content}

    return jsonify(response)

@app.route("/qa", methods= ['POST'])
def question_answering():
    user_input = None

    if request.method == 'POST':
        user_input = request.json

    if user_input is None:
        return
    
    question = user_input.get('question')
    session_id = user_input.get('session_id')

    result = c.execute("SELECT article_content FROM Session WHERE session_id = ?", (session_id,))
    article_content = result.fetchone()[0]
    
    answer = qa.handle_qa(question = question, content = article_content)
    response = {'answer': answer}
    return jsonify(response)


@app.route('/test')
def hello_world():
    return "<h1>hello world</h1>"

# @app.teardown_appcontext
# def close_connection(exception):
#     conn.close()

 
if __name__ == '__main__':
    app.run()