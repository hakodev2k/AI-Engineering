# Secret Exposure Triage Skill

## Purpose
Detect, classify, remediate, and verify accidental credential exposure without leaking the credential during investigation.

## When to use
Use when a secret scan fails, a reviewer spots a credential-like value, a generated patch may contain secrets, or a repository is being prepared for commit/release.

## Inputs
- Repository root.
- Optional changed-file scope or commit range.
- `config/secret-scan.json`.
- Optional allowlist derived from `templates/allowlist.example.json`.

## Preconditions
- Repository is available locally.
- Python 3.10+ is available for the deterministic scanner.
- Agent can read repository files and `git status`.

## Allowed tools
Read-only repository inspection, `git diff`, `git status`, test/build commands, and `scripts/scan-secrets.py`. Secret-store or provider tools may be read only when already authorized.

## Constraints
Follow `rules/secret-protection.md`. Never echo a full candidate secret. Credential revocation, rotation, history rewriting, production configuration changes, and force push require human approval.

## Procedure
1. Capture `git status --short` and the requested scan scope.
2. Run `python scripts/scan-secrets.py --root <repo> --config config/secret-scan.json --output secret-scan-report.json`.
3. For each finding, inspect surrounding code without copying the candidate value.
4. Classify each finding as `confirmed`, `likely`, `false-positive`, or `unknown`; attach evidence and confidence.
5. Determine exposure surface: working tree only, committed history, CI logs/artifacts, issue/PR text, or deployed configuration.
6. For `confirmed` or `likely` findings, identify the smallest safe remediation: remove literal, use existing secret provider/environment variable, or replace test fixture with an unmistakably fake value.
7. If remediation needs revocation/rotation, stop at the approval checkpoint and produce the required action list.
8. Apply only approved code/config edits that do not manipulate the actual credential value.
9. Re-run the scanner on the same or broader scope.
10. Run relevant build/tests if source behavior changed.
11. Inspect `git diff --check` and changed files for unrelated edits.
12. Produce a final finding summary with verification status and unresolved exposure risk.

## Expected output
A structured report containing status, findings, redacted evidence, affected component, exposure surface, remediation, approvals required, verification commands/results, and remaining risk.

## Verification
No high/critical unapproved finding remains in scanned files; changed source builds/tests as applicable; no full secret appears in generated reports; any historical exposure is explicitly unresolved until rotation/history handling is approved and completed.

## Failure handling
- Scanner/tool transient failure: retry at most 2 times, preserving stderr.
- Permission failure: stop; do not escalate privileges automatically.
- Excessive scan errors: stop when `max_scan_errors` is reached.
- Test/build failure: preserve output, attempt one evidence-driven remediation cycle, then escalate.

## Stop conditions
Stop on required human approval, inability to safely inspect a candidate, repeated tool failure, or any action that would expose/copy the raw secret.
