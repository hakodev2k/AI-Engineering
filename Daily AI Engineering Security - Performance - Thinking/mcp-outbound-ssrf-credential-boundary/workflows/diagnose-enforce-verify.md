# Workflow: Diagnose → Enforce → Verify

## Trigger
A network-capable MCP tool or an SSRF/credential-disclosure signal.

## Goal
Prevent attacker-influenced destinations from receiving requests or credentials.

## Inputs
Tool schema, URL provenance, intended domains, DNS results, redirect behavior, and identity scope.

## Baseline
Record current validation, network sandbox, and credential attachment order.

## Stages
1. Observe URL-bearing inputs.
2. Measure existing validation coverage.
3. Diagnose boundary gaps.
4. Form a concrete exploit-path hypothesis without contacting sensitive endpoints.
5. Enforce deterministic destination policy.
6. Run safe fixtures and redirect tests.
7. Re-evaluate once if a legitimate destination is falsely blocked.
8. Independent verification.

## Checkpoints
Before credential attachment; before redirect; before any internal-domain exception.

## Metrics
Attack-fixture block rate, intended-host pass rate, redirect validation coverage, least-privilege identity scope.

## Retry policy
Maximum one policy correction plus one verification rerun.

## Stop conditions
Credential exposure, unresolved destination provenance, unsafe exception, or exhausted retry.

## Failure path
Disable the affected network capability and rotate credentials if exposure is suspected.

## Verification
Security Verifier must independently confirm policy enforcement and credential ordering.

## Definition of Done
All attack fixtures block, intended destinations pass, credentials remain scoped, and verifier approves.
