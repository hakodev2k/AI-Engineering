# Hook: Pre-change Validation

**Trigger:** before any feature-flag edit.

**Preconditions:** request and policy files exist; repository is readable.

**Action:** run `python scripts/feature_flag_gate.py --config config/policy.yaml --request <request> --repo-root .`.

**Expected result:** exit code 0 and `PASS` with approval requirement reported.

**Failure behavior:** exit code non-zero blocks editing. Validation/policy failures require corrected input or human approval; they are not blindly retried.

**Blocking:** yes.