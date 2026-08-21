import json
import os
import sys
from datetime import datetime, timezone

output = {
    "timestamp": datetime.now(timezone.utc).isoformat(),
    "service": os.getenv("SERVICE", "unknown"),
    "incident": os.getenv("INCIDENT_ID", "unknown"),
    "status": "collected"
}

path = sys.argv[1] if len(sys.argv) > 1 else "incident-context.json"
with open(path, "w", encoding="utf-8") as file:
    json.dump(output, file, indent=2)

print(path)
