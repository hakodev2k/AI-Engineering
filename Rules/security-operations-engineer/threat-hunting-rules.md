# Threat Hunting Rules

## Purpose
Make threat hunting hypothesis-driven, evidence-based, and operationally useful.

## Scope
Proactive hunts across endpoint, identity, cloud, network, email, and application telemetry.

## MUST
- Every hunt MUST state a threat hypothesis, required data, scope, time window, and success or exit criteria.
- Findings MUST distinguish confirmed malicious activity, suspicious activity, benign explanation, and unresolved uncertainty.
- Repeated hunt findings MUST be converted into durable detections, hardening actions, or accepted risk where appropriate.
- Material evidence MUST be preserved before containment actions alter it.

## MUST NOT
- MUST NOT present keyword searching alone as a completed hunt without an explicit hypothesis.
- MUST NOT claim environment-wide absence of a threat when telemetry coverage is incomplete.

## SHOULD
- Hunts SHOULD prioritize high-impact techniques, crown-jewel assets, and known visibility gaps.

## Exceptions
Exploratory hunts may begin with weaker hypotheses but must document scope and limitations.

## Verification
Review hunt plans, queries, evidence, conclusions, coverage limitations, and resulting detection or remediation work.