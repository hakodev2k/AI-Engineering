# Parallel Tool Call Deduplication & Idempotency Gate

**Category:** Performance

## Problem
Tool-calling models can emit duplicate parallel calls. Blind execution wastes latency/cost and can duplicate side effects; globally disabling parallelism sacrifices useful concurrency.

## Evidence
See `evidence/research.md` for recent LangChain, Microsoft Agent Framework, and OpenAI Agents SDK signals.

## Existing approach
Common mitigations are global serialization, `(tool,args)` deduplication, result caching, or downstream idempotency. Each is incomplete when call IDs are unstable, tools have side effects, or repeated calls are intentionally distinct.

## Proposed improvement
Place a deterministic fingerprint-and-policy gate before parallel dispatch. Exact reads can be collapsed within a bounded logical scope; writes require explicit idempotency semantics. Distinct calls remain parallel.

## Architecture
```text
parallel-tool-call-dedup-idempotency-gate/
├── README.md
├── config/policy.json
├── evidence/research.md
├── hooks/pre-dispatch.md
├── rules/execution-rules.md
├── scripts/dedup_gate.py
├── skills/deduplicate-before-dispatch.md
├── subagents/performance-verifier.md
├── tests/fixtures.json
└── workflows/measure-deduplicate-verify.md
```

## Installation
Python 3.10+; no third-party Python packages are required.

## Configuration
Edit `config/policy.json`. Declare each tool's side-effect behavior in your integration layer and use a stable logical scope ID per turn or operation.

## Usage
Create `pending-calls.json`:
```json
{"scope_id":"turn-1","calls":[{"id":"c1","tool":"search","args":{"q":"agent"},"side_effect":"read"},{"id":"c2","tool":"search","args":{"q":"agent"},"side_effect":"read"}]}
```
Run:
```bash
python scripts/dedup_gate.py pending-calls.json --policy config/policy.json
```
Exit codes: `0` decisions produced without blocking findings, `2` invalid input/configuration, `3` at least one call is blocked.

## Workflow
Follow `workflows/measure-deduplicate-verify.md`: observe, capture baseline, diagnose duplicates, apply the gate, measure again, then use an independent verifier.

## Metrics
Track duplicate execution rate, suppressed calls, external calls/task, wall-clock duration, p95 tool latency, duplicate side effects, and false-collapse regressions.

## Verification
`tests/fixtures.json` defines core expected behavior. Integrations should add a small runner around these fixtures plus captured production-safe traces. Verification requires fewer redundant external calls while labeled distinct calls and intended effects remain unchanged.

## Safety
The optimization never overrides permission checks, approval gates, argument validation, or downstream authorization. Unknown side effects default conservatively. Non-idempotent writes are never replayed from cache by this package.

## Failure handling
Detection: malformed input, call-ID/argument conflict, unexpected write duplicate, or regression fixture failure. Evidence: retain gate output and workload trace. Retry policy: maximum 2 policy/fingerprint revisions. Fallback: disable dedup only for the affected tool while preserving existing security checks. Escalation: human review for ambiguous write semantics. Stop condition: any unresolved false collapse or unsafe side-effect behavior.

## Definition of Done
- **Implemented:** pre-dispatch gate integrated and all calls receive decisions.
- **Measured:** baseline and optimized metrics captured on the same workload.
- **Verified:** fixtures pass, redundant external execution decreases, intended outputs/effects match, and an independent verifier reports no blocking regression.

## Customization
Adjust scope and tool side-effect declarations, but keep identity deterministic and bounded. Broader cross-turn deduplication should be added only with application-specific correctness evidence.