# Core Skills

## Skill 1 — Baseline Failure Reproduction

**Purpose:** Determine whether an observed test failure is reproducible on unchanged code before allowing failure-driven implementation changes.

**Trigger:** A test, suite, build verification, or CI-equivalent command fails and the agent is considering modifying source code because of that failure.

**Inputs:** failing command, repository revision, working-tree diff, failure output, environment metadata, `config/policy.json`.

**Preconditions:** preserve the exact revision and diff; do not mutate product code during baseline reproduction; record command and environment.

**Required context:** task requirement, files already changed for the requested task, test scope, known flaky-test/quarantine metadata if available.

**Tools:** test runner, version-control status, `scripts/run_repeated_command.py`, `scripts/classify_test_signal.py`.

**Procedure:**
1. Record Facts: command, exit code, failure signature, revision, diff hash, environment.
2. Separate the user's requested implementation changes from any new speculative change motivated only by the failure.
3. Run the same verification on unchanged code for the configured baseline count unless a destructive/expensive constraint forbids it.
4. Normalize outputs and compute failure fingerprints.
5. Classify the sequence as `CONSISTENT_PASS`, `DETERMINISTIC_FAILURE`, `FLAKY_OR_NONDETERMINISTIC`, `LIKELY_INFRASTRUCTURE`, or `UNKNOWN`.
6. If mixed pass/fail appears, do not treat a passing rerun as a fix.
7. If the failure is deterministic and causally relevant to the task, hand off to implementation planning.
8. If flaky or infrastructure-like, switch to flake/root-cause investigation instead of changing unrelated production code.

**Decisions:**
- Deterministic same-signature failures justify a code hypothesis.
- Mixed outcomes require nondeterminism classification.
- Changing signatures require broader diagnosis; do not collapse them into one defect.
- Environment-only signatures require infrastructure investigation.

**Constraints:** bounded reruns; no infinite retry; no source mutation during baseline; no hidden deletion of failed-run evidence.

**Expected output:** structured baseline record with Facts, fingerprints, classification, evidence count, confidence, and next action.

**Metrics:** reproduction rate, fingerprint stability, baseline runs consumed, false-fix avoidance count.

**Verification:** another agent or deterministic classifier can reproduce the classification from the saved run records.

**Failure handling:** if commands time out or environment cannot reproduce, classify `UNKNOWN` or `LIKELY_INFRASTRUCTURE`; preserve evidence and stop speculative repair.

**Stop conditions:** configured run budget reached; destructive setup required; evidence becomes sufficient for a stable classification; or safety/resource policy requires escalation.

---

## Skill 2 — Failure Fingerprint and Evidence Classification

**Purpose:** Convert noisy test logs into comparable evidence without erasing meaningful differences.

**Trigger:** Two or more test/build observations must be compared.

**Inputs:** JSONL run records, stdout/stderr, exit codes, timeouts, policy markers.

**Preconditions:** raw logs retained; normalization rules known.

**Required context:** test command and unchanged/changed code phase.

**Tools:** `scripts/classify_test_signal.py` plus repository-specific parsers if needed.

**Procedure:**
1. Preserve raw evidence before normalization.
2. Normalize volatile fields such as timestamps, temporary paths, process IDs, ports, and durations conservatively.
3. Extract stable error lines: failed test names, assertion types, exception classes, stack-frame anchors, infrastructure markers.
4. Hash the normalized signature to create a fingerprint.
5. Compare pass/fail distribution and fingerprint distribution.
6. Assign a classification and record why that classification follows from observable evidence.
7. Keep uncertainty explicit when logs are incomplete.

**Decisions:** identical fail fingerprints across unchanged-code reruns strengthen deterministic-failure confidence; multiple outcomes or fingerprints weaken it; known network/dependency markers strengthen infrastructure classification but do not prove it by themselves.

**Constraints:** never normalize away test names, exception types, assertion values, or source locations unless repository-specific evidence proves them volatile.

**Expected output:** machine-readable classification plus human-readable evidence table.

**Metrics:** unique fingerprints, pass rate, dominant-fingerprint ratio, infrastructure-marker count.

**Verification:** raw logs map to fingerprints deterministically.

**Failure handling:** malformed/incomplete records become `UNKNOWN`; do not guess.

**Stop conditions:** classification produced or evidence is insufficient and run budget exhausted.

---

## Skill 3 — Causal Fix Verification

**Purpose:** Verify that a code change actually improves a deterministic failure without laundering a flaky pass into success.

**Trigger:** implementation change is complete and tests are rerun.

**Inputs:** baseline record, changed revision/diff, post-change run records, acceptance criteria.

**Preconditions:** baseline exists or an explicit exception explains why it cannot; implementation is frozen during verification.

**Required context:** exact failure fingerprint being targeted, expected behavior, unrelated known flakes.

**Tools:** repeated runner, classifier, focused test runner, full relevant suite.

**Procedure:**
1. Run the targeted failing test repeatedly using the post-change count.
2. Compare outcome distribution to baseline.
3. If baseline was deterministic failure, require disappearance of that fingerprint across the bounded verification set.
4. Run relevant broader verification to detect regressions.
5. If new mixed outcomes appear, classify them independently rather than declaring success.
6. Require an independent Verification Agent to review baseline, change, and post-change evidence.
7. Mark status separately: `Implemented`, `Measured`, `Verified`.

**Decisions:** a single post-change pass is insufficient; disappearance of one fingerprint with appearance of another is not a verified fix; unresolved ambiguity blocks completion.

**Constraints:** verifier cannot rely solely on implementer's prose; use raw run evidence.

**Expected output:** causal comparison with baseline vs post-change metrics and final verification state.

**Metrics:** targeted pass rate, failure-fingerprint recurrence, regression count, rerun budget, rework avoided.

**Verification:** independent reviewer confirms evidence supports conclusion.

**Failure handling:** return to diagnosis for at most the workflow retry budget; otherwise stop with blocking evidence.

**Stop conditions:** verified; regression found; ambiguity persists after bounded runs; or resource budget exhausted.
