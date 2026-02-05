import sys
import logging

logging.basicConfig(level=logging.DEBUG)

print("Test 1: numpy")
try:
    import numpy
    print(f"PASS: numpy {numpy.__version__}")
except Exception as e:
    print(f"FAIL: {e}")

print("Test 2: onnxruntime")
try:
    import onnxruntime
    print(f"PASS: onnxruntime {onnxruntime.__version__}")
except Exception as e:
    print(f"FAIL: {e}")

print("Test 3: tokenizers")
try:
    import tokenizers
    print(f"PASS: tokenizers {tokenizers.__version__}")
except Exception as e:
    print(f"FAIL: {e}")

print("Test 4: pydantic")
try:
    import pydantic
    print(f"PASS: pydantic {pydantic.__version__}")
except Exception as e:
    print(f"FAIL: {e}")
