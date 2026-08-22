# Webhook Replay Idempotency Workflow

## Trigger
A webhook endpoint is introduced/changed, duplicate side effects are observed, or provider/queue retry behavior changes.

## Entry conditions
Repository is readable; webhook/provider is identifiable; production mutation is not required for investigation.

## Inputs
Endpoint/consumer, provider event-ID semantics, signature rules, acceptance criteria, retention/retry requirements.

## Flow
`Trigger -> Explore -> Plan -> Implement -> Test -> Independent Verify -> Approval (if required) -> Complete`

### 1. Explore — Repository Explorer
Run `skills/investigate-webhook-path.md`. Produce evidence map. Checkpoint: stable key, first side effect, retry sources and atomic primitive are known. If not, status `blocked`.

### 2. Plan — Implementation Agent
Choose claim storage and transaction boundary. Explicitly document crash behavior and whether stale recovery is safe. Any schema or production configuration change creates an approval checkpoint before application, not before local code preparation.

### 3. Implement — Implementation Agent
Follow `skills/implement-idempotency.md` and `rules/safety.md`. Add focused tests. Status is `executed`, never `verified`, after editing.

### 4. Test
Run project build/tests plus package tests. Deterministic assertion failures require diagnosis/change before rerun. Transient tool/environment failures may retry twice; preserve command, stderr/stdout and exit code for each attempt. Third failure => `blocked`.

### 5. Verify — Verification Agent
Independently inspect diff and rerun relevant checks. Verify concurrent duplicate, completed duplicate, mismatched key/hash, signature ordering and crash-window behavior. Failure returns once to implementation; maximum two implementation/verification cycles. Preserve both verification reports. After the second failed cycle => stop and escalate.

### 6. Approval
Explicit human approval is mandatory before production deployment/configuration, schema application, destructive cleanup, security weakening or irreversible migration. Permission failure is not a reason to increase privileges.

### 7. Complete
Status `verified` only when all checks pass and required approvals are recorded.

## Failure paths
- Missing stable key: block and request an explicit composite-key contract.
- No atomic storage primitive: block; do not emulate with race-prone check-then-insert.
- Build/test failure: preserve evidence and return to implementation within retry bounds.
- Tool/environment transient failure: maximum two retries.
- Permission failure: stop; escalate to authorized human.
- Business ambiguity about duplicate response: block until acceptance behavior is defined.

## Produced artifacts
Evidence map, implementation diff, test evidence, verification result, residual-risk note and approval record when applicable.

## Definition of Done
Stable key documented; authenticity precedes claim; claim is atomic; key is payload-bound; duplicates do not repeat side effects; mismatch is rejected; crash/recovery behavior is tested; relevant build/tests pass; independent verification passes; unrelated changes are absent; approvals exist for any dangerous action; no blocking risk remains undocumented.
