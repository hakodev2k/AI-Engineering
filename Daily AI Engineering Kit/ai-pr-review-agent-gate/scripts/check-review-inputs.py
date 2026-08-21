#!/usr/bin/env python3
import os
import sys

required = ["REPOSITORY_PATH", "PR_DIFF_PATH"]
missing = [x for x in required if not os.getenv(x)]

if missing:
    print("Missing required environment variables: " + ", ".join(missing))
    sys.exit(1)

for key in required:
    print(f"validated:{key}")

sys.exit(0)
