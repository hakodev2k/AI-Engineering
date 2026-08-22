#!/usr/bin/env python3
import os
from pathlib import Path
import sys

required = ["REPOSITORY_PATH", "PR_DIFF_PATH"]
missing = [x for x in required if not os.getenv(x)]

if missing:
    print("Missing required environment variables: " + ", ".join(missing))
    sys.exit(1)

repository = Path(os.environ["REPOSITORY_PATH"])
diff = Path(os.environ["PR_DIFF_PATH"])
invalid = []
if not repository.is_dir():
    invalid.append("REPOSITORY_PATH must name an existing directory")
if not diff.is_file():
    invalid.append("PR_DIFF_PATH must name an existing file")
if invalid:
    print("Invalid review inputs: " + "; ".join(invalid))
    sys.exit(1)

print(f"validated:REPOSITORY_PATH:{repository.resolve()}")
print(f"validated:PR_DIFF_PATH:{diff.resolve()}")

sys.exit(0)
