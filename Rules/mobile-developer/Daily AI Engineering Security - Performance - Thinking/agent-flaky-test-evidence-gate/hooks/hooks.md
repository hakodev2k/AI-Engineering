# Hooks

## Hook — Pre-Failure-Driven-Edit
**Trigger:** the agent proposes a code change whose justification includes a newly observed test/build failure.

**Action:** require a baseline evidence record and classification before allowing the change.

**Command/script:**
`python scripts/classify_test_signal.py --input artifacts/baseline-runs.jsonl --policy config/policy.json`

**Expected result:** classification is available and is not `UNKNOWN`; deterministic repair is allowed only for a task-relevant `DETERMINISTIC_FAILURE`.

**Failure behavior:** block speculative failure-driven mutation; preserve evidence; route to bounded reproduction or escalation.

---

## Hook — Baseline Measurement
**Trigger:** first relevant verification failure.

**Action:** record repeated unchanged-code runs before repair.

**Command/script:**
`python scripts/run_repeated_command.py --runs 3 --timeout 600 --output artifacts/baseline-runs.jsonl -- <test command and args>`

**Expected result:** JSONL contains every run, exit code, duration, timeout state, stdout/stderr, and command.

**Failure behavior:** if the runner itself fails, record `UNKNOWN` and stop automated repair instead of fabricating a test classification.

---

## Hook — Post-Change Verification
**Trigger:** Implementation Agent declares code ready for verification.

**Action:** freeze implementation and collect repeated target-test evidence.

**Command/script:**
`python scripts/run_repeated_command.py --runs 3 --timeout 600 --output artifacts/post-change-runs.jsonl -- <targeted test command>`

Then:
`python scripts/classify_test_signal.py --input artifacts/post-change-runs.jsonl --policy config/policy.json --json-output artifacts/post-change-classification.json`

**Expected result:** bounded run set with classification and no silent discarded failures.

**Failure behavior:** any mixed outcome or target fingerprint recurrence blocks verified completion and returns to one bounded diagnosis cycle.

---

## Hook — Final Completion Gate
**Trigger:** orchestrator intends to mark task complete.

**Action:** verify baseline exists when failure-driven repair occurred, post-change evidence exists, independent verification is recorded, and no unresolved `UNKNOWN`/mixed target outcome is being hidden.

**Command/script:** use the classifier outputs plus workflow checklist; deterministic files are authoritative for run counts/fingerprints.

**Expected result:** statuses explicitly distinguish `Implemented`, `Measured`, `Verified`.

**Failure behavior:** do not mark complete; report the missing evidence or blocking classification.
