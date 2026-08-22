# License Exception Review Skill

## Purpose
Prepare a precise, reviewable exception request when a dependency is not automatically allowed.

## Inputs
Exact package identifier, version, declared license(s), gate result, dependency purpose, distribution/deployment model, and authoritative license evidence.

## Preconditions
The deterministic gate returned `approval_required`, or policy owners explicitly requested exception review. The agent has no authority to self-approve.

## Process
1. Confirm the package/version matches the SBOM and gate result.
2. Collect authoritative license metadata and preserve source references outside generated prose when possible.
3. Explain why the dependency is needed and whether a policy-compliant alternative exists.
4. Record whether usage is development-only, build-time, server-side, dynamically linked, bundled, redistributed, or shipped to customers.
5. Identify obligations or uncertainty without presenting legal conclusions as facts.
6. Fill `templates/license-exception-request.md`.
7. Obtain explicit human approval from the designated compliance/legal/engineering owner.
8. Add a narrow `package_exceptions` entry only after approval, scoped to package identifier and version where possible.
9. Re-run the gate and preserve approval evidence.

## Expected output
A completed exception request with decision owner, exact scope, rationale, expiry/review date if required by local policy, and verification result.

## Verification
Approval references the same package/version and intended usage. Policy changes are minimal and do not convert an unrelated license family into a blanket allow.

## Failure handling
If authoritative metadata conflicts, stop and escalate. If usage/distribution is unclear, do not assume the least restrictive interpretation. If approval cannot be obtained, keep the dependency blocked from merge/release.

## Stop conditions
Self-approval attempt, package/version drift, missing authoritative evidence, or a proposed broad policy relaxation not explicitly authorized.
