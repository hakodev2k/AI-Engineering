# Workflow: Log Redaction Gate

## Trigger
A change can affect logging, tracing, telemetry enrichment, exception serialization, request/response capture, or incident artifact generation.

## Entry conditions
Repository and policy readable; safe representative data can be constructed.

## Stages
1. **Pre-task** — validate repo, policy, and safe fixture boundary.
2. **Explore** — Log Exposure Explorer maps sources, sinks, and sensitive fields.
3. **Plan** — Redaction Planner selects smallest safe control.
4. **Approval checkpoint** — intentional sensitive logging, production config, secret or infrastructure changes stop for human approval.
5. **Implement** — implementation owner makes the minimal change and tests.
6. **Scan** — run `scripts/log_redaction_gate.py` against representative outputs.
7. **Host verify** — build, unit/integration tests, lint/static checks as applicable.
8. **Review** — inspect diff for newly introduced logging surfaces.
9. **Independent verify** — Verification Agent reviews evidence.
10. **Complete** — only when Definition of Done passes.

## Produced artifacts
Exposure findings, implementation plan, sanitized samples, scanner report, test/build evidence, verification record.

## Retry rules
Transient tool/sample generation failure: max 2 retries. Build/test/redaction failure: max 2 implementation cycles. Approval/permission failure: no automatic retry.

## Failure paths
Invalid policy, unknown production payload shape, real-secret fixture discovery, exceeded retries, verifier disagreement, or unapproved dangerous action blocks completion.

## Definition of Done
All affected sinks assessed; no forbidden raw secrets; deterministic scanner passes approved outputs; tests/build pass; independent verification is `verified`; remaining risk is recorded.