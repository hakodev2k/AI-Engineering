# Context Compaction Snapshot Integrity Guard

**Category:** Token

## Problem
Automatic compaction can fire from cumulative usage, stale snapshots, or a capacity value that differs from the runtime's actual enforcement budget. That wastes tokens/latency and can discard useful task state.

## Evidence
Recent August 2026 OpenClaw reports document premature compaction from inflated `totalTokens` and disagreement between configured/reported context capacity and an embedded precheck budget. OpenAI's agent architecture describes compaction as threshold-driven state preservation, making token-accounting integrity a control-plane requirement. See `evidence/research.md`.

## Existing approach
Agent runtimes commonly use auto-compaction thresholds, last-call usage, provider telemetry, reserves, configurable context limits, and manual reset/compact commands.

## Existing limitations
Counter semantics are often ambiguous; cached session totals can be stale; configured and enforced capacities can diverge; successful compaction may conceal bad accounting.

## Proposed improvement
Require a fresh, provenance-labeled current-prompt snapshot and a reconciled effective capacity before automatic compaction. Keep cumulative usage separate and block impossible or stale accounting states.

## Architecture
```text
context-compaction-snapshot-integrity-guard/
├── README.md
├── config/
│   └── policy.json
├── evidence/
│   └── research.md
├── hooks/
│   └── pre-compaction.md
├── rules/
│   └── token-accounting-invariants.md
├── scripts/
│   └── compaction_snapshot_guard.py
├── skills/
│   └── token-snapshot-integrity-analysis.md
├── subagents/
│   └── accounting-verifier.md
├── tests/
│   └── test_compaction_snapshot_guard.py
└── workflows/
    ├── measure-diagnose-fix.md
    └── regression-verification.md
```

## Installation
Python 3.10+; no third-party Python packages are required.

## Configuration
Edit `config/policy.json` only after measuring the runtime's real context capacity and reserve requirements. Do not use policy changes to hide accounting inconsistencies.

## Usage
Prepare a snapshot JSON containing the fields documented in `evidence/research.md`, then run:

`python scripts/compaction_snapshot_guard.py --snapshot snapshot.json --policy config/policy.json`

Exit 0 means the accounting state is valid and the JSON decision is `defer` or `allow_compaction`; exit 3 means an accounting invariant blocks automatic compaction; exit 2 means input/config parsing failed.

## Workflow
Use `workflows/measure-diagnose-fix.md` for incidents and `workflows/regression-verification.md` for changes. The pre-compaction integration contract is in `hooks/pre-compaction.md`.

## Metrics
Compactions/100 turns; utilization at trigger; snapshot age; configured/effective mismatch rate; tokens/task; latency/task; quality-regression rate.

## Verification
Run:

`python -m unittest tests/test_compaction_snapshot_guard.py`

Then replay representative runtime traces and obtain independent review from `subagents/accounting-verifier.md`.

## Safety
The package never requires prompt contents or secrets. It must not save tokens by removing correctness-critical context or lowering reserves below safe runtime requirements.

## Failure handling
**Detection:** non-zero guard exit or unexpected compaction metrics.  
**Evidence:** preserve structured token fields, reason codes, and turn IDs.  
**Retry policy:** maximum two hypothesis revisions; one corrective rerun per revision.  
**Fallback:** disable the affected automatic-compaction path when operationally safe.  
**Escalation:** unresolved live-token provenance, state-loss risk, or capacity split-brain.  
**Stop condition:** exhausted retries or any evidence of repeated state loss.

## Definition of Done
**Implemented:** guard is wired to the compaction decision path.  
**Measured:** baseline and post-change token/latency/quality metrics are captured.  
**Verified:** deterministic tests and production-like replay pass; independent verifier confirms cumulative usage cannot trigger compaction and effective capacity is consistent.

## Customization
Add provider-specific snapshot adapters around the guard rather than weakening its invariant model. Preserve the distinction between live prompt occupancy and cumulative usage.
