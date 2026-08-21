# Skill — Credential Destination Review

## Purpose
Prevent model-influenced destinations from receiving credentials unless the destination is explicitly authorized for that credential class.

## Trigger
Run before implementing, reviewing, or invoking any tool that combines an outbound destination with Basic auth, OAuth, API keys, cookies, signed requests, client certificates, or other sensitive authorization material.

## Inputs
- Tool schema and implementation
- Destination argument source and normalization logic
- Credential class and attachment point
- Redirect behavior
- Destination policy
- Approval design
- Tests and logs

## Preconditions
The reviewer can identify where the destination is derived and where credentials are attached.

## Required context
Only source code, configuration, threat model, and observable request behavior needed for the review. Do not expose real secrets.

## Allowed tools
Repository search, static analysis, unit/integration tests with fake credentials, HTTP test doubles, URL parsers, and `scripts/validate_destination.py`.

## Constraints
- Never test with production secrets.
- Never rely on the model to decide destination authorization.
- Never weaken TLS or hostname checks to make a test pass.
- Treat redirects as new destinations.

## Procedure
1. Map the flow: untrusted/model-controlled input → normalization → authorization decision → request construction → credential attachment → redirect handling.
2. Record whether destination input can come from prompt, retrieved content, MCP metadata, tool result, user input, or configuration.
3. Establish the credential class and intended destination set.
4. Normalize scheme, hostname, port, trailing dot, userinfo, and IP literals before policy matching.
5. Run the deterministic validator against known-good and adversarial fixtures.
6. Verify credentials are attached only after an allow decision.
7. Verify redirects are disabled or re-authorized before forwarding credentials.
8. Verify approval, when required, is bound to normalized destination + credential class + operation.
9. Inspect logs to ensure the decision and normalized destination are recorded without the secret value.
10. Have a reviewer other than the implementer validate high-risk changes.

## Decision points
- If destination is fixed by configuration and cannot be influenced at runtime, document that invariant and still test it.
- If dynamic destinations are required, use credential-specific allowlists rather than a global hostname list.
- If the legitimate destination cannot be deterministically characterized, require explicit human approval and do not send ambient credentials before approval.

## Expected output
A review record containing attack path, destination policy, credential class, allow/deny cases, redirect policy, approval binding, test evidence, and verification status.

## Metrics
Coverage of credential-bearing request sites, adversarial case pass rate, unauthorized destination block rate, redirect revalidation rate, and approval-binding coverage.

## Verification
Pass all regression fixtures; inspect at least one request trace proving no Authorization header is emitted before destination authorization.

## Failure handling
On ambiguity, deny by default and escalate to the service owner. Preserve failing fixtures and request traces.

## Stop conditions
Complete only when every credential-bearing request path has a deterministic authorization decision and independent verification. Stop immediately if a real secret appears in logs or fixtures.
