# Workflow: Audit → Remediate → Verify

## Trigger
Connector release, credential feature change, security advisory, or scheduled security regression review.

## Goal
Demonstrate destination-policy parity across every applicable adapter.

## Inputs
Policy, inventory, repository revision, synthetic tests.

## Baseline
Run the verifier before changes and preserve its report.

## Stages
1. **Observe:** enumerate credential + user-endpoint paths.
2. **Measure:** run parity verifier; record findings.
3. **Diagnose:** map each finding to request-construction and secret-materialization code.
4. **Hypothesize:** state how the policy can be bypassed and what common boundary should prevent it.
5. **Implement:** add/centralize enforcement without weakening credential semantics.
6. **Measure again:** run verifier and adapter tests.
7. **Independent verification:** security reviewer checks code and evidence.
8. **Complete:** archive before/after reports and risks.

## Responsible agent
Implementation owner for stages 1–6; independent security reviewer for stage 7.

## Tools
Repository search, standard test runner, `scripts/verify_destination_policy.py`.

## Outputs
Before/after reports, remediation diff, negative-test evidence, verification decision.

## Checkpoints
After baseline, after each remediation, before final approval.

## Metrics
Parity coverage, finding count, negative-test pass rate.

## Retry policy
Maximum two remediation retries per adapter. Each retry requires a changed hypothesis or implementation.

## Stop conditions
Stop on verifier pass plus independent verification, or stop blocked after retry exhaustion.

## Failure path
Preserve evidence, disable/exclude the unsafe adapter where operationally acceptable, and escalate. Do not expand allowed destinations as a workaround.

## Definition of Done
All applicable adapters pass policy and negative tests; no real secrets used; reviewer signs off; no blocking issue remains.