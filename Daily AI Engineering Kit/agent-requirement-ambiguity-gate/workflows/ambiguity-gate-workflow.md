# Ambiguity Gate Workflow

```text
Request -> Repository evidence -> Requirement contract -> Deterministic validation
        -> Independent verification -> Ready / Approval / Blocked
```

## Trigger
Before an AI agent implements a feature, bug fix, refactor, integration, migration, or operational change where behavior or scope is not already fully testable.

## Entry conditions
Original request is available and repository/specification evidence can be read with current permissions.

## Inputs
Request, repository/ref, linked specs, existing tests, `config/ambiguity-gate.yaml`.

## Stages
1. **Intake — Requirement Analyst.** Extract outcome, trigger, actors, boundaries, constraints, explicit requirements and non-goals.
2. **Evidence — Requirement Analyst.** Execute `skills/repository-evidence.md`; record current behavior and contracts.
3. **Contract — Requirement Analyst.** Produce JSON matching `schemas/requirement-contract.schema.json`.
4. **Gate — deterministic hook.** Run `python scripts/validate-requirement-contract.py <contract>`.
5. **Independent review — Requirement Verifier.** Validate cited evidence and search for hidden decisions.
6. **Disposition.** `ready` may hand off to implementation; `needs-approval` stops for human approval; `blocked` stops for missing decision/evidence; `rejected` terminates.

## Produced artifacts
Requirement contract JSON and verifier findings. No source-code implementation is produced by this workflow.

## Checkpoints
After evidence collection, after contract validation, and after independent verification.

## Retry rules
Maximum two replan attempts. Retry only when verifier identifies a resolvable omission or new repository evidence answers the ambiguity. Preserve previous findings and evidence. Tool/environment failures may be retried once if transient. Do not retry permission or business-decision failures.

## Approval points
Stop before breaking API contracts, database schema changes, production configuration/security changes, destructive operations, irreversible migrations, or large dependency upgrades. Approval does not erase risk; it authorizes the downstream workflow to evaluate/perform the protected action under its own safety controls.

## Failure paths
- Invalid JSON/contract -> analyst repairs once per replan cycle.
- Missing repository evidence -> targeted evidence expansion; if unavailable, `blocked`.
- Conflicting authoritative evidence -> `blocked` and surface conflict.
- Permission failure -> `blocked`; never increase permissions silently.
- Two failed verifier cycles -> stop and escalate with preserved findings.

## Stop conditions
Any unresolved blocking question, high-risk assumption, required approval, inaccessible critical evidence, exhausted retries, or rejected request.

## Definition of Done
- Contract validates.
- At least one acceptance criterion exists.
- Material claims have evidence.
- Zero blocking questions and high-risk assumptions for `ready`.
- Independent verifier accepts the contract.
- Protected actions are not executed and are correctly approval-gated.
- Remaining non-blocking risks are explicit.
