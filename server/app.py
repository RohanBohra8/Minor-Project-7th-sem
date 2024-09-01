
from langchain.prompts import PromptTemplate

from langchain_google_genai import ChatGoogleGenerativeAI

from flask import Flask,request, jsonify, Response
from flask_cors import CORS
from dotenv import load_dotenv

import os

import util.scrapper as scrapper

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


@app.route("/summarize", methods = ['POST'])
def summarize():


    user_input = None

    if request.method == 'POST':
        user_input = request.json

    if user_input is None:
        return
    
    url = ""

    if request.method == 'POST':
        url = user_input.get('url')


    article_content = scrapper.scrape_medium(url)


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


@app.route('/test')
def hello_world():
    return "<h1>hello world</h1>"

 
if __name__ == '__main__':
    app.run()