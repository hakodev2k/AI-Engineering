#!/usr/bin/env python3
import os
import sys

required = [".git", "README.md"]
missing = [x for x in required if not os.path.exists(x)]
if missing:
    print("Missing:", ", ".join(missing))
    sys.exit(1)

print("Repository validation passed")
