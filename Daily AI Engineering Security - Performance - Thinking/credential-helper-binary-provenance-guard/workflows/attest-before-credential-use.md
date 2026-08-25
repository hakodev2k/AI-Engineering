# Workflow: Attest Before Credential Use

## Trigger
An agent/runtime is about to invoke a local credential helper, or its launcher/runtime changed.

## Goal
Bind the credential operation to the intended executable identity without touching secret contents.

## Inputs
Trusted policy, runtime environment, optional digest evidence.

## Baseline
Capture current `PATH`, expected path, and resolution state before changes.

## Context
Record OS, runtime/IDE version, bundled-tool locations, sandbox mode, and policy source.

## Stages
1. **Observe** — collect environment and intended helper identity.
2. **Measure baseline** — run checker; preserve JSON result.
3. **Diagnose** — distinguish missing helper, shadowing, realpath mismatch, hash mismatch, or unrelated credential failure.
4. **Form hypothesis** — identify launcher/toolchain configuration responsible.
5. **Implement improvement** — pin absolute helper or repair trusted runtime configuration.
6. **Measure again** — same environment and policy.
7. **Improved?** If no, one additional remediation attempt; if yes, continue.
8. **Verify** — independent Provenance Verifier checks evidence.
9. **Complete** — only after verification.

## Responsible agent
Runtime investigator for stages 1-7; Provenance Verifier for stage 8.

## Tools
`scripts/helper_provenance.py`, filesystem metadata, trusted fleet/package metadata.

## Outputs
Baseline and final provenance reports, remediation record, verification status.

## Checkpoints
No credential-bearing operation after a blocking mismatch; no policy mutation by untrusted workspace; no secret reads during attestation.

## Metrics
Mismatch counts, retries, blocked operations, remediation time.

## Retry policy
Maximum two remediation attempts total.

## Stop conditions
Verified pass; retry budget exhausted; or security controls would need weakening.

## Failure path
Block helper invocation, preserve sanitized evidence, use a known trusted absolute path only if approved by policy, otherwise escalate.

## Verification
Checker and tests pass; independent verifier accepts path/policy identity.

## Definition of Done
Current evidence recorded, policy trusted, baseline measured, mismatch remediated if present, final check passes, no secrets exposed, security controls preserved, independent verification complete.