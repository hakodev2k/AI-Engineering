import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path

output = {
    "timestamp": datetime.now(timezone.utc).isoformat(),
    "service": os.getenv("SERVICE", "unknown"),
    "incident": os.getenv("INCIDENT_ID", "unknown"),
    "status": "collected"
}

path = Path(sys.argv[1] if len(sys.argv) > 1 else "incident-context.json")
path.parent.mkdir(parents=True, exist_ok=True)
with path.open("w", encoding="utf-8") as file:
    json.dump(output, file, indent=2)

print(path)
