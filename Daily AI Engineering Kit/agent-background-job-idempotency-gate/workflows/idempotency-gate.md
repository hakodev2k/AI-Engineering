# Background Job Idempotency Gate Workflow

## Trigger
A new/changed background job, duplicate-effect incident, retry-policy change, or pre-release review of an at-least-once consumer.

## Entry conditions
Target job and repository are known; non-destructive inspection is permitted.

## Inputs
Job entry point, payload identity, broker/scheduler semantics, persistence/external effects, tests/logs.

## Stages
1. **Context** — Job Investigator maps producer → delivery → handler → effects → commit → acknowledgement.
2. **Static scan** — run `python3 scripts/scan-idempotency.py <repo> --output scan.json`; scanner exit 1 means review findings, not automatic failure.
3. **Hypothesis** — classify stable-key, atomicity, retry, acknowledgement, and external-effect risks.
4. **Plan** — define duplicate-delivery and retry-after-partial-failure tests plus smallest safe remediation.
5. **Approval checkpoint** — stop if remediation requires schema change, production config/deployment, queue purge, deletion, breaking contract, or other configured dangerous action.
6. **Execute** — implement only approved/in-scope changes.
7. **Test** — deliver the same logical operation at least twice; inject one retryable failure where feasible; record effect counts.
8. **Review** — inspect diff and confirm no unrelated behavior or weakened assertions.
9. **Independent verification** — Verification Agent re-runs relevant checks and challenges effect-boundary assumptions.
10. **Contract validation** — save assessment JSON and run `python3 scripts/validate-assessment.py assessment.json`.

## Checkpoints
Stable operation key identified; all effects enumerated; acknowledgement boundary known; duplicate test defined; external ambiguity addressed.

## Retry rules
Maximum two retries for transient tool/test-environment failures. Preserve command, output, failing input, and attempt number. Deterministic build/test failures require diagnosis/change before another run. After two transient failures, status is `blocked` and escalate.

## Failure paths
Permission/environment failure → preserve evidence and block. Business-rule ambiguity → block pending owner clarification. Verification failure → status `fail`; do not relabel as pass. Approval-required change → `needs-approval` before mutation.

## Stop conditions
Required context unavailable; stable logical identity cannot be defined; dangerous action lacks approval; two repeated transient failures; independent verifier finds unresolved duplicate effect.

## Produced artifacts
`scan.json` when scanner is used and an assessment matching `schemas/assessment.schema.json`.

## Definition of Done
Assessment validates; duplicate delivery and retry behavior were tested or explicitly blocked with evidence; effect count was verified; independent verification completed; approvals obtained where required; remaining risks recorded; no blocking failure remains for `pass`.
