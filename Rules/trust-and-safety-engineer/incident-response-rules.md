# Trust and Safety Incident Response Rules

## Purpose
Contain rapidly evolving abuse incidents while preserving evidence, limiting collateral harm, and coordinating safe recovery.

## Scope
Applies to severe abuse spikes, coordinated attacks, control failures, policy incidents, compromised enforcement systems, and safety-impacting outages.

## MUST
- Safety incidents MUST define severity, incident owner, affected surfaces, known harm, immediate containment actions, and communication channels.
- Response decisions MUST distinguish confirmed facts, working hypotheses, and unknowns.
- Containment actions that materially restrict users or alter production enforcement MUST be reversible where technically possible and require appropriate human approval.
- Relevant logs, detector outputs, policy versions, enforcement records, and timeline evidence MUST be preserved according to privacy and retention requirements.
- Incident response MUST monitor both abuse reduction and collateral effects from mitigations.
- Severe incidents MUST produce a post-incident review covering root causes, detection gaps, control failures, recovery, and preventive actions.

## MUST NOT
- MUST NOT make destructive production changes, mass account actions, or broad policy exceptions without explicit authority.
- MUST NOT delete or overwrite evidence needed to understand the incident.
- MUST NOT declare resolution based only on reduced alert volume when instrumentation or attacker adaptation may explain the change.
- MUST NOT assign individual blame in place of analyzing system and process causes.

## SHOULD
- Incidents SHOULD use predefined containment playbooks for recurring abuse classes.
- Mitigations SHOULD start with the smallest effective blast radius and expand only with evidence.
- Post-incident actions SHOULD have owners and measurable completion criteria.

## Exceptions
When imminent serious harm requires immediate containment, authorized responders MAY act before complete evidence collection. Actions MUST still be logged, scoped, and reviewed as soon as conditions stabilize.

## Verification
Inspect incident timelines, approval records, preserved evidence, mitigation diffs, dashboards, post-incident reviews, and follow-up completion. Confirm both attacker impact and legitimate-user impact were evaluated.