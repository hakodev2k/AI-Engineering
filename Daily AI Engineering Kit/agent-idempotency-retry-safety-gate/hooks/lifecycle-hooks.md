# Lifecycle Hooks

## Pre-task risk scan
- **Trigger:** Before investigation or editing.
- **Preconditions:** Git repository; Python 3 available; diff base known.
- **Action:** `python scripts/scan-retry-risk.py --base <base> --output .ai/idempotency-scan.json`
- **Expected result:** JSON identifies changed retry/side-effect signals and high-risk files.
- **Failure behavior:** Exit code 1 means high-risk files were detected and must be investigated; exit code 2 blocks due to scanner/tool failure.
- **Blocking:** Tool failure blocks. Risk detection does not block; it activates the gate.

## Post-edit targeted verification
- **Trigger:** After an implementation change intended to close an idempotency finding.
- **Preconditions:** Targeted duplicate-delivery and retry-path test commands are known.
- **Action:** Run the targeted tests, then relevant module tests/build.
- **Expected result:** All required commands exit 0 and reproduce the intended guard behavior.
- **Failure behavior:** Preserve command/output; consume at most one of two workflow fix/retest attempts.
- **Blocking:** Yes for completion.

## Final assessment validation
- **Trigger:** Before workflow completion.
- **Preconditions:** `.ai/idempotency-assessment.json` exists.
- **Action:** `python scripts/validate-assessment.py .ai/idempotency-assessment.json`
- **Expected result:** `assessment valid` and exit code 0.
- **Failure behavior:** Correct the assessment or verification state; never override the validator.
- **Blocking:** Yes.

## Final diff review
- **Trigger:** After verification tests and before completion.
- **Preconditions:** Implementation diff is available.
- **Action:** Inspect `git diff --check` and `git diff <base> --` for unrelated edits, removed safeguards, accidental secrets, and unapproved contract/config/schema changes.
- **Expected result:** No whitespace errors or unintended/high-risk changes.
- **Failure behavior:** Revert unrelated edits or mark blocked/needs-approval as appropriate.
- **Blocking:** Yes.
