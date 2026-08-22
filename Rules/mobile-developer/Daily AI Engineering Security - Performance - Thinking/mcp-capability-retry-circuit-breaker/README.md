# MCP Capability Retry Circuit Breaker

**Category:** Performance

## Problem
Optional MCP capability mismatches and refresh failures can become perpetual retry loops. Recent Codex reports show idle app-servers repeatedly calling unsupported resource methods and burning CPU/I/O, while related UI retry loops remain hot instead of converging to a stable degraded state.

## Evidence
See `evidence/research.md` for current public signals, observed measurements, existing approaches, limitations, and source links.

## Existing approach
Hosts negotiate capabilities and often wrap discovery calls in generic retry/backoff logic.

## Existing limitations
Generic retries do not distinguish deterministic protocol incompatibility from transient transport failure. Unsupported-state memory can also be lost across refresh subsystems.

## Proposed improvement
Maintain per-server/per-method capability state and a semantic circuit breaker. Treat `-32601` as terminal for the current capability epoch, use bounded backoff for transient faults, coalesce duplicate refreshes, and verify idle quiescence.

## Architecture
- `skills/capability-failure-classification.md`: evidence-driven classifier.
- `rules/retry-rules.md`: enforceable retry and breaker rules.
- `subagents/retry-auditor.md`: independent verifier.
- `workflows/measure-diagnose-break-verify.md`: baseline/optimization workflow.
- `hooks/post-failure-retry-gate.md`: deterministic retry gate.
- `scripts/retry_trace_analyzer.py`: machine-checkable budget validator.
- `evidence/research.md`: current evidence.

## Installation
Python 3.9+ is sufficient for the analyzer. Integrate the post-failure gate in the MCP host after response classification but before retry scheduling.

## Configuration
Define server identity, capability epoch, transient maximum attempts, backoff range, and idle resource SLO. Default transient maximum in this package is 4 attempts; tune only with measured evidence.

## Usage
Record retry decisions as JSONL with `server`, `method`, `epoch`, and `class`, then run:

`python3 scripts/retry_trace_analyzer.py retry-events.jsonl --transient-max 4`

Exit 0 passes, 2 indicates malformed input, and 3 indicates a retry-policy violation.

## Workflow
Measure baseline → classify failures → form hypothesis → implement breaker/backoff → replay failures → measure idle state → independent audit. Maximum two implementation cycles.

## Metrics
Requests/minute, errors/minute, attempts per server/method/epoch, time-to-quiescence, CPU%, I/O bytes, WAL/log writes, transient recovery rate.

## Verification
A terminal unsupported method must execute at most once per capability epoch. Transient failures must stop at the configured limit and recover correctly if a later attempt succeeds. Post-change idle CPU/I/O and request rate must improve against baseline.

## Safety
Never suppress authentication, permission, or required-capability failures as optional unsupported methods. Capability epoch changes must allow reprobe. Do not disable security checks to reduce retry cost.

## Failure handling
Detection comes from the hook/analyzer or idle SLO. Keep evidence and breaker state. Maximum two remediation cycles. If a required capability is ambiguous or post-change metrics do not improve, stop and escalate rather than widening retries indefinitely.

## Implemented / Measured / Verified
**Implemented**: classifier, breaker integration, and diagnostics exist. **Measured**: baseline and post-change metrics exist. **Verified**: replay tests, idle SLO, and independent Retry Auditor all pass.

## Definition of Done
Evidence documented; baseline captured; failure classes established; unsupported retry path blocked; transient retries bounded; duplicate refreshes controlled; before/after metrics recorded; no required capability suppressed; analyzer passes; independent audit passes; no blocking issue remains.

## Customization
Add provider/host-specific failure mappings, persistent capability-state storage, and observability exporters while preserving terminal classification and bounded-loop guarantees.