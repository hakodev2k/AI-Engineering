# Incident Response

## Purpose
Contain blockchain incidents quickly while preserving evidence and minimizing irreversible harm.

## Scope
Exploits, key compromise, oracle failures, bridge incidents, insolvency, abnormal transactions, and protocol emergencies.

## MUST
- Define incident severity, decision authority, communication paths, and emergency controls before production launch.
- Preserve transaction, block, log, configuration, and signing evidence during investigation.
- Separate containment hypotheses from confirmed root cause.
- Evaluate pause, rate-limit, key-revocation, and user-protection actions against their own risks.
- Require authorized human approval for production emergency actions unless a pre-approved automated safety control is explicitly defined.

## MUST NOT
- Destroy evidence or rewrite history to conceal an incident.
- Rotate keys, pause systems, or move funds outside established authority merely on agent confidence.
- Publish unverified attribution as fact.

## SHOULD
- Rehearse high-impact scenarios and maintain tested runbooks.

## Exceptions
Immediate automated containment requires pre-defined triggers, bounded authority, monitoring, and post-action review.

## Verification
Review drills, runbooks, emergency permissions, incident timelines, forensic evidence, and post-incident corrective actions.