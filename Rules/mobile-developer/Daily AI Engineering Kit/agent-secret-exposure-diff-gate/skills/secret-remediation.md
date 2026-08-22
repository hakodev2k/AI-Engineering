# Secret Remediation

## Purpose
Remove a confirmed secret from agent-generated changes without widening permissions or performing destructive history changes.

## Inputs
Confirmed finding metadata, repository context, expected configuration mechanism.

## Procedure
1. Replace the literal with an environment/configuration reference appropriate to the project.
2. Add or update a safe `.env.example`-style placeholder only when the repository uses that convention; never add the real value.
3. Ensure local secret files are ignored where appropriate.
4. Add or update tests so behavior is validated without real credentials.
5. Run formatting/build/tests relevant to the changed code.
6. Rerun `secret_diff_gate.py` on the same diff scope.
7. Inspect `git diff` and confirm no unrelated files changed.
8. If the secret was ever committed or pushed, stop and request human-led credential rotation/history-remediation approval.

## Verification
Scanner passes, tests pass, diff contains no credential literal, and configuration remains usable with externally supplied secrets.

## Failure handling
One code-fix retry is allowed for test/build failures caused by remediation. A second failure stops and preserves logs.

## Stop conditions
Production rotation, deleting commits, rewriting history, changing vault/CI permissions, or weakening a detector requires explicit approval.
