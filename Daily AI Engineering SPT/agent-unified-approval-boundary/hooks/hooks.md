# Hooks

## Pre-registration hook
**Trigger:** tool/adapter registration.
**Action:** require capability, target model, side-effect class, trusted-metadata status and mediation declaration.
**Command:** `python scripts/approval_boundary.py inventory --registry config/adapter-registry.example.json`
**Expected result:** all side-effecting adapters show `mediated: true`.
**Failure behavior:** reject registration.

## Pre-dispatch hook
**Trigger:** immediately before any mutable/open-world effector.
**Action:** canonicalize request and call UAB decision.
**Command:** `python scripts/approval_boundary.py decide --policy config/policy.json --request request.json`
**Expected result:** structured ALLOW, DENY or REQUIRE_APPROVAL.
**Failure behavior:** DENY; do not call effector.

## Pre-approval hook
**Trigger:** REQUIRE_APPROVAL decision.
**Action:** verify an answerable approval channel exists and display exact capability/target/effect digest.
**Expected result:** responder route confirmed before waiting.
**Failure behavior:** DENY immediately if no responder; never wait indefinitely.

## Post-approval hook
**Trigger:** approval received.
**Action:** mint/validate scoped approval token then re-run UAB with unchanged operation digest.
**Command:** `python scripts/approval_boundary.py token --request request.json --ttl 300`
**Expected result:** token bindings exactly match operation.
**Failure behavior:** DENY on mismatch, expiry or malformed token.

## CI non-bypass hook
**Trigger:** permission, tool-registry, MCP, executor or subagent changes.
**Action:** run boundary regression suite.
**Command:** `python -m unittest tests/test_approval_boundary.py`
**Expected result:** all tests pass; zero fake unauthorized effects.
**Failure behavior:** block merge/release.

## Final verification hook
**Trigger:** release candidate.
**Action:** compare inventory with registered routes and confirm audit coverage/timeout configuration.
**Expected result:** 100% side-effect mediation, bounded waits, no unknown enabled route.
**Failure behavior:** block release and escalate to security owner.
