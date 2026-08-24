# Abuse Prevention Rules

## Purpose
Reduce intentional misuse while preserving legitimate access where safely possible.

## Scope
Covers abuse detection, rate controls, policy enforcement, account signals, capability restrictions, and escalation.

## MUST
- Define concrete abuse scenarios, observable signals, response actions, and false-positive risks.
- Apply stronger controls as capability, scale, anonymity, or potential impact increases.
- Evaluate both single-request and cumulative multi-step abuse.
- Maintain an escalation path for emerging abuse patterns not covered by static policy.

## MUST NOT
- Rely solely on keyword blocking for semantically complex high-risk abuse.
- Expose detection logic or thresholds unnecessarily when doing so materially enables evasion.
- Automatically punish users on weak signals without proportional review or safeguards.

## SHOULD
- Combine behavioral, contextual, and rate-based controls where privacy and policy permit.
- Measure both abuse capture and legitimate-use friction.

## Exceptions
Reduced controls require evidence of lower exposure or impact and documented risk acceptance.

## Verification
Inspect abuse test suites, detection metrics, false-positive analysis, enforcement logs, escalation records, and control bypass tests.
