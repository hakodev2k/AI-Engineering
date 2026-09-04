# Change Control Rules

## Purpose
Control production changes made under incident pressure.

## Scope
Applies to configuration changes, deployments, rollbacks, infrastructure actions, database operations, traffic shifts, and security controls during incidents.

## MUST
- Every production change MUST have a named executor and reviewer when feasible.
- High-risk or irreversible changes MUST receive explicit human approval from the accountable authority before execution.
- Changes MUST state expected effect, rollback method, verification signal, and stop condition.
- Record exact changes and timestamps in the incident timeline.
- Validate the environment and target before execution.

## MUST NOT
- Force push, rewrite history, destroy infrastructure, delete data, weaken security controls, or perform irreversible migrations without explicit approval.
- Make unrelated cleanup changes during active incident mitigation.
- Bypass established safety checks merely because the incident is urgent unless the exception is authorized and documented.

## SHOULD
- Prefer the smallest reversible change that can test or mitigate the current hypothesis.

## Exceptions
Emergency action may compress review steps when delay creates greater harm, but approval, scope, and post-action verification remain required.

## Verification
Inspect change records, approvals, diffs, deployment logs, database audit trails, and telemetry confirming intended effects.