#!/usr/bin/env python3
import os
import sys

required = ["INCIDENT_ID", "EVIDENCE_PATH"]
missing = [x for x in required if not os.getenv(x)]

if missing:
    print("Missing: " + ", ".join(missing))
    sys.exit(1)

print("Evidence context validated")
sys.exit(0)
