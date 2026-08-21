# Skill: Incident Triage and Scoping

## Purpose
Rapidly establish a trustworthy operational picture of an active incident, classify severity, define scope, and create the first bounded response plan without confusing hypotheses with facts.

## Trigger
Use when a production-impacting event, security-adjacent operational failure, customer-impacting degradation, or high-risk unknown is reported.

## Inputs
- Initial alert, ticket, page, or stakeholder report
- Service and dependency context
- Current symptoms, timestamps, affected regions/tenants/users
- Monitoring, logs, traces, dashboards, deployment/change history
- Existing runbooks and ownership map
- Business criticality and known deadlines

## Preconditions
- A single incident identifier exists or is created.
- A named Incident Commander owns coordination.
- Production write actions remain subject to the approval policy.

## Procedure
1. **Capture the trigger exactly.** Record reporter, time, symptom, and source.
2. **Establish facts.** Separate confirmed observations from assumptions and unverified claims.
3. **Bound impact.** Identify affected users, functions, geographies, data, revenue paths, and dependencies.
4. **Assign provisional severity.** Use `knowledge/severity-evidence-and-decision-frameworks.md`; mark it provisional when evidence is incomplete.
5. **Build a change timeline.** Include recent deploys, config changes, migrations, infrastructure events, traffic shifts, certificates, secret rotations, and vendor incidents.
6. **Name the top unknowns.** Prioritize unknowns that can change severity, mitigation, or customer communication.
7. **Create investigation lanes.** Delegate independent hypotheses to separate investigators; do not let several agents duplicate the same query set.
8. **Define immediate safety constraints.** Examples: freeze nonessential deploys, prevent destructive repair, preserve logs, avoid broad data changes.
9. **Set the next synchronization checkpoint.** Normally 10–20 minutes for severe incidents; shorter only when impact changes rapidly.
10. **Produce the initial incident brief.** Use `templates/incident-brief.md`.

## Decisions
- Increase severity when new evidence shows wider user, data, security, or financial impact.
- Reduce severity only after evidence demonstrates sustained recovery and reduced risk.
- Prefer reversible mitigations before irreversible fixes during uncertainty.
- Stop broad investigation when a high-confidence mitigation path is validated and the marginal value of more hypotheses is low.

## Expected outputs
- Initial incident brief
- Provisional severity with evidence
- Impact statement
- Fact / hypothesis / unknown list
- Investigation owners
- Immediate constraints
- Next checkpoint time

## Quality criteria
- Every material claim has a source or is marked as assumption/hypothesis.
- Severity is tied to impact, not emotional urgency.
- Investigation lanes are non-overlapping and have explicit owners.
- The first brief can be understood by someone who did not observe the incident start.

## Verification
- Compare the impact statement against at least two independent signals when possible.
- Confirm ownership and checkpoint time with all active responders.
- Validate the generated incident state with `scripts/incident_validator.py` when JSON state is used.

## Failure handling
- Missing telemetry: record the blind spot, assign an owner, and use alternate evidence.
- Conflicting reports: preserve both, identify authoritative sources, do not average incompatible facts.
- Unknown owner: escalate through service ownership or management path rather than leaving work unowned.
- Tool outage: continue with a minimal timestamped manual incident log.

## Stop conditions
Triage is complete when severity, scope, confirmed impact, active lanes, safety constraints, and the next checkpoint are all explicit. Root cause is not required before triage completes.