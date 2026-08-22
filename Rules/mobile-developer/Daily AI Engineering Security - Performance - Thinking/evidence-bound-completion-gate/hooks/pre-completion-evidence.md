# Hook: Pre-completion Evidence Gate

## Trigger
Before an agent emits a final completion/status response or before an autonomous runner marks a task successful.

## Preconditions
Risk classification and evidence JSON exist; repository is at the tree being claimed.

## Action
Validate required evidence against the repository-owned contract.

## Command
`python3 scripts/verify_evidence.py --contract config/verification-contract.json --evidence .agent/evidence.json --risk medium`

Choose the actual classified risk; do not downgrade merely to pass.

## Expected result
Exit 0 and JSON `status: PASS`.

## Failure behavior
Exit 2 means malformed configuration/evidence and blocks completion. Exit 3 means evidence is missing, stale, wrong-tree, wrong-command, or failed; invoke `workflows/bounded-fix-verify.md` if attempts remain.

## Blocking
Yes. The agent must report BLOCKED/UNVERIFIED rather than claim success.

## Anti-bypass note
CI/branch protection should separately enforce required checks. This hook is a completion-claim gate, not a replacement for server-side protections.