# Threat Modeling Rules

## Purpose
Identify how products, features, and controls can be abused before incidents expose those weaknesses at scale.

## Scope
Applies to new features, major changes, abuse-prone workflows, adversarial capabilities, and trust boundaries.

## MUST
- Abuse threat models MUST identify actors, assets, incentives, entry points, trust boundaries, likely abuse paths, and expected impact.
- High-risk launches MUST define mitigations, residual risk, monitoring, and escalation before production exposure.
- Threat models MUST consider both single-user misuse and coordinated or automated abuse when technically feasible.
- Assumptions about attacker cost, scale, identity, or sophistication MUST be explicit and revisited when evidence changes.
- Trust boundaries involving user-generated content, identity, payments, messaging, external links, or privileged actions MUST be reviewed for abuse amplification.
- Threat models MUST distinguish prevent, detect, contain, recover, and investigate controls.

## MUST NOT
- MUST NOT assume normal-user workflows represent adversarial behavior.
- MUST NOT treat absence of historical incidents as evidence of low risk.
- MUST NOT omit abuse paths merely because mitigation is difficult.
- MUST NOT approve a high-severity unmitigated threat without documented risk acceptance by the appropriate human owner.

## SHOULD
- Threat models SHOULD use concrete attacker journeys and abuse cases.
- Existing incident learnings SHOULD feed back into future threat models.
- Controls SHOULD be layered so failure of one signal does not create unrestricted abuse.

## Exceptions
Time-critical mitigations MAY precede a complete threat model during an active incident. The full model MUST be completed during stabilization or post-incident review.

## Verification
Review threat-model artifacts, feature architecture, abuse cases, mitigation ownership, residual-risk acceptance, launch gates, and post-launch telemetry. Confirm identified high-severity threats have explicit controls or approved acceptance.