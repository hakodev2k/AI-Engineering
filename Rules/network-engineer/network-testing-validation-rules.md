# Network Testing and Validation Rules

## Purpose
Require evidence that network behavior matches design before relying on it in production.

## Scope
Pre-change testing, acceptance, reachability, security, performance, failover, and regression validation.

## MUST
- Derive tests from intended traffic flows, security boundaries, failure scenarios, and service objectives.
- Validate both permitted and prohibited connectivity where security policy is material.
- Capture baseline and post-change evidence for high-impact changes.
- Test from representative endpoints or vantage points rather than network devices alone.

## MUST NOT
- Declare success from configuration syntax or control-plane state without relevant data-plane/service validation.
- Run disruptive production tests without approved scope and safeguards.

## SHOULD
- Automate deterministic reachability, policy, DNS, latency, and failover checks.

## Exceptions
Where production testing is unsafe, use representative staging/lab evidence and explicitly record residual uncertainty.

## Verification
Review test cases, expected outcomes, captured results, negative tests, telemetry, and approval for disruptive tests.