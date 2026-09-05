# Hook: CI Quarantine Gate
Trigger: every CI run touching tests or quarantine registry.
Command: `python scripts/quarantine_gate.py --registry config/quarantines.json --policy config/policy.json`
Expected result: exit 0 and no expired/overlong/excess active quarantine.
Failure behavior: CI blocks and prints exact policy violations. Do not auto-renew.
Blocking: yes.
