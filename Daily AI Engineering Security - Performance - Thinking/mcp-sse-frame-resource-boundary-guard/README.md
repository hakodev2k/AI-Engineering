# MCP SSE Frame Resource Boundary Guard

**Category:** Security  
**Run date:** 2026-09-03 (UTC+7)

## Problem
Remote MCP servers can exploit unbounded Server-Sent Events buffering by streaming bytes without the event delimiter, causing client memory exhaustion. CVE-2026-53965 in the official MCP PHP SDK is a current concrete example.

## Evidence
See `evidence/research.md` for observed public evidence, interpretation, existing approaches, limitations, and sources.

## Existing approach
Upgrade vulnerable SDKs, use runtime/container memory limits, proxy limits, and transport-specific caps.

## Existing limitations
Process-level memory limits terminate rather than safely reject; proxies may not bound decoded parser buffers; custom transports and forks can reproduce the same class; silent disconnects are insufficient without telemetry.

## Proposed improvement
Make parser-layer resource limits explicit and verifiable: incomplete-frame cap, total-stream cap, idle timeout, abort-on-overflow, structured telemetry, bounded reconnects, and offline adversarial regression tests.

## Architecture
- `config/policy.json` — production policy defaults.
- `evidence/research.md` — research record.
- `skills/sse-boundary-audit.md` — audit procedure.
- `rules/transport-resource-boundaries.md` — enforceable rules.
- `subagents/transport-security-verifier.md` — independent verifier.
- `workflows/measure-remediate-verify.md` — bounded remediation workflow.
- `hooks/preflight-boundary-check.md` — deterministic completion gate.
- `scripts/sse_boundary_probe.py` — offline frame-boundary probe.
- `tests/test_sse_boundary_probe.py` — regression tests.
- `tests/fixtures/valid.sse` — valid events.
- `tests/fixtures/delimiter-free.bin` — adversarial fixture.
- `tests/fixtures/test-policy.json` — low-limit test policy.

## Installation
Python 3.10+; standard library only.

## Usage
```bash
python scripts/sse_boundary_probe.py --policy tests/fixtures/test-policy.json --fixture tests/fixtures/delimiter-free.bin --chunk-size 16
python -m unittest tests/test_sse_boundary_probe.py
```

## Metrics
Peak incomplete-frame bytes, stream bytes at abort, abort latency, valid-stream pass rate, bounded retry count, structured overflow telemetry presence.

## Verification
**Implemented:** deterministic offline probe, policy, rules, and tests.  
**Measured:** before/after transport behavior using identical fixtures.  
**Verified:** adversarial input is rejected at the configured boundary, valid SSE still passes, dependency is outside known vulnerable ranges, and independent verifier returns PASS.

## Safety
Do not fuzz production endpoints or exhaust host memory. Do not weaken TLS, authentication, sandboxing, or trust controls for testing.

## Failure handling
Maximum two remediation iterations. If boundaries still fail, pin/upgrade to a known-safe SDK, disable the affected remote transport where feasible, preserve evidence, and escalate.

## Definition of Done
Evidence documented; vulnerable versions removed; parser-level bounds enforced before excess allocation; overflow aborts with telemetry; normal SSE tests pass; retry behavior is bounded; independent verification passes; no secrets exposed.
