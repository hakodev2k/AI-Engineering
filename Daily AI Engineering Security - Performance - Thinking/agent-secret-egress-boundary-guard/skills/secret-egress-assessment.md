# Skill: Secret Egress Assessment

## Purpose
Identify where raw credentials can enter agent-visible state or leave the intended trust boundary.

## Trigger
Before enabling a new tool/provider, after a credential leak, when adding multi-user profiles, or when changing subprocess/network execution paths.

## Inputs
Secret source inventory, tool list, subprocess launch code/config, provider/log/network sinks, tenant/profile identity model, sample sanitized traces.

## Preconditions
Use synthetic test secrets. Do not paste production credentials into the assessment.

## Required context
Trust boundaries, credential ownership, which components genuinely require secret values, and whether each sink is model-visible, persisted, or externally transmitted.

## Allowed tools
Read-only repository inspection, config inspection, synthetic test execution, exact-value scanner, environment dump from isolated tests.

## Constraints
Never print production secrets. Never disable sandboxing or approval controls to reproduce a leak. Credential rotation requires explicit human authorization.

## Procedure
1. Enumerate credential sources: environment, files, vaults, profile stores, CI secrets, generated tokens.
2. Enumerate sinks: model request, tool result, transcript, log, cache/snapshot, subprocess environment, network request, artifact.
3. Build a source-to-sink matrix and mark intended flows.
4. Register synthetic canary values and fingerprints.
5. Exercise each relevant tool/subprocess path and capture sanitized evidence.
6. Flag any source-to-sink flow not explicitly allowed.
7. Determine the narrowest resolver point where raw secret access is actually necessary.
8. Produce remediation requirements and verification fixtures.

## Decision points
- If the model or generic shell does not require the value, it MUST remain opaque.
- If multiple profiles share a process, credential resolution MUST include profile/tenant identity.
- If a sink cannot be deterministically scanned or scoped, block secret delivery to that sink.

## Expected output
A source/sink matrix, allowed-flow policy, synthetic leak fixtures, identified bypasses, and measurable remediation criteria.

## Metrics
Covered sinks/total sinks, unauthorized flows found, model-visible secret count, subprocess secret count, cross-profile leakage count.

## Verification
Repeat the same synthetic canary scenarios after remediation; every unauthorized sink must contain zero raw registered values.

## Failure handling
Retry transient test setup once. On repeated uncertainty, mark the path BLOCKED rather than assuming it is safe.

## Stop conditions
Stop on production-secret exposure, unscoped credential resolution in a multi-tenant path, or inability to inspect a required egress sink.