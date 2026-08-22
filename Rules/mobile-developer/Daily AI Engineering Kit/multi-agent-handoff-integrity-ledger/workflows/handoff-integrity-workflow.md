# Workflow: Handoff Integrity

## Entry condition
A workflow stage is complete or intentionally stopped and responsibility must move to another actor.

## Required inputs
- task and stage identity;
- producer/receiver roles;
- current repository state;
- artifacts and evidence;
- assumptions, decisions, risks, approvals;
- completion/verification state;
- `config/handoff-policy.json`.

## Stages

### 1. Capture
Responsible: Handoff Producer.

Create a candidate handoff record using the template/schema. Do not omit failed evidence or unresolved risk.

Artifact: candidate JSON handoff.

Checkpoint: candidate contains scope, artifacts, assumptions, decisions, risks, approvals, next actions, and states.

### 2. Deterministic validation
Responsible: scripts.

Run:
```bash
python scripts/validate-handoff.py --policy config/handoff-policy.json --record <record>
python scripts/verify-artifacts.py --record <record> --repo-root .
```

Artifact: exit codes and diagnostics.

Stop if malformed, prohibited, stale, or missing required approval.

### 3. Independent review
Responsible: Handoff Reviewer.

Check semantic completeness, status integrity, conflict risk, evidence relevance, and whether approval still applies.

Output: `accepted`, `revise`, or `blocked`.

### 4. Revision loop
Responsible: Handoff Producer.

If `revise`, correct only the identified defects and create a superseding candidate. Maximum 2 revision attempts.

Stop and escalate after the second failed revision.

### 5. Acceptance
Responsible: receiving actor.

Receiver explicitly acknowledges accepted scope, inherited assumptions/risks, and exact completion/verification state.

Historical handoff remains immutable.

### 6. Execution
Responsible: receiving actor's domain agent.

Execute only within accepted scope and existing permissions. New assumptions or material changes become evidence for the next handoff.

### 7. Next handoff / final verification
Repeat at every stage transition. Final workflow may be called completed only when the final stage completed; it may be called verified only when independent verification evidence supports `verification_state=verified`.

## Human approval points
Explicit approval is required before handoff execution can authorize:
- database schema modification;
- production deployment/configuration;
- infrastructure changes;
- secret changes;
- removal/weakened security controls;
- deleting files or force pushing;
- breaking public API changes;
- large dependency upgrades.

A materially changed action invalidates the prior approval.

## Failure and recovery
| Failure | Detection | Retry | Fallback / escalation |
|---|---|---:|---|
| invalid record | validator | 2 revisions | stop with diagnostics |
| missing/stale artifact | verifier | 0 semantic retries; regenerate evidence | block receiving stage |
| transient file I/O | script error | max 2 | stop if persistent |
| missing approval | policy/reviewer | 0 | request human approval |
| conflicting handoff | reviewer | max 2 revisions | human resolution |
| status inflation | validator/reviewer | max 2 revisions | block if repeated |

## Definition of Done
- every configured boundary has a valid accepted handoff;
- artifacts referenced by final handoff still match fingerprints;
- blocking risks are resolved or explicitly stopped;
- required approvals exist and remain applicable;
- no state was promoted without evidence;
- independent verification supports any `verified` claim.