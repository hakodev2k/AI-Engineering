# Incident Response

## Purpose
Restore safe gateway service quickly while preserving evidence and controlling risky actions.

## Scope
Gateway outages, routing failures, security events, saturation, certificate failures, and dependency incidents.

## MUST
- Incident actions MUST prioritize containment and service restoration according to declared severity and authority.
- Changes during an incident MUST be recorded with actor, reason, time, and observed result.
- Diagnosis MUST use available logs, metrics, traces, configuration history, and traffic evidence.
- Destructive or security-weakening actions MUST require explicit authorized human approval unless an established emergency procedure already grants that authority.

## MUST NOT
- MUST NOT make multiple untracked speculative changes that destroy causal evidence.
- MUST NOT conceal gateway-generated errors as upstream failures.
- MUST NOT leave emergency bypasses in place without owner and expiry.

## SHOULD
- Hypotheses SHOULD be tested with the smallest reversible action that can discriminate between causes.
- Recovery SHOULD be followed by validation of critical routes.

## Exceptions
Emergency authority must be bounded by documented incident procedure and reviewed afterward.

## Verification
Review incident timeline, telemetry, config/commit history, approvals, restoration checks, and removal of temporary controls.