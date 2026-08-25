# Agent Destructive Workspace Transaction Guard

**Category:** Security

## Problem
AI coding agents can overwrite or delete user data while performing apparently routine move, checkout, cleanup, or review operations. Current incidents show destructive filesystem actions can occur before the destination or replacement is verified, and agents may then report success without read-back evidence.

## Evidence
See `evidence/research.md`. The package is grounded in fresh Codex and Claude Code reports from 2026-08-25/24 showing unrecoverable photo loss and loss of uncommitted work.

## Existing approach and gap
Sandboxing, Git, permission prompts, and repository instructions reduce risk but do not guarantee transaction ordering. Git cannot recover unstaged bytes overwritten before they were staged, and a generic approval does not prove the exact destination or postcondition.

## Proposed improvement
Treat destructive workspace mutation as a transaction: inventory → fingerprint → canonicalize exact targets → stage/copy → read back → compare → only then delete/overwrite. Block if uncommitted tracked changes, path ambiguity, destination mismatch, missing read-back, or irreversible cleanup remains unapproved.

## Package tree
- `evidence/research.md` — current evidence and root cause.
- `skills/destructive-transaction-analysis.md` — reusable procedure.
- `rules/destructive-write-policy.md` — enforceable invariants.
- `subagents/independent-transaction-verifier.md` — independent verifier.
- `workflows/safe-move-and-overwrite.md` — bounded workflow.
- `hooks/pre-destructive-mutation.md` — deterministic preflight hook.
- `scripts/workspace_transaction_guard.py` — dependency-free guard.
- `tests/test_workspace_transaction_guard.py` — regression tests.

## Installation
Requires Python 3.10+. No third-party packages.

## Usage
Create a JSON plan describing `source`, `destination`, `operation`, with optional `repo_root`, `expected_source_resolved`, and `expected_destination_resolved`. Run:

`python scripts/workspace_transaction_guard.py preflight --plan plan.json`

After the copy/move staging step:

`python scripts/workspace_transaction_guard.py verify --plan plan.json`

Only a zero exit code from `verify` permits irreversible source deletion.

## Metrics
`blocked_destructive_actions`, `path_mismatch_count`, `dirty_tracked_file_blocks`, `verified_file_ratio`, `hash_mismatch_count`, and false-positive rate.

## Verification
Implemented means the guard and policies exist. Measured means the preflight/verify JSON metrics were captured. Verified means tests pass and a destructive action cannot advance when destination verification fails.

## Safety
The script is read-only. It never deletes, renames, checks out, resets, or writes repository content. Human approval remains mandatory for irreversible cleanup not recoverable by version control or trash.

## Failure handling
Detection is deterministic non-zero exit. Retry at most twice after correcting path/state. Fallback is preserve source and perform no destructive action. Escalate unresolved ambiguity to a human. Stop when source/destination identity cannot be proven.

## Definition of Done
Evidence documented; exact paths canonicalized; dirty state checked; destination staged; every required artifact read back; hashes/sizes match; independent verifier accepts evidence; tests pass; no deletion occurred before verification.