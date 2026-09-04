# End-to-End Workflow

## Trigger
Webhook feature work, security review, duplicate-delivery incident, signature failure, provider migration, or relevant code review.

## Entry conditions
Repository is readable; target boundary can be identified; provider contract is available or can be obtained safely.

## Inputs
Task description, repository, provider signing contract, optional logs/incident evidence.

## Stages

### 1. Context — Repository Explorer
- Run pre-task scan.
- Locate route, parser/middleware, verifier, replay state, side effects, tests.
- Produce boundary map and evidence.

**Checkpoint:** provider signing payload and raw-body ownership are known. If not, stop as `blocked`.

### 2. Plan — Implementation Agent
- Convert confirmed findings into minimal acceptance criteria.
- Identify test matrix and replay semantics.
- Detect approval-required changes before editing.

**Approval point:** production config/secrets, deployment, infrastructure, breaking contracts, destructive changes, or weakened controls require explicit human approval and stop autonomous execution.

### 3. Execute — Implementation Agent
- Apply smallest safe change.
- Add/adjust focused tests.
- Do not perform approval-required actions.

### 4. Deterministic checks — Implementation Agent
- Run static scan.
- Run package unit tests.
- Run replay-window fixture where relevant.
- Run host formatter/build/tests.
- Generate evidence JSON.

### 5. Independent verification — Verification Agent
- Validate evidence.
- Inspect exact signing bytes, comparison, freshness, replay atomicity, ordering, duplicate semantics, and secret hygiene.
- Re-run relevant tests independently.

### 6. Complete
Set status to `verified` only when Definition of Done is met.

## Retry policy
Maximum two implementation retries total.

Retryable failures: focused test failure caused by the current change, deterministic finding with a clear local correction, formatter/build error caused by the current diff.

Not retryable without escalation: missing provider semantics, permissions, production-only state required for proof, approval-required actions, ambiguous ownership demanding broad architecture changes.

Preserve on every retry: failing command, output, scan JSON, changed files, hypothesis, and corrective action.

## Failure paths
- Validation failure → stop and preserve evidence.
- Tool transient failure → retry once, then stop.
- Permission failure → stop; no privilege escalation.
- Security requirement cannot be proven → `blocked`, not `verified`.
- Two failed implementation retries → stop with unresolved evidence.

## Definition of Done
- Boundary map exists.
- Provider semantics are evidenced.
- Raw-body/signature/freshness/replay behavior is proven.
- Duplicate handling is tested.
- Deterministic and host checks pass.
- Evidence validates.
- Independent verifier records `verified`.
- No approval blocker remains.
