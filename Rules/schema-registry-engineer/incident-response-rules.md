# Incident Response Rules

## Purpose
Contain and resolve schema-registry incidents without compounding data-contract damage.

## Scope
Compatibility failures, bad registrations, registry outages, authorization failures, corrupt state, and client decode incidents.

## MUST
- Incident response MUST identify affected subjects, versions, producers, consumers, and retained data where relevant.
- Mitigation MUST prioritize restoring safe compatibility and decoding behavior over cosmetic recovery.
- Suspected bad schema registrations MUST be investigated using registry history, deployment evidence, and client errors.
- Destructive rollback or deletion actions MUST require explicit human approval unless pre-authorized incident procedures apply.
- Significant incidents MUST record impact, timeline, evidence, mitigation, and corrective actions.

## MUST NOT
- MUST NOT delete schema versions to hide or erase evidence of an incident.
- MUST NOT weaken compatibility or authorization controls broadly without incident authority and bounded scope.
- MUST NOT declare root cause without evidence sufficient to distinguish registry, client, producer, and data failures.

## SHOULD
- Preserve problematic payload samples with appropriate data protections.
- Add regression coverage for confirmed failure modes.

## Exceptions
Emergency actions require minimum necessary scope, auditability, and post-incident review.

## Verification
Review incident records, registry history, deployment logs, payload evidence, approvals, and regression tests.