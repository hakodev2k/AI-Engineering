# Workflow: Audit, Harden, Verify

## Trigger
Persistence backend change, security advisory, tenant-model change, pre-release audit, or suspicious memory access.

## Goal
Demonstrate zero cross-tenant memory exposure across all production persistence paths.

## Inputs
Backend inventory, versions, authorization model, code paths, fixtures, current advisories.

## Baseline
Run the adversarial corpus before changing code. Record current package versions and which test cases fail/pass.

## Context
Treat query filters and namespace scopes as untrusted enforcement mechanisms until their behavior is tested against canonical tenant identity.

## Stages
1. **Observe** — Security Investigator inventories dependencies, call sites, tenant sources, and backend semantics.
2. **Measure baseline** — execute sibling-prefix, wildcard, nested-operator, and ownership-mismatch cases.
3. **Diagnose** — separate dependency defect, unsafe adapter, malformed untrusted input, and missing post-retrieval authorization.
4. **Form hypothesis** — select one minimal remediation with explicit expected test changes.
5. **Implement improvement** — upgrade dependency and/or enforce allowlisted filter grammar, segment-aware scope, and object-level authorization.
6. **Measure again** — rerun the identical corpus and record violations.
7. **Improved?** If no, re-evaluate once and perform one second remediation attempt. Maximum 2 remediation attempts.
8. **Verify** — independent Verification Agent reruns tests using production-equivalent configuration.

## Responsible agents
Investigation/remediation analysis: Security Investigator. Independent acceptance: Verification Agent.

## Tools
Dependency inspection, integration tests, local/test DBs, code search, deterministic checker.

## Outputs
Baseline report, root-cause record, remediation diff, post-change report, independent verification decision.

## Checkpoints
Before code change; after first remediation; after second attempt if needed; before release decision.

## Metrics
Cross-tenant return count, unsafe filter count, backend coverage, corpus pass rate.

## Retry policy
Environmental failures: maximum 2 retries. Security test failures: maximum 2 remediation attempts, never automatic weakening of policy.

## Stop conditions
Success only at zero violations and 100% backend coverage. Stop and escalate if a violation remains after two remediation attempts or if a production-equivalent backend cannot be tested.

## Failure path
Preserve evidence, restore last known-good authorization behavior if regression was introduced, block release, notify security/application owner.

## Verification
Verifier checks dependency versions, adapter behavior, corpus integrity, checker output, and canonical tenant ownership enforcement.

## Definition of Done
Evidence documented; baseline captured; limitation/root cause identified; remediation implemented; tests and metrics collected; before/after comparison complete; risks documented; independent verification complete; no blocking issue remains.
