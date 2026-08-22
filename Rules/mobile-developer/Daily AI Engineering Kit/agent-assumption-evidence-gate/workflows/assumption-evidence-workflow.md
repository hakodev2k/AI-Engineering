# Assumption Evidence Workflow

## Trigger
Use when a task contains material uncertainty that can affect implementation, verification, release, migration, incident response, or other consequential engineering work.

## Entry conditions
- Task objective and scope are known.
- Repository/runtime evidence can be read with least privilege.
- Policy is available.

## Inputs
Task contract, repository revision, relevant files/tests/logs/runtime/API/database evidence, `config/assumption-policy.json`.

## Flow
```text
Trigger
  ↓
Discover assumptions
  ↓
Classify materiality + consumers
  ↓
Define evidence targets + TTL
  ↓
Gather evidence
  ↓
Deterministic gate
  ├─ blocked → stop / remediate
  ├─ review-required → independent review
  └─ verified → execute bounded task stage
                         ↓
                 revalidation trigger?
                    ├─ yes → refresh evidence
                    └─ no
                         ↓
                 final assumption gate
                         ↓
                    complete / stop
```

## Stages
1. **Context** — Assumption Curator reads only relevant context and identifies beliefs not yet proven.
2. **Register** — Create records with IDs, materiality, owner, consumers, evidence targets, TTL, and triggers.
3. **Evidence** — Gather read-only evidence and update statuses.
4. **Gate** — Run `scripts/evaluate-assumptions.py`; preserve report.
5. **Plan/Execute** — Work may consume only assumptions permitted by the gate. Dangerous actions still require explicit human approval.
6. **Checkpoint** — Before each high-risk side effect and after base/dependency/schema/config/environment drift, revalidate affected assumptions.
7. **Independent review** — Assumption Verifier reviews high/critical consumed assumptions and binds review to current fingerprints.
8. **Final gate** — Run `scripts/evaluate-final-gate.py`; only `verified` means the assumption layer is verified.

## Produced artifacts
Assumption register, gate report, optional independent review, final gate report, evidence references.

## Retry rules
- Evidence read/tool transport failure: maximum 1 retry.
- Validation failure: 0 automatic retries; change evidence or record first.
- Permission failure: 0 retries; escalate without widening privileges.
- Contradiction/business-rule failure: 0 retries; replan or stop.

## Approval points
Stop for explicit human approval before production deploy, destructive SQL/data deletion, schema/infrastructure/secret/production-config changes, force push/history rewrite, breaking API changes, security weakening, irreversible migration, or large dependency upgrade. All assumptions affecting the action must be supported/reviewed first; approval does not turn false evidence into true evidence.

## Failure paths
- `contradicted`: remove/replan all consumers and preserve evidence.
- `expired`: refresh once if safely possible; otherwise stop.
- `proposed` high/critical and consumed: stop until resolved.
- stale fingerprint: regenerate report/review; never reuse.
- repeated tool failure: stop with evidence of both attempts.

## Definition of Done
- All material assumptions affecting completed work are registered.
- No contradicted or expired assumption is still consumed.
- Supported assumptions have evidence.
- High-risk consumed assumptions have independent review when required.
- Current policy/register fingerprints match gate/review.
- Required human approvals exist for dangerous actions.
- Final gate returns `verified`.
- Remaining uncertainty is documented and non-blocking.