#!/usr/bin/env python3
import json
import os
import sys
from datetime import datetime, timezone


def main():
    output = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "repository": os.getenv("REPOSITORY", "unknown"),
        "incident": os.getenv("INCIDENT_ID", "unknown"),
        "status": "context-collected"
    }
    print(json.dumps(output, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
