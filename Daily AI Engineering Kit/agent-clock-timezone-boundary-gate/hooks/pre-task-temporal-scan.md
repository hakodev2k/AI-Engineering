# Pre-task Temporal Scan Hook

**Trigger:** before investigation or edits involving temporal behavior.

**Preconditions:** Python 3.9+; repository root is current directory; package config exists.

**Action:**

`python scripts/temporal_scan.py --root . --output .ai-temporal/scan.json`

**Expected result:** exit 0 and JSON inventory containing candidate temporal hotspots.

**Failure behavior:** exit 2 indicates invalid invocation/environment and blocks execution. Scan findings do not by themselves prove defects; they seed evidence collection.

**Blocking:** yes for script failure; no for individual findings.