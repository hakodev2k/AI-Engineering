# Verification Evidence Epoch Guard

**Category:** Thinking

## Problem
Coding agents can enter redundant verification loops because stale runtime metadata, historical changed paths, or temporary harness lifecycle is confused with the actual question: whether the current workspace snapshot has fresh passing evidence.

## Evidence
`evidence/research.md` documents current public signals from Hermes Agent and existing proof/evidence tools.

## Existing approach
Verification reminders, stop hooks, transcript evidence checks, proof folders, CI, and independent verifier roles.

## Existing limitations
These approaches are useful but can still depend on mutable timestamps, historical path lists, or prose claims unless a result is bound to an immutable snapshot and monotonic event.

## Proposed improvement
Represent verification freshness as a deterministic contract: monotonic verification epoch + exact verified snapshot + exit code + timestamp + current dirty state. Reverify only on explicit invalidation.

## Architecture
- `evidence/research.md` — observed evidence, interpretation, existing approaches, root cause.
- `config/policy.json` — TTL, monotonicity, dirty-diff and retry policy.
- `scripts/verification_epoch_guard.py` — deterministic freshness validator.
- `tests/test_verification_epoch_guard.py` — regression fixtures.
- `skills/verification-freshness-analysis.md` — reusable investigation procedure.
- `rules/verification-evidence.md` — enforceable requirements.
- `subagents/verification-reviewer.md` — independent reviewer contract.
- `workflows/research-diagnose.md` — bounded diagnosis.
- `workflows/verify-regression.md` — regression workflow.
- `hooks/pre-completion.md` — deterministic completion gate.

## Installation
Python 3.10+; standard library only.

## Configuration
Set TTL and retry policy in `config/policy.json`. Snapshot identifiers SHOULD be Git tree/commit identities or deterministic digests of the relevant worktree state.

## Usage
Create a state JSON and run:

`python scripts/verification_epoch_guard.py --state state.json --policy config/policy.json`

Exit 0 means fresh. Exit 3 means reverify/block. Exit 2 means invalid input/evaluation failure.

## Workflow
Observe → measure redundant verification baseline → diagnose state mismatch → form one hypothesis → correct state/implementation → measure again → independent review → complete.

## Metrics
- Redundant verification runs per unchanged snapshot.
- Stale-state false-positive rate.
- Stale-green escape rate.
- Verification retries/task.
- Verification wall-clock time/task.

## Verification
Run `python -m unittest tests/test_verification_epoch_guard.py`. Deterministic reference tests were executed before publication. Production integration must additionally test its real snapshot generator and verification command.

## Safety
Never weaken tests, verification scope, security checks, or snapshot matching merely to clear a stale flag. High-impact changes require an independent reviewer.

## Failure handling
**Detection:** non-zero guard result or epoch/snapshot inconsistency.  
**Evidence:** retain state record and verification output.  
**Retry policy:** maximum two diagnosis retries; regression workflow allows one corrective rerun.  
**Fallback:** block the verified completion claim and preserve the last known evidence.  
**Escalation:** inconsistent snapshot/epoch state after retries.  
**Stop condition:** fresh evidence or bounded retry exhaustion.

## Definition of Done
**Implemented:** epoch/snapshot record and pre-completion guard integrated.  
**Measured:** baseline and post-change rerun/freshness metrics captured.  
**Verified:** deterministic tests pass, current snapshot matches passing evidence, reviewer confirms no unsupported completion claim, no blocking issue remains.

## Customization
Extend snapshot generation and verification scopes for language/build systems, but preserve monotonic epochs, immutable evidence identity, bounded retries, and independent review for high-impact work.
