# Workflow: Enforce and Escalate

## Trigger
A network-capable tool is about to execute.

## Goal
Authorize the exact external interaction before contact and freeze escalation paths when policy violations repeat.

## Inputs
Tool name, destination, protocol, action class, session denial count, approval record, policy version.

## Baseline
Measure current coverage: percentage of network-capable tool calls that bypass deterministic pre-egress checks, unknown-destination contact rate, and approval-binding coverage.

## Context
Use only the current task authorization scope and relevant destination metadata.

## Stages
1. **Observe** — normalize tool request into destination/protocol/action.
2. **Measure baseline** — record whether a policy rule exists and the current incident counter.
3. **Diagnose** — classify trusted, task-authorized, unknown, explicitly denied, private/link-local, or redirected.
4. **Form hypothesis** — determine whether an existing rule safely covers the request or a new approval is necessary.
5. **Enforce** — run `scripts/egress_gate.py` before the external call.
6. **Decision** — allow only on exit 0; request approval on exit 4; block on exit 5; freeze on exit 6.
7. **Measure again** — record decision and ensure no network action occurred before authorization.
8. **Verify** — independent verifier checks high-impact or newly authorized destinations.

## Responsible agent
Runtime policy controller; Security Verifier independently validates changes and incidents.

## Tools
`config/egress-policy.json`, `scripts/egress_gate.py`, local logs with redaction, and the host's pre-tool hook mechanism.

## Outputs
Decision, matched rule, normalized destination, redacted audit event, updated denial count, and approval request when required.

## Checkpoints
- Before DNS/HTTP/browser/shell network execution.
- Before following redirects.
- Before submitting credentials or creating external identity.
- After every denied attempt.

## Metrics
Gate coverage, denied-contact leakage, approval mismatch blocks, freeze activation accuracy, and time-to-detect.

## Retry policy
At most one normalization retry for malformed input. Denied external actions are not retried automatically. Approval may be requested once per unique destination/action/policy tuple.

## Stop conditions
Stop and freeze after configured repeated denials or immediately on an attempted explicitly denied private/metadata target with high-impact action.

## Failure path
If destination cannot be derived deterministically, fail closed and require instrumenting the tool adapter. If the gate crashes, block the external action.

## Verification
Run benign, unknown, redirect, private-IP, stale-approval, and repeated-denial fixtures without contacting real unauthorized systems.

## Definition of Done
100% pre-egress coverage, adversarial fixtures pass, approvals are action-bound and time-bound, logs are redacted, and no blocking finding remains.