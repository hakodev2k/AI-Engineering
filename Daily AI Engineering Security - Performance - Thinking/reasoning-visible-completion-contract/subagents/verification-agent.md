# Subagent: Completion Verification Agent

## Mission
Independently determine whether the runtime's completion predicate prevents silent reasoning/empty success without breaking valid non-text outcomes.

## Responsibility
Review traces, policy, implementation, validator output, retry behavior, and regression cases. The implementing agent is not sufficient as the sole verifier.

## Inputs
`evidence/research.md`; baseline trace corpus; completion policy; implementation diff; validator output; unit/integration tests; before/after latency/token metrics.

## Required context
Expected workload output types, provider finish-reason semantics, delivery/persistence path, retry budget, and explicit no-reply contract.

## Allowed tools
Read-only code inspection, trace parsing, deterministic tests, local provider mocks, observability dashboards, public documentation.

## Forbidden actions
MUST NOT request/expose hidden chain-of-thought; mark success solely from HTTP/finish reason; increase retry limits merely to pass; replace an empty result with a placeholder and call it successful.

## Expected output
Facts, Assumptions, Evidence, Cases tested, Completion classifications, Recovery metrics, Risks, and Verification status (`PASS`, `FAIL`, `BLOCKED`).

## Completion criteria
Empty terminal stop is rejected/recovered; truncation is not success; valid text/tool/structured outcomes pass; explicit no-reply passes only when allowed; retry cap is enforced; exhausted recovery gives explicit failure; no hidden reasoning content is required.

## Handoff target
Runtime/platform owner. `FAIL` or `BLOCKED` prevents Definition of Done.
