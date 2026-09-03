# Skill: Credential Egress Audit

## Purpose
Prove that credential destination policy is enforced uniformly across all request-producing adapters.

## Trigger
New connector/agent/tool, endpoint override support, shared-credential support, credential refactor, or security regression review.

## Inputs
Credential policy, adapter inventory, request-construction code, synthetic tests, current release version.

## Preconditions
Repository revision is fixed; test secrets are synthetic; relevant adapters are enumerated before conclusions are drawn.

## Required context
Credential ownership/sharing semantics, endpoint configuration surfaces, redirect behavior, DNS/URL canonicalization, and the point where secrets are materialized.

## Allowed tools
Repository search, tests, static analysis, local network sink using synthetic credentials, and `scripts/verify_destination_policy.py`.

## Constraints
MUST NOT use production secrets. MUST NOT infer coverage from one primary HTTP client. MUST distinguish configured policy from effective runtime enforcement.

## Procedure
1. Enumerate every adapter that can both use a credential and accept a user-controlled endpoint.
2. Record whether use-only shared credentials can reach that path.
3. Locate the exact enforcement point for allowlist, canonical host, redirect, and pre-secret checks.
4. Measure baseline parity with the verifier.
5. For each gap, form a specific hypothesis about the bypass path.
6. Patch toward one shared authorization boundary where feasible; otherwise implement equivalent adapter-local enforcement.
7. Add a disallowed-destination negative test that proves rejection occurs before secret materialization.
8. Re-run verifier and tests.
9. Hand off to an independent security reviewer.

## Decision points
If the adapter cannot select a destination, mark it non-applicable. If destination policy is enforced only after secret attachment, treat as failing. If a redirect can escape the allowlist, treat as failing.

## Expected output
Inventory-backed parity report with evidence per adapter and explicit blocking findings.

## Metrics
Applicable adapters, parity percentage, negative-test coverage, findings by severity.

## Verification
Verifier exits 0, negative tests pass, and reviewer independently locates the enforcement boundary.

## Failure handling
Maximum two remediation/test iterations per finding. If evidence remains ambiguous, block release and escalate.

## Stop conditions
Stop only when every applicable adapter has evidence or the release is explicitly blocked.