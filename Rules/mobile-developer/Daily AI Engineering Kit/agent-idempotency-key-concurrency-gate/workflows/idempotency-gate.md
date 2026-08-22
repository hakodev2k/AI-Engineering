# Idempotency-Key Concurrency Gate Workflow

## Trigger
A mutating API/job gains or changes retry behavior, idempotency handling, side effects, persistence, concurrency, or is suspected of duplicate execution.

## Entry conditions
Target operation is identified; repository is accessible; production execution is not required.

## Flow
`Trigger -> Explore -> Model atomicity/crash windows -> Plan -> Implement -> Test -> Independent verify -> Complete`

### 1. Explore — Repository Explorer
Use `skills/investigate-idempotency.md`; run `python scripts/scan-idempotency.py <repo>`. Produce evidence and open questions.

Checkpoint: protected side effects and key ownership mechanism are known. If not, status is blocked.

### 2. Plan — Implementation Agent
Select the smallest fix compatible with current architecture. Any database schema, production config, breaking contract, infrastructure, secret, destructive, or deployment change becomes an approval point and execution stops before that action.

### 3. Implement — Implementation Agent
Follow `skills/implement-safe-idempotency.md`. Add focused tests.

### 4. Test
Run project build and relevant unit/integration tests. Retry a transient tool/environment failure at most 2 times, preserving output from each attempt. Logic/test failures are not blindly retried.

### 5. Verify — Verification Agent
Validate the diff and evidence. If a safe local/test endpoint is available, run `python scripts/concurrency-probe.py <url> --key <key> --body '<json>'`. Never use production without explicit approval.

## Failure paths
- Permission/tool/environment failure: preserve evidence; retry transient failure at most twice; then blocked.
- Validation/build/test failure: diagnose, return to implementation for one scoped correction cycle; after two failed correction cycles, fail and escalate.
- Business ambiguity: blocked; record missing decision.
- Approval-required action: blocked pending explicit approval.

## Definition of Done
All side effects mapped; atomic claim proven; fingerprint mismatch behavior proven; sequential and concurrent replay tests pass; build/relevant tests pass; independent verifier returns pass; no approval blocker or unexplained diff remains.
