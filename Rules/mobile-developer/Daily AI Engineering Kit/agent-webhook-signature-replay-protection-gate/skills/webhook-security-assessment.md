# Webhook Signature and Replay Protection Assessment

## Purpose
Prove that an inbound webhook authenticates the exact bytes sent by the provider, rejects forged or stale requests, prevents replayed deliveries from creating duplicate effects, and supports safe secret rotation.

## When to use
Use when adding or changing webhook endpoints, upgrading provider SDKs, changing reverse proxies/body parsing, rotating signing secrets, investigating duplicate webhook effects, or reviewing a webhook before release.

## Inputs
Provider signing specification, endpoint entry point, raw-body access path, signature/timestamp headers, secret source, replay/dedup store, business side effects, tests/logs, and `config/webhook-security-policy.json`.

## Preconditions
Provider contract is known from an authoritative source or existing repository contract; endpoint and downstream effect boundary are identifiable; production mutation is not required.

## Allowed tools
Repository search/read, bundled static scanner, local fixture signer, test/build commands, read-only logs/metrics, disposable local/test infrastructure.

## Constraints
Do not expose signing secrets. Treat scanner output as hypotheses. Do not normalize or reserialize payloads before verification unless the provider specification explicitly signs the normalized representation. Never weaken timestamp validation merely to make a test pass.

## Procedure
1. Identify the HTTP entry point and record middleware ordering from socket/body stream through deserialization.
2. Identify the exact signed material: raw body, timestamp, method/path, or provider-specific canonical form.
3. Verify signature calculation uses the provider-required algorithm and encoding.
4. Verify comparison is constant-time using the platform cryptographic primitive.
5. Trace timestamp parsing and enforce a bounded freshness window. Record allowed clock skew and behavior for missing/invalid timestamps.
6. Trace replay protection. Prefer provider event ID or deterministic digest plus expiry. Confirm replay state is committed before or atomically with the protected business effect where feasible.
7. Enumerate duplicate-delivery semantics separately from malicious replay. Ensure legitimate redelivery does not duplicate business effects.
8. Trace secret loading and rotation. Support an overlap window for current and previous secret without accepting arbitrary historical secrets.
9. Run `python3 scripts/scan-webhook-security.py <repo> --output scan.json`; review each hit in context.
10. Create fixture tests for: valid signature, modified body, invalid signature, stale timestamp, exact replay, duplicate provider delivery, and current/previous secret during rotation.
11. Use `scripts/verify-signature-fixture.py` to generate or validate deterministic HMAC-SHA256 fixtures when provider signing semantics match `timestamp.body`. For different provider formats, adapt only the test fixture logic, not the safety requirements.
12. Implement the smallest safe change. Do not perform approval-required production secret/config/deployment actions.
13. Re-run focused tests, build/static checks, inspect the diff, and confirm no sensitive values were logged.
14. Produce an assessment matching `schemas/assessment.schema.json` and validate it with `scripts/validate-assessment.py`.

## Expected output
Evidence-backed findings with affected component, risk, recommendation, verification flags, and remaining risks.

## Verification
A `pass` requires acceptance of a valid request plus rejection of an invalid signature, stale timestamp, and replay, and a tested rotation path.

## Failure handling
Retry transient tool/test-environment failures at most twice. Deterministic failures require diagnosis/change before rerun. Preserve sanitized request metadata, test outputs, and failure scenario. Permission or production-only blockers become `blocked` or `needs-approval`.

## Stop conditions
Stop before secret/config/deployment changes without approval, when provider signing semantics cannot be established, when verification requires production mutation, or after two repeated transient infrastructure failures.
