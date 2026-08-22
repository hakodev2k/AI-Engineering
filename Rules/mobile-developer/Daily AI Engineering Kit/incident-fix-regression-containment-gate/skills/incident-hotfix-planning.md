# Incident Hotfix Planning

## Purpose
Create the smallest evidence-backed production fix plan that restores the failing behavior without expanding the incident blast radius.

## When to use
Use after an incident has a bounded failing symptom and a candidate root cause or mitigation path.

## Inputs
- Incident ID and severity
- Confirmed symptom and affected user path
- Evidence supporting the current hypothesis
- Candidate files/components
- Existing rollback or disable mechanism
- Relevant tests and observability signals

## Preconditions
- The incident symptom is reproducible or observable.
- Facts are separated from hypotheses.
- A human incident owner exists for production-impacting actions.

## Allowed tools
Repository read/search, git diff, test runner, build tools, logs/metrics in read-only mode, static analysis, configuration inspection.

## Constraints
- Do not expand scope to unrelated cleanup or refactoring.
- Do not change public contracts, schema, infrastructure, secrets, or security controls without explicit approval.
- Prefer reversible code/config changes over irreversible actions.

## Procedure
1. Record the confirmed symptom, affected path, start time, severity, and current mitigation.
2. List only evidence-backed candidate causes. Mark unverified causes as hypotheses.
3. Trace the narrow execution path from entry point to failure.
4. Identify the minimal code/config surface required to alter that path.
5. Define `allowed_paths` and `forbidden_paths` for the hotfix.
6. Define expected behavioral change and behaviors that must remain unchanged.
7. Identify targeted unit/integration/E2E tests plus one negative-control check outside the affected path.
8. Define rollback mechanism and rollback trigger before implementation.
9. Identify any temporary bypass, feature flag, timeout increase, validation relaxation, or operational exception; give each an owner and expiry.
10. Produce a containment plan matching `schemas/hotfix-plan.schema.json`.
11. Run `scripts/validate-hotfix-plan.py` before editing.

## Expected output
A valid hotfix plan containing incident scope, allowed paths, expected behavior, regression boundaries, verification commands, rollback evidence, approval requirements, and exception expiry data.

## Verification
The plan validator exits 0 and every proposed edit maps to the affected execution path or a required test/evidence artifact.

## Failure handling
If root cause confidence is insufficient, stop at `investigation-required`. If rollback is undefined for a production-impacting change, stop at `blocked`.

## Stop conditions
Stop before implementation when the proposed fix requires an approval-required action or when affected scope cannot be bounded.