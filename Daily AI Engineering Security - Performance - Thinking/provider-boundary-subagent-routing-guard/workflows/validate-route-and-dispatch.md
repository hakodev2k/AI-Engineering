# Workflow: Validate Route and Dispatch

## Trigger
Any privileged auxiliary model call.

## Goal
Prevent provider-boundary capability and model-routing violations before network dispatch.

## Inputs
Session route, subagent role, requested model/features, provider capabilities, explicit overrides.

## Baseline
Record current success/failure rate of privileged calls, observed 4xx protocol errors, and cross-provider model substitutions.

## Stages
1. Observe current intended route.
2. Resolve effective provider/model and route provenance.
3. Diagnose required request extensions and privileges.
4. Validate against positive provider capabilities.
5. Apply safe degradation only when documented.
6. Build request.
7. Compare built request metadata against validated route.
8. Independent Route Security Reviewer verifies.
9. Dispatch only after PASS.

## Checkpoints
Before prompt construction; after route resolution; after request construction; before network dispatch.

## Metrics
Unsupported-extension failures, unauthorized substitutions, privileged-call success rate, blocked unsafe calls, route mismatches.

## Retry policy
One metadata/config refresh maximum. Known incompatibility is not retried.

## Stop conditions
Unknown security-sensitive capability, unauthorized model/provider change, unsupported extension, reviewer BLOCK, or metadata mismatch.

## Failure path
Approval calls return to a safe native/user-review path or block; memory calls defer/skip generation; other privileged calls surface a precise unsupported-route error. Never auto-allow or silently reroute.

## Verification
Use `scripts/route_guard.py` and compare request metadata to the validated route. Security reviewer must be independent from route construction.

## Definition of Done
No unsafe route exists, security checks pass, selected provider/model boundaries are preserved, no secret is logged, and deterministic route evidence is retained.