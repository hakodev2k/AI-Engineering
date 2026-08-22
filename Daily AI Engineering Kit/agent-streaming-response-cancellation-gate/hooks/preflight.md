# Preflight hook

**Trigger:** before investigation or edits.

**Preconditions:** repository root is available and Python 3 is installed.

**Action:** run `python scripts/scan-streaming-cancellation.py <repo> --json` from this package and save stdout as baseline evidence. Also record `git status --short` so pre-existing changes are not attributed to the agent.

**Expected result:** scanner exits 0 with no findings, or exits 1 with actionable findings captured for investigation. Exit 2 is an execution/configuration failure.

**Failure behavior:** exit 1 does not block investigation but blocks verified completion until findings are resolved or justified. Exit 2 blocks editing until the scanner can run. Never clean or reset the workspace automatically.

**Blocking:** configuration failures block; findings block final verification only.
