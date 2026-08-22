# Workflow: Production Incident Evidence Timeline

## Entry condition
A production-impacting symptom exists and investigation requires correlation across more than one evidence source or a causal conclusion may drive a mitigation.

## Required inputs
- incident trigger and current impact
- raw or normalized evidence
- affected service context
- available deployment/config/change metadata
- human incident owner for protected actions

## Stages

### 1. Preserve evidence
**Owner:** Orchestrator

Capture/export relevant alerts, logs, traces, metrics, deployment events, configuration events, and operator actions without modifying source records.

**Artifact:** `raw-events.json`

**Checkpoint:** timestamps and source identifiers are present.

### 2. Normalize timeline
**Owner:** deterministic hook/script

Run:

```bash
python scripts/normalize-events.py --input raw-events.json --output incident-timeline.json
```

**Artifact:** `incident-timeline.json`

**Checkpoint:** normalization succeeds; invalid events are fixed at source rather than guessed.

### 3. Establish scope
**Owner:** Incident Investigator

Define last-known-healthy, first-known-impact, affected/unaffected components, user impact, and evidence gaps.

**Artifact:** draft incident report.

### 4. Generate and test hypotheses
**Owner:** Incident Investigator

Use `skills/hypothesis-testing.md`. Maintain at most five active hypotheses. Test discriminating evidence first.

**Checkpoint:** every hypothesis includes predicted and disconfirming observations.

### 5. Independent review
**Owner:** Evidence Reviewer

Review timeline, hypotheses, causal claims, mitigation proposal, and evidence quality.

**Decision:** `pass`, `revise`, `human-approval-required`, or `insufficient-evidence`.

### 6. Revision loop
For `revise`, Investigator addresses findings and returns to review.

**Maximum:** two revisions.

If the same material gap remains after two revisions, stop and escalate.

### 7. Human approval gate
Required before production deployment/rollback, config mutation, database mutation, secret/security/infrastructure changes, destructive operations, or mitigation with unknown blast radius.

Approval must record scope and action. Approval for one action does not authorize materially different actions.

### 8. Mitigation
**Owner:** Human-approved operator or implementation agent

Execute only the approved action. Capture start/end time, actor, command/change reference, expected effect, actual effect, and rollback status as new evidence.

**Failure rule:** never automatically retry an unsafe production mutation. If mitigation fails or produces unexpected impact, stop, preserve evidence, reassess, and request new approval.

### 9. Recovery verification
**Owner:** Evidence Reviewer + deterministic/project health checks

Validate user-impact recovery over a defined observation window. Examples: error rate, latency, queue depth, saturation, synthetic/API checks, affected workflow tests.

Recovery is not proof of cause.

### 10. RCA verification
Run:

```bash
python scripts/verify-incident-report.py --report incident-report.json
```

Reviewer confirms semantic evidence sufficiency.

### 11. Complete
Incident may be marked:
- `mitigated` when impact is controlled but cause is unconfirmed;
- `verified` only when report validation, recovery verification, and semantic evidence review all pass.

## Retry rules
- transient read-only telemetry query: retry at most 2 times
- evidence normalization: no blind retry for invalid records; fix input and rerun
- investigator review revisions: maximum 2
- project health check with plausible transient failure: retry at most 2 times
- production mutation: no automatic retry unless an approved runbook explicitly defines idempotent bounded retry

## Stop conditions
Stop and escalate when:
- required evidence is inaccessible and no safe independent source exists;
- revision budget is exhausted;
- mitigation crosses a protected boundary without approval;
- blast radius is unknown;
- repeated health checks show worsening impact;
- root cause remains unsupported after available safe tests.

## Definition of Done
For `mitigated`:
- impact reduction is measurable and sustained for the declared observation window;
- mitigation action and approval are recorded;
- unresolved cause is explicitly `unconfirmed` if applicable.

For `verified`:
- normalized timeline exists;
- evidence references resolve;
- winning hypothesis has supporting evidence and major alternatives are addressed;
- recovery checks pass;
- protected actions have approvals;
- report validator passes;
- Evidence Reviewer returns `pass`;
- uncertainties and follow-up actions are recorded.
