# Poison Message Quarantine Gate Workflow

## Trigger
Repeated delivery failure, growing dead-letter queue, consumer retry storm, or a code change affecting message handling/retry/acknowledgement.

## Entry conditions
Repository is readable; evidence is sanitized; queue/provider and target consumer are identified.

## Inputs
Failure evidence, consumer scope, acceptance criteria, `config/gate.yaml`.

## Flow
`Trigger → Explore → Classify → Plan → Implement → Test → Independent Verify → Complete/Blocked`

### 1. Explore — Queue Explorer
Run the scanner and trace handler, retry, acknowledgement, side effects, idempotency and dead-letter behavior. Produce evidence, not edits.

### 2. Classify — Queue Explorer
Classify failure categories and identify whether retry can change the outcome. Checkpoint: unknown classification blocks automatic remediation.

### 3. Plan — Implementation Agent
Choose the smallest change. Explicitly list changed files, test cases and any approval boundary.

### 4. Implement — Implementation Agent
Apply bounded retry/quarantine behavior and tests. No production action.

### 5. Test — Implementation Agent
Run focused tests, then relevant broader suite. A test failure may be fixed and retried at most 2 implementation cycles. Preserve the first and latest failure evidence.

### 6. Verify — Verification Agent
Independently inspect diff and rerun evidence-producing checks. Verification commands may be retried once only for clearly transient tool/environment failure; deterministic failure is not retryable.

## Approval points
Production replay, deletion, broker retention/retry changes, infrastructure/config/secret changes, schema-breaking changes and deployment require explicit human approval and stop the agent before execution.

## Failure paths
- Transient tool failure: one verification retry, then blocked.
- Build/test failure: maximum two implementation cycles, then failed.
- Permission failure: blocked; never escalate permissions silently.
- Unknown business semantics or idempotency: blocked before replay recommendation.

## Definition of Done
Consumer path and failure classification are evidenced; retry is finite; terminal quarantine exists; sensitive payloads are not persisted; duplicate/replay safety is tested; acknowledgement ordering is verified; relevant tests/build pass; independent verifier returns `verified`; remaining risks and required approvals are documented.