# Skill: Sandbox Boundary Analysis

## Purpose
Verify that custom-code or evaluator features remain confined to explicitly allowed capabilities after upgrades, dependency changes, or configuration changes.

## Trigger
Platform upgrade, new evaluator/code node, module-allowlist change, worker-image change, security advisory, or incident involving custom code.

## Inputs
Component inventory, versions, enabled custom-code features, worker isolation controls, module allowlists, network/filesystem policies, and security advisories.

## Preconditions
A current inventory exists and production secrets are not included in test fixtures.

## Required context
Runtime trust boundaries, worker privilege model, tenant isolation model, allowed modules, and intended network/filesystem access.

## Allowed tools
Package/version inspection, configuration readers, container/worker policy inspection, static code review, and `scripts/sandbox_boundary_guard.py`.

## Constraints
- MUST NOT execute public exploit payloads in normal CI or production.
- MUST NOT weaken isolation to improve workflow compatibility.
- MUST use non-destructive capability sentinels and configuration evidence.
- MUST require human approval before any dangerous or irreversible security test.

## Procedure
1. Inventory all custom-code/evaluator execution paths.
2. Map each path to process/container, OS identity, module allowlist, network policy, filesystem policy, and tenant scope.
3. Compare versions against current fixed versions in `config/sandbox-policy.json`.
4. Run the deterministic boundary guard.
5. Review newly added modules and host objects transitively for introspection/process/global-constructor reachability.
6. Verify no shared privileged worker serves untrusted custom code.
7. Run unit tests and safe sentinel checks.
8. Have the Security Reviewer independently verify the boundary.

## Decision points
Block release/deployment on vulnerable versions, missing required isolation controls, forbidden capabilities, unknown versions when policy requires fail-closed behavior, or unresolved transitive capability exposure.

## Expected output
Boundary map, Observed evidence, Interpretation, Violations, Remediation, and Verification status.

## Metrics
Known-vulnerable component count, missing-control count, forbidden-capability count, unreviewed allowlist additions, and regression-test pass rate.

## Verification
Independent reviewer reproduces inventory evaluation and confirms no privileged capability is reachable from the sandbox's documented interface.

## Failure handling
Fail closed. Retry inventory collection once for transient tooling errors; do not retry failed security invariants without a code/config change.

## Stop conditions
All invariants pass and independent review completes, or a blocking violation is confirmed and the release/deployment is stopped.
