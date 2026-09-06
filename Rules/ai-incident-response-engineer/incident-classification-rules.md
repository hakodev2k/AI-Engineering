# Incident Classification Rules

## Purpose
Define a consistent way to identify and classify AI incidents so response effort, authority, and evidence requirements match actual risk.

## Scope
Applies to incidents involving model behavior, prompts, agents, tools, AI-generated content, model providers, inference systems, retrieval systems, or AI-enabled workflows.

## MUST
- Every suspected incident MUST be classified by affected capability, failure mode, blast radius, user impact, data sensitivity, and reversibility.
- Classification MUST distinguish reliability failure, security compromise, privacy exposure, harmful output, policy breach, model regression, dependency failure, and agent/tool misuse when applicable.
- The responder MUST record the evidence supporting the classification and identify important unknowns.
- Classification MUST be revised when new evidence materially changes impact or scope.
- Safety- or security-relevant uncertainty MUST bias toward containment and escalation until bounded.
- Multi-category incidents MUST retain every material category rather than forcing a single label.

## MUST NOT
- Incidents MUST NOT be downgraded solely because impact has not yet been publicly observed.
- A model-quality issue MUST NOT be treated as harmless when it can trigger privileged actions, expose data, or cause unsafe decisions.
- Classification MUST NOT rely only on agent confidence, anecdotal reports, or unverified assumptions.

## SHOULD
- Teams SHOULD use a stable incident taxonomy that maps to ownership, playbooks, and escalation paths.
- Classification criteria SHOULD include both current impact and credible worst-case impact.

## Exceptions
A temporary classification may be used during fast-moving response, but the incident record must state the uncertainty, evidence gap, review time, and responsible reviewer.

## Verification
Review the incident record for explicit category, impact, scope, evidence, unknowns, and classification changes. Verify that escalation and containment decisions match the recorded classification.