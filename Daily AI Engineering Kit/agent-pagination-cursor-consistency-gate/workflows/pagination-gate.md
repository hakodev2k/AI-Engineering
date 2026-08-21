# Workflow: Pagination Cursor Consistency Gate

## Trigger
New/changed pagination, cursor, ordering or list-query behavior; duplicate/missing-row bug; pagination performance incident.

## Entry conditions
Scope and acceptance criteria are available; repository can be read; production mutation is not required.

## Inputs
Endpoint(s), changed files, API contract, gate config and relevant tests.

## Flow
`Trigger → Scan → Trace → Reproduce → Decide → Implement → Test → Independent Verify → Complete`

### 1. Scan — Pagination Investigator
Run the deterministic scanner and preserve JSON output. Static hits are hypotheses.

### 2. Trace — Pagination Investigator
Trace request/cursor/query/order/response. Produce facts, hypotheses, evidence and open questions.

### 3. Reproduce — Pagination Investigator
Create a focused test/fixture for equal sort values, boundary transition, invalid cursor, bounded page size and termination as applicable.

**Checkpoint:** do not edit until a defect is evidenced or a requirement explicitly demands change.

### 4. Decide
Classify `no-defect`, `safe-change`, `needs-approval`, or `blocked`. Breaking API/cursor semantics, schema or production configuration requires explicit approval.

### 5. Implement — Pagination Implementer
Make the smallest correction. Preserve public behavior unless approved. Add/adjust focused tests.

### 6. Test — Pagination Implementer
Run focused tests and project build/test commands. Preserve command output.

### 7. Independent Verify — Pagination Verifier
Run final-verification hook and inspect diff against original acceptance criteria.

## Retry rules
Transient tool failures: maximum 2 retries, preserving error output. Test/build failures caused by a change: maximum 1 correction cycle. Never rerun an unchanged failing command repeatedly. Permission/approval failures are not retryable.

## Failure paths
Environment/tool failure → preserve evidence → retry if transient → stop after limit. Validation failure → return once to implementer → stop if still failing. Approval boundary → stop before dangerous action. Business-semantic ambiguity → `needs-approval`/human decision.

## Produced artifacts
Scanner JSON, reproduction/test evidence, implementation diff when needed, verifier status and remaining-risk notes.

## Definition of Done
Scope traced; total ordering proven; cursor/page-size/progress rules verified; relevant tests/build pass; no unrelated changes; approvals exist where required; verifier status is `verified`; no blocking risk remains.
