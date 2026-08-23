# Bootstrap Investigation Skill

## Purpose
Determine how a workload obtains its first credential and whether static secret-zero material is required, exposed, or unnecessarily privileged.

## When to use
Use during service onboarding, CI/CD identity changes, cloud migration, 401/403 diagnosis, credential rotation planning, or review of code that introduces credentials.

## Inputs and preconditions
Repository root, target environment, affected workload, identity provider, expected downstream resource, relevant deployment/configuration files, and permission to run read-only scans/tests. Do not require raw production credentials.

## Allowed tools
Repository search, configuration inspection, identity-provider documentation, local tests, CI logs after redaction, and `scripts/secret_zero_gate.py`.

## Constraints
Follow `rules/secret-zero-safety.md`. Scanner matches are hypotheses until the runtime credential path confirms them.

## Procedure
1. Identify the workload entry point and deployment environment.
2. Trace credential acquisition from process startup to the first authenticated downstream request.
3. Record facts separately from hypotheses: credential source, identity, token/certificate lifetime, renewal behavior, requested audience/resource, and granted permissions.
4. Run `python scripts/secret_zero_gate.py --root <repo> --policy config/policy.json --environment <env> --output secret-zero-result.json`.
5. Inspect every finding without copying the value. Determine whether it is active runtime configuration, an example, test fixture, obsolete file, or false positive.
6. Check whether an approved secretless mechanism is available in the runtime platform.
7. Build the smallest migration/fix plan: identity binding, application credential provider, least-privilege permission, tests, rollback, and cleanup only after verification.
8. If production trust or permissions must change, stop and produce an approval request; do not execute the change.
9. After approved implementation, test credential acquisition, renewal, downstream authorization, and a negative identity case.
10. Hand evidence to the independent verifier.

## Expected output
A finding set with affected component, evidence location, current bootstrap mechanism, risk, proposed mechanism, approval requirement, test evidence, and unresolved risks.

## Verification
The runtime path uses the intended identity; scanner has no unexplained blocking finding; positive and negative auth tests pass; no secret value appears in evidence; independent verification succeeds.

## Failure handling
Transient read/tool failures: retry at most twice. Permission or identity-provider administration failures: stop and escalate. Failed authentication after one evidenced fix attempt: preserve logs with redaction and stop rather than broadening permissions.

## Stop conditions
Stop before production identity/trust/permission changes, secret rotation/deletion, security-control weakening, or after two repeated tool failures.
