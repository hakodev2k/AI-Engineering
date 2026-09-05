# Pending Request Context Headroom Guard

**Category:** Token  
**Run date:** 2026-09-06 (UTC+7)

## Problem
Auto-compaction can inspect stale usage from the previous turn and miss a large pending prompt, file, tool result, retrieval block, or memory injection. The next request can then cross the model context limit before compaction has a chance to run.

## Evidence
Current public evidence and source links are in `evidence/research.md`. Observed evidence, interpretation, and the proposed solution are separated there.

## Existing approach
Agent frameworks commonly use percentage-based auto-compaction, manual compact/compress commands, sliding-window eviction, provider token counters, model context metadata, and provider errors followed by retry.

## Existing limitations
A percentage threshold is insufficient when it uses prior-turn usage, excludes pending additions, trusts mismatched tokenization, or omits output/uncertainty reserve. Blind retry can worsen an overflow by appending more failure history.

## Proposed improvement
Add a deterministic pre-send admission gate that projects the complete next input and reserves output plus uncertainty headroom. It produces `SEND`, `COMPACT`, or `BLOCK`; compaction is bounded and required context is protected.

## Actual package tree
```text
pending-request-context-headroom-guard/
├── README.md
├── evidence/research.md
├── skills/pending-context-budget.md
├── rules/context-headroom.md
├── subagents/context-verifier.md
├── workflows/measure-compact-verify.md
├── hooks/pre-send-budget.md
├── scripts/pending_context_guard.py
├── config/budget.example.json
└── tests/test_pending_context_guard.py
```

## Installation
Python 3.10+; standard library only.

## Configuration
Copy `config/budget.example.json`. Set the effective model context window from authoritative runtime/provider configuration. Reserve enough output tokens for the task and set an uncertainty margin based on projected-vs-actual token error.

## Usage
```bash
python scripts/pending_context_guard.py --config config/budget.example.json --history 52000 --pending 22000 --tool 6000
python -m unittest tests/test_pending_context_guard.py
```
Exit 0 = SEND, 3 = COMPACT, 4 = BLOCK, 1 = invalid/unknown configuration.

## Workflow
Observe -> measure baseline -> project next request -> diagnose accounting gaps -> form hypothesis -> compact eligible context if required -> measure again -> send only if admissible -> compare actual usage -> independent verification. See `workflows/measure-compact-verify.md`.

## Metrics
Tokens/task; projected-vs-actual token error; context utilization at send; overflow errors/task; compactions/task; summary tokens; cost/task; latency/task; result quality; regression rate; critical-context-loss incidents.

## Verification
**Implemented:** executable guard, hook, rules, workflow, tests, and independent verifier instructions exist.  
**Measured:** integrations must capture a baseline and the projected/actual token ledger on the same workload.  
**Verified:** boundary tests pass; known large-pending-input fixtures are intercepted before provider overflow; required context remains present; quality regression stays within the team's defined tolerance.

## Safety
Never remove required security policy, user constraints, acceptance criteria, unresolved decisions, or verification evidence merely to save tokens. Unknown capacity blocks automatic sending. A larger context route must remain compatible with the task's security/data policy.

## Failure handling
Detection: nonzero guard exit, provider context error, projection error beyond tolerance, or critical-context-loss test. Evidence: token ledger and request component counts. Retry: token measurement once; compaction at most twice. Fallback: explicit smaller-context assembly or approved larger-window model. Escalation: agent/platform owner. Stop condition: still inadmissible after two compactions or protected context would need removal.

## Definition of Done
Evidence is documented; baseline captured; capacity source recorded; projected-next-request accounting implemented; tests pass; before/after metrics collected; overflow fixture is prevented; no protected context is lost; no blocking issue remains; Context Verifier reports PASS.

## Customization
Add provider-specific token adapters or component categories, but preserve the invariant that admission uses the complete projected request plus reserves rather than only previous-turn usage.