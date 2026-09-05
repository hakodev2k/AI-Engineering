# Skill: Delegation Secret Boundary Assessment

## Purpose
Determine whether a delegated agent receives only credentials and environment metadata strictly required for its task.

## Trigger
New delegation feature, credential, skill/tool environment dependency, sandbox change, or credential-visibility incident.

## Inputs
Delegation path; parent environment names; child requested names; secret-delivery mechanism; destination restrictions; approvals.

## Preconditions
Do not collect or print secret values. Use names and mock sentinel credentials only.

## Required context
Whether child is in-process, subprocess, container, or remote; where filtering occurs; which layer can read raw values.

## Allowed tools
Read-only source/config inspection, process-model inspection, mock child process, checker, sentinel tests.

## Constraints
No production credential retrieval or outbound tests using real secrets.

## Procedure
1. Trace child creation from parent task to child tools.
2. Identify inherited channels: OS env, config objects, shared memory, mounted files, credential helpers.
3. Record parent environment names only.
4. Record explicit child requests.
5. Classify sensitive names.
6. Determine brokered vs readable delivery.
7. Run the checker.
8. Implement deny-by-default filtering before child execution.
9. Use sentinels to verify unrequested/sensitive values are absent.
10. Hand evidence to independent reviewer.

## Decision points
In-process full environment: BLOCK unless same explicitly approved trust principal. Sensitive readable credential without approval: BLOCK. Opaque scoped broker: permit if task/destination match. Unknown visibility: BLOCK.

## Expected output
Trust map, exposure baseline, findings, remediation evidence, negative tests, verification status.

## Metrics
Sensitive child-visible names; unrequested names; broker coverage; allowlist coverage; negative-test pass rate.

## Verification
A sentinel sensitive variable in parent must be absent from an unprivileged child.

## Failure handling
Retry introspection once for transient child-start failure; never infer safety from failed probe.

## Stop conditions
Stop on real secret disclosure or unbounded child visibility.