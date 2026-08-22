# Redirect Credential Leak Response

## Trigger
Unexpected redirect in an authenticated client, security finding, endpoint/proxy change, or redirect-related dependency upgrade.

## Entry conditions
Repository is readable; evidence can be collected without exposing real secrets; expected destination ownership is known or can be documented as unknown.

## Inputs
Entry URL, affected client/component, sanitized traces, policy, acceptance criteria.

## Flow
`Trigger -> Investigate -> Confirm -> Implement -> Test -> Independent Verify -> Complete`

### 1. Investigate — Security Investigator
Follow `skills/investigate-redirect-chain.md`. Produce sanitized chain and gate report. Checkpoint: root cause must be confirmed before editing security behavior.

### 2. Plan — Implementation Agent
Select the smallest remediation. Any allowlist expansion, production config, network, secret, or infrastructure change is an approval point and stops execution.

### 3. Implement and test — Implementation Agent
Follow `skills/remediate-and-verify.md`. Maximum two test-fix cycles. Preserve failing test output and gate reports for each cycle.

### 4. Verify — Verification Agent
Re-run reproduction and safety checks independently. Verification failure may return once to implementation if the remaining change is within the already approved scope.

## Retry rules
Transient tool failures: retry twice. Test-fix cycles: maximum two. Independent-verification remediation return: maximum one. Permission failures are not retryable. Repeated failures preserve evidence and escalate.

## Failure paths
Incomplete evidence -> `blocked`. Confirmed leak without safe in-scope fix -> `escalated`. Build/test regression after retry budget -> `failed`. Approval-required action -> `awaiting-approval`.

## Produced artifacts
Sanitized chain JSON, `redirect-gate-report.json`, regression tests, implementation diff, test output, verification decision.

## Definition of Done
The leak path is confirmed or disproved with evidence; if confirmed, the minimal fix exists; regression and relevant broader tests pass; fresh gate report passes for accepted behavior; independent verification is `verified`; no real secret is persisted; no approval-required action remains unapproved; residual risks are documented.
