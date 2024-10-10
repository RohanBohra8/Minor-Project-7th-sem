from langchain.text_splitter import RecursiveCharacterTextSplitter

def split_text(text):
    splitter = RecursiveCharacterTextSplitter(chunk_size = 500, chunk_overlap = 30)
    splits = splitter.split_text(text)
    
    return splits
