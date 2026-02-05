import sys
import logging

logging.basicConfig(level=logging.DEBUG)

print("Test 1: langchain_text_splitters")
try:
    from langchain_text_splitters import RecursiveCharacterTextSplitter
    print("PASS: langchain_text_splitters")
except Exception as e:
    print(f"FAIL: {e}")

print("Test 2: langchain_community.document_loaders")
try:
    from langchain_community.document_loaders import PyPDFLoader, TextLoader
    print("PASS: langchain_community.document_loaders")
except Exception as e:
    print(f"FAIL: {e}")

print("Test 3: langchain_ollama")
try:
    from langchain_ollama import OllamaEmbeddings
    print("PASS: langchain_ollama")
except Exception as e:
    print(f"FAIL: {e}")

print("Test 4: langchain_chroma")
try:
    from langchain_chroma import Chroma
    print("PASS: langchain_chroma")
except Exception as e:
    print(f"FAIL: {e}")

print("All imports finished.")
