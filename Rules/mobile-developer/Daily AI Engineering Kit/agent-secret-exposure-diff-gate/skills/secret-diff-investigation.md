# Secret Diff Investigation

## Purpose
Identify whether newly added repository content contains real credentials, sensitive tokens, private keys, or high-entropy values before an agent commits or opens a pull request.

## When to use
Run after agent edits and before commit/PR preparation, or whenever the scanner blocks a change.

## Inputs
- Git working tree or staged diff.
- `config/secret-policy.yaml`.
- Scanner result JSON.

## Preconditions
- Repository is a Git working tree.
- Python 3.10+ and PyYAML are available.
- The investigator can read changed files but does not require production credentials.

## Allowed tools
Git diff/status, repository search, local test execution, scanner script.

## Constraints
Never print detected secret values. Use path, line, pattern ID, severity, and SHA-256 value hash as evidence.

## Procedure
1. Run `python scripts/secret_diff_gate.py --policy config/secret-policy.yaml --output secret-scan-result.json`.
2. If staging is the intended commit boundary, rerun with `--staged`.
3. For each finding, inspect the owning file and nearby code without copying the suspected value into notes.
4. Classify the finding as confirmed secret, generated fixture, documentation example, or false positive.
5. For confirmed secrets, identify the intended secret source such as environment variable, secret store, user-secret store, CI secret, or local ignored file.
6. For false positives, require evidence that the value is non-sensitive and stable; prefer changing the fixture format over allowlisting.
7. Record findings using only hashes and metadata.
8. Hand confirmed findings to the remediation skill; hand disputed findings to the independent verifier.

## Expected output
A finding list with status, path, line, detector, severity, classification, evidence, and recommended action.

## Verification
A finding is resolved only when the scanner passes on the exact commit scope and no secret value appears in the report.

## Failure handling
Scanner/tool failures may be retried once after fixing the environment. Permission failures stop the workflow. Repeated scanner failures stop after two total attempts and preserve stderr plus command details.

## Stop conditions
Stop immediately if remediation requires rotating a production secret, changing secret-store permissions, deleting Git history, or force-pushing; explicit human approval is required.
