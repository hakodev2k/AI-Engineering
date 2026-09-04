# Skill — Sandbox Boundary Audit

## Purpose
Determine whether untrusted/model-generated code can reach live host capabilities through values intentionally or accidentally crossing an in-process sandbox boundary.

## Trigger
Run for new code-execution features, sandbox/runtime upgrades, schema/tool-object exposure changes, language-bridge changes, or any sandbox escape/security advisory affecting a dependency.

## Inputs
- inventory of sandbox-visible APIs and values
- runtime and dependency versions
- normalized boundary observations
- process/network/filesystem/secret exposure description
- known error paths and exceptional callbacks

## Preconditions
The test environment must be non-production or otherwise isolated; probes must not contain real secrets or perform destructive actions.

## Required context
Know which side of each boundary is trusted, which code is model-controlled, and which process owns credentials/filesystem/network privileges.

## Allowed tools
Repository read/search, dependency/advisory lookup, unit tests, local sandbox fixtures, static inspection, and the package verifier.

## Constraints
- MUST NOT run exploit probes against systems without authorization.
- MUST NOT place production secrets in fixtures.
- MUST treat unknown crossing types as unsafe until classified.
- SHOULD prefer data-only serialization over wrapping live host objects.

## Procedure
1. Enumerate every API that passes data from trusted host code into untrusted code, including tool schemas, exceptions, callbacks, getters, metadata and bridge modules.
2. Record a baseline count by type: primitive, JSON/plain-data, function, class instance, error, proxy, bridge object, other.
3. For each crossing, answer whether the untrusted side can reach a constructor, prototype, getter/setter, symbol, native handle, module loader, process object, language bridge, or ambient network/filesystem capability.
4. Normalize suspicious observations using `__host_type__` markers and run `scripts/boundary_verifier.py`.
5. Exercise both success and failure paths; deliberately trigger safe tool errors because exceptional paths frequently return richer host objects.
6. Form remediation hypotheses in this order: (a) serialize/clone to plain data, (b) reduce exposed fields, (c) replace live error/object with an inert record, (d) disable unnecessary bridge, (e) move execution to separate process/container.
7. Implement one hypothesis and repeat the exact probe set.
8. If high-risk execution still shares a process with secrets or unrestricted filesystem/network, document residual risk and require an isolation decision.
9. Hand results to an independent verifier; the implementer cannot be the only final verifier.

## Decision points
- Any forbidden crossing => block release until removed or isolated.
- Unknown/non-serializable crossing => block by default.
- In-process sandbox handling attacker/model-controlled general code plus sensitive host credentials => SHOULD migrate to process/container isolation even if probes pass.

## Expected output
A boundary inventory, baseline/final finding counts, remediation record, test output, residual-risk statement, and one of Implemented / Measured / Verified.

## Metrics
Forbidden crossings, error-path coverage, regression probes passed, high-risk executions process-isolated, and sensitive host capabilities reachable from the sandbox.

## Verification
All known forbidden fixtures must fail closed; data-only fixtures must pass; error paths must be covered; an independent reviewer must confirm no active API reference in the README points to a missing artifact.

## Failure handling
Detection: verifier block/error, unclassified type, test failure, or runtime behavior differing from the normalized boundary model. Retry at most two remediation hypotheses. Fallback to a separate process/container or disable the code-execution capability. Escalate unresolved boundary questions to the security/runtime owner.

## Stop conditions
Stop and block completion on confirmed host-capability reachability, inability to classify a crossing, missing error-path coverage, or failed independent verification.
