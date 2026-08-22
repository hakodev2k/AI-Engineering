# Hook: Pre-change Scan

**Trigger:** before editing code that touches transactions, retries, messaging, HTTP providers, email/SMS, or blob mutations.

**Preconditions:** Python 3; repository readable; package policy configured.

**Action:** `python scripts/scan_transaction_side_effects.py --root . --policy config/policy.json --output transaction-side-effect-findings.json`

**Expected result:** JSON report exists and all candidates are available for investigation.

**Failure behavior:** exit code 2 means high-risk candidates and blocks blind implementation but starts investigation; exit code 3/tool errors block execution and preserve stderr. Retry tool failure once only.

**Blocking:** yes for uninvestigated high findings and scanner/tool failure.