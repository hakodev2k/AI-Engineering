# Delegated Context Freshness Epoch Guard

**Category:** Thinking

## Problem
Subagents can inherit project instructions or memory captured at an earlier lifecycle boundary rather than the state current at spawn time. Delegation can therefore look valid while a child plans from stale constraints.

## Evidence
See `evidence/research.md` for recent public reports covering stale subagent snapshots, stale rewind bootstrap context, and incomplete visibility into injected agent memory.

## Existing approach
Restart sessions, ask children to reread files, use forks, or maintain project-specific Git checks.

## Existing limitations
Those methods can discard working state, increase token cost, remain advisory, miss untracked/local memory, or depend on lifecycle hooks that do not exist at child spawn.

## Proposed improvement
Represent critical context as a hash-bound epoch. Before delegation compare current files to the epoch; block on drift; refresh through a host-supported mechanism; recheck; and require independent verification.

## Architecture
```text
README.md
evidence/research.md
hooks/pre-spawn-freshness-check.md
rules/delegated-context-freshness.md
scripts/context_epoch_guard.py
skills/context-freshness-audit.md
subagents/context-freshness-verifier.md
tests/test_context_epoch_guard.py
workflows/spawn-freshness-verification.md
```

## Installation
Python 3.10+; no third-party packages.

## Configuration
Choose an explicit set of correctness/security-critical context files. Do not add secrets solely for this mechanism.

## Usage
Capture: `python3 scripts/context_epoch_guard.py snapshot --root /repo --out /tmp/context-epoch.json CLAUDE.md .claude/CLAUDE.md`

Check: `python3 scripts/context_epoch_guard.py check --root /repo --manifest /tmp/context-epoch.json --json`

Exit codes: `0` fresh, `3` drift, `2` invalid/unreadable input.

## Workflow
Follow `workflows/spawn-freshness-verification.md`. The refresh/recheck loop is capped at two attempts.

## Metrics
Track stale spawns blocked, changed context files, refresh latency, exceptions, and stale-context rework.

## Verification
Run `python3 -m unittest tests/test_context_epoch_guard.py`. Tests cover fresh success, content drift, missing-to-present drift, and path escape rejection.

## Safety
The checker only reads and hashes files. It never executes repository-controlled content and never prints file contents.

## Failure handling
Any invalid input or unresolved drift blocks delegation. Do not weaken the critical set to make the check pass.

## Definition of Done
**Implemented:** package integrated before child spawn.  
**Measured:** freshness outcomes and retries recorded.  
**Verified:** tests pass and an intentional context edit blocks spawn until a new epoch is captured.

## Customization
Wrap the checker in the agent runtime's pre-spawn lifecycle while preserving exit semantics and independent verification.
