# Skill: Review a Submodule Update

## Purpose
Review a proposed submodule pin change as a dependency change rather than a one-line SHA edit.

## Preconditions
Both old and new commits are inspectable, or the review explicitly stops.

## Process
1. Confirm URL and branch metadata did not change unexpectedly.
2. Resolve old/new gitlink SHAs.
3. Inspect upstream commit range, changed files, tags, and release notes.
4. Identify public API, build, security, migration, and licensing implications.
5. Run the parent repository tests that exercise the submodule boundary.
6. Run submodule-native tests when feasible and authorized.
7. Record risk, evidence, and rollback pin.
8. Require human approval for policy-classified changes.
9. Re-run `scan_submodules.py` after final edits.

## Expected output
Evidence-backed accept/reject recommendation plus rollback SHA and verification status.

## Failure handling
If upstream history is rewritten, inaccessible, unsigned where signatures are required, or materially broader than expected, reject or escalate.

## Stop conditions
No approval, unavailable evidence, failing required tests, or unresolved security/license risk.