# Skill: Approval Request Capture

## Purpose
Create a deterministic approval request before any approval-required action so the approver knows exactly what will happen and the later executor can prove the approved action has not changed.

## When to use
Use before production deploys, destructive data operations, schema changes, secret/config changes, infrastructure mutations, force pushes, breaking API changes, security weakening, large dependency upgrades, external side effects, or any action marked approval-required by repository policy.

## Inputs
- action description
- actor/agent identity
- target environment/system
- exact scope
- canonical payload or payload reference
- risk category
- expected side effects
- rollback/recovery plan
- evidence references

## Preconditions
- The action is fully planned but has not been executed.
- Scope and payload are stable enough to hash.
- Sensitive values can be represented as fingerprints or references instead of plaintext.

## Allowed tools
Read-only repository inspection, hashing, schema validation, policy lookup, test/build evidence collection.

## Constraints
- Never execute the protected action during request creation.
- Never include raw secrets in the request.
- Never describe scope with ambiguous phrases such as "related resources" without explicit identifiers or patterns.

## Procedure
1. Assign a unique `request_id` and monotonically increasing `revision`.
2. Record action type, target, environment, risk category, expected effect, and rollback plan.
3. Normalize scope into explicit resource identifiers, paths, services, tables, endpoints, branches, or patterns.
4. Normalize the payload into a canonical JSON-safe representation. Replace secrets with fingerprints or stable references.
5. Calculate `action_fingerprint` over action type, target, normalized scope, normalized payload, revision, and policy version.
6. Set approval lifetime according to policy; do not exceed configured maximum TTL.
7. Set reuse mode (`single-use` by default). Only policy-authorized action classes may use bounded reusable approvals.
8. Record required approver role and whether independent approval is required.
9. Validate the request with `scripts/validate-approval-request.py`.
10. Hand the immutable request to the approver. Any later change to action, target, scope, payload, or risk creates a new revision and fingerprint.

## Expected output
A schema-valid approval request JSON bound to a specific action fingerprint and policy version.

## Verification
- validator exits 0
- no raw secret values are present
- scope is explicit
- fingerprint is reproducible
- TTL is policy-compliant

## Failure handling
Validation or ambiguity stops the workflow. Fix the request and increment revision if approval-visible fields changed.

## Stop conditions
Stop before any protected action until an approval record exists and the execution gate returns `allow`.