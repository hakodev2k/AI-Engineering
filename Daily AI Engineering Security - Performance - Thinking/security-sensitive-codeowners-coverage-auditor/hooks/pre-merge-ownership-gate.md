# Hook: Pre-Merge Security Ownership Gate

## Trigger
Before merging a change that edits CODEOWNERS or moves/renames files under a security-critical subsystem.

## Preconditions
Current branch checked out; approved critical-path manifest available.

## Action
Run `python scripts/audit_codeowners.py --repo . --codeowners .github/CODEOWNERS --manifest config/security-paths.json`.

## Expected result
Exit 0 with JSON `status: pass` and 100% declared-path required-owner coverage.

## Failure behavior
Exit 2 blocks the security verification claim and merge when this gate is configured as required. Exit 1 blocks because evidence/configuration is invalid.

## Blocking
Yes when used as a required security gate.
