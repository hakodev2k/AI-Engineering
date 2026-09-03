# Skill: SSE Boundary Audit

## Purpose
Determine whether a streaming MCP client has explicit application-layer resource bounds before event framing completes.

## Trigger
Use when introducing a remote MCP endpoint, changing SSE parsing, upgrading an SDK, or reviewing a custom streaming transport.

## Inputs
Transport code or dependency version, `config/policy.json`, valid SSE fixtures, delimiter-free adversarial fixtures, and available memory/latency telemetry.

## Preconditions
The reviewer can identify where bytes are appended before a complete event is emitted.

## Allowed tools
Source inspection, dependency metadata, offline fixtures, unit tests, local process metrics. Network fuzzing against third-party services is not required.

## Constraints
Do not weaken TLS, authentication, sandboxing, or server trust controls. Do not use a real production server for destructive memory-exhaustion tests.

## Procedure
1. Locate the incomplete-event buffer and all append sites.
2. Record the exact condition that drains or resets the buffer.
3. Verify a hard `max_incomplete_frame_bytes` check executes before append/growth can exceed policy.
4. Verify a total-stream and idle-time boundary exists or document why the host supplies equivalent enforcement.
5. Run `scripts/sse_boundary_probe.py` with a valid framed fixture and a delimiter-free fixture.
6. Capture peak buffered bytes, abort offset, error classification, and normal-stream regression result.
7. Compare results against policy. If any required boundary is absent, classify as blocking.

## Decision points
- If the dependency is in the vulnerable CVE range, upgrade before further tuning.
- If a proxy supplies a byte limit but parser buffering can exceed it after decoding, treat the client as unbounded.
- If the buffer cap exists but overflow silently reconnects forever, treat retry policy as a separate unresolved risk.

## Expected output
A boundary table with configured limit, enforcement location, probe evidence, and pass/fail status.

## Metrics
Peak incomplete-frame bytes, abort latency, normal fixture pass rate, structured overflow event presence.

## Verification
An independent reviewer confirms the cap is enforced before unbounded allocation and that normal SSE parsing still passes.

## Failure handling
Maximum two remediation attempts. On continued failure, disable the affected remote transport or pin to a known-safe SDK and escalate.

## Stop conditions
Stop when all policy boundaries are enforced and tests pass, or after two failed remediation attempts.
