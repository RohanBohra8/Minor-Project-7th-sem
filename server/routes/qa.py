from langchain_core.vectorstores import InMemoryVectorStore
from langchain_community.embeddings import JinaEmbeddings
import os
from langchain_community.document_loaders import TextLoader
from util.splitter import split_text
import dotenv as dotenv
from langchain_core.prompts import PromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI


def handle_qa(question, content):

    dotenv.load_dotenv()
    
    embeddings = JinaEmbeddings(jina_api_key=os.environ["JINA_API_KEY"], model_name="jina-embeddings-v2-base-en")

    text = ""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(script_dir, 'test', 'test.txt')

    # with open(file_path, 'r', encoding="ISO-8859-1") as file:
    #     text = file.read()

    # text = TextLoader(file_path).load()

    # print(text)

    encoded_content = content.encode('ISO-8859-1', errors='ignore')
    content = encoded_content.decode('ISO-8859-1')
    print(content)

    splits = split_text(content)
    # print(splits)

    vectorstore = InMemoryVectorStore.from_texts(
        texts=splits,
        embedding = embeddings,
    )

    # retriever = vectorstore.as_retriever()
    # retrieved_documents = retriever.invoke("What does this say about ads?")

    # question = "What does this say about ads?"
    
    docs = vectorstore.similarity_search(question)

    docsContent = ""

    for doc in docs:
        docsContent+= doc.page_content

    template = """
        Prompt: Your task is to provide an answer to the user's question solely based on the document text provided to you delimited by triple backticks. Make sure that you stick to the provided information only. If you don't find the answer to the question in the text just say that you can not answer this question ```{docsContent}```

        Question: {question}

        Answer: """

    prompt = PromptTemplate(template=template, input_variables=["docsContent", "question"])

    llm = ChatGoogleGenerativeAI(
        model="gemini-1.5-pro",
        temperature=0,
        max_tokens=None,
        timeout=None,
        max_retries=2
    )

    chain = prompt | llm

    response = chain.invoke(
        {
           "docsContent": docsContent,
           "question": question
        }
    )
    # print(response.content)
    return response.content
    

# handleQA()
