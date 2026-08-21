#!/usr/bin/env python3
import subprocess,sys
try:
    result=subprocess.run(['git','status','--porcelain'],capture_output=True,text=True)
    if result.stdout.strip():
        print('repository has changes')
        sys.exit(1)
    print('repository ready')
except Exception as e:
    print(e)
    sys.exit(1)
