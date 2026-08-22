# MCP Server Lifecycle Leak Regression Guard

**Category:** Performance

## Problem
Stateless MCP serving has a lifecycle-performance trap. Fresh server/protocol construction per request can be expensive under sustained traffic, yet reusing a protocol-bearing `McpServer` can violate isolation assumptions or accumulate close handlers. A current v2 report shows accidental reuse through `createMcpHandler` growing an `onclose` chain until memory growth and delayed stack overflow after tens of thousands of requests.

## Evidence
See `evidence/research.md` for current public issues, SDK documentation, the earlier transport-close failure signal, and the server/transport sharing security advisory.

## Existing approach
The documented stateless pattern is a fresh server per request with safe shared dependencies outside the factory. Some production users report allocation/GC pressure and may be tempted to reuse the server itself.

## Existing limitations
Status-code-only load tests do not detect retained callback chains or teardown crashes. Reuse can appear healthy for thousands of requests. Conversely, measuring only object allocation does not identify which dependencies can be safely shared without reusing protocol-bearing state.

## Proposed improvement
Use a fail-fast test wrapper that detects repeated server-object identity, benchmark lifecycle metrics after warmup, require explicit teardown, analyze heap growth/error/p95 against policy thresholds, and move only safe dependencies such as pools/caches/configuration outside the per-request server factory.

## Architecture
- `evidence/research.md` — observed evidence, interpretations, current approach, root causes.
- `config/thresholds.json` — benchmark gates.
- `scripts/fresh_factory_guard.mjs` — detects accidental singleton server reuse immediately.
- `scripts/analyze_lifecycle.py` — validates JSONL metrics and teardown evidence.
- `tests/test_analyzer.py` — deterministic pass/block regression test for the analyzer.
- `rules/lifecycle-performance-rules.md` — enforceable lifecycle/performance requirements.
- `skills/lifecycle-benchmark.md` — measurement/diagnosis procedure.
- `subagents/performance-verifier.md` — independent verification role.
- `workflows/benchmark-and-verify.md` — bounded Measure → Diagnose → Optimize → Measure loop.
- `hooks/pre-release-lifecycle-gate.md` — release-blocking analyzer integration.

## Installation
Python 3.10+ is sufficient for the analyzer. `fresh_factory_guard.mjs` uses standard JavaScript/Node features and has no package dependencies.

## Configuration
Adjust `config/thresholds.json` only against an established baseline and documented production requirement. Keep `require_unique_server_instance_per_request=true` for the documented stateless `createMcpHandler` lifecycle unless the target SDK explicitly establishes another safe contract.

## Usage
Wrap the factory in test/staging code:

```js
import { requireFreshFactory } from './scripts/fresh_factory_guard.mjs';
const guardedFactory = requireFreshFactory((context) => buildServer(context, sharedDbPool));
const handler = createMcpHandler(guardedFactory);
```

Generate benchmark JSONL records with `request`, `server_id`, `heap_used_mb`, `latency_ms`, `ok`, followed by a teardown record. Analyze:

`python3 scripts/analyze_lifecycle.py artifacts/lifecycle-after.jsonl --thresholds config/thresholds.json --baseline-p95-ms 12.4`

Validate analyzer behavior:

`python3 tests/test_analyzer.py`

## Workflow
Follow `workflows/benchmark-and-verify.md`: observe → baseline → diagnose → form hypothesis → implement safe improvement → measure again → independently verify. Maximum two correction cycles.

## Metrics
Heap growth MB per 1,000 measured requests, p95 latency and regression percentage, error rate, duplicate server-instance count, clean teardown, and optional throughput. Record SDK/Node versions, workload, concurrency, and resource limits alongside results.

## Verification
### Implemented
This package includes deterministic factory-reuse detection, metric analysis, thresholds, tests, rules, workflow, release hook, and independent verifier instructions.

### Measured
The package does not claim a universal performance gain. The target implementation must capture baseline and after measurements using the same workload/environment where feasible.

### Verified
`subagents/performance-verifier.md` must confirm workload comparability, zero unsafe reuse, threshold compliance, clean teardown, and preserved isolation/security.

## Safety
Do not reduce memory pressure by sharing server/transport instances in conflict with SDK lifecycle guidance. Do not trade cross-client isolation for throughput. Do not hide failure with periodic process restarts or threshold inflation.

## Failure handling
Retain raw JSONL and teardown logs. A deterministic lifecycle failure is not retried automatically. Suspected benchmark noise may be rerun at most twice. Persistent failures require a new evidence-backed hypothesis; after two correction cycles, stop and escalate.

## Definition of Done
- Current evidence and existing approaches documented.
- Baseline workload/environment captured.
- Factory object identity instrumented.
- No duplicate server identities under fresh-per-request policy.
- Safe shared dependencies separated from protocol-bearing state.
- Required measured request count reached after warmup.
- Heap/error/p95 thresholds pass.
- Explicit teardown is clean with no `RangeError` or unhandled rejection.
- Independent verifier returns `verified`.
- Security/client-isolation boundaries remain unchanged or stronger.
- No blocking finding remains.

## Customization
For sessionful deployments, adapt identity expectations to one server/transport per session rather than per request, while preserving the same principle: lifecycle ownership must match the documented protocol contract and benchmark teardown must be explicit.