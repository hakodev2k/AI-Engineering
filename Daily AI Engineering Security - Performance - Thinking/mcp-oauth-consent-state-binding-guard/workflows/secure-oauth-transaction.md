# Workflow — Secure OAuth Transaction

## Trigger
OAuth integration/change, callback incident, new MCP provider, or failed OAuth security fixture.

## Goal
Ensure each authorization transaction is explicitly consented, browser/session bound, client/redirect/resource/PKCE bound, short-lived, single-use, and safely launched.

## Inputs
Current flow, policy, discovery metadata, callback configuration, sanitized traces, test fixtures.

## Baseline
Run legitimate and adversarial fixtures against the current implementation. Record which invalid transactions are accepted, which legitimate transactions fail, and callback/listener behavior.

## Context
Use `evidence/research.md`, `rules/oauth-transaction-integrity.md`, and the exact current MCP OAuth specification/provider requirements.

## Stages
1. **Observe** — map browser, client, proxy/server, IdP, redirect, storage, and callback trust boundaries.
2. **Measure baseline** — execute fixtures; record deterministic decisions.
3. **Diagnose** — identify missing binding or unsafe URL/listener transition.
4. **Form hypothesis** — state one control change expected to block the failing path without breaking the legitimate flow.
5. **Implement** — add/modify transaction binding and deterministic validation.
6. **Measure again** — rerun the identical fixtures.
7. **Checkpoint** — if improvement is absent, return to Diagnose; maximum 2 implementation attempts.
8. **Independent verify** — OAuth Security Verifier reruns critical fixtures and reviews secret-safe logging.
9. **Complete** — record Implemented, Measured, Verified separately.

## Responsible agents
Implementation owner for stages 1–6; `subagents/security-verifier.md` for stage 8.

## Tools
Source inspection, local test IdP/proxy where available, deterministic script, unit/integration tests, sanitized traces.

## Outputs
Baseline report, changed control, before/after results, independent verification, residual risk statement.

## Checkpoints
- No browser launch before authorization URL validation.
- No callback exchange before complete transaction validation.
- No second use of consumed state.
- No loopback authorization before listener readiness when required.

## Metrics
Critical-fixture rejection rate, legitimate-flow success rate, transaction-binding coverage, replay rejection, unsafe URL rejection, secret leakage findings.

## Retry policy
Maximum 2 changed remediation attempts. A retry must change the hypothesis or implementation; identical retries are forbidden.

## Stop conditions
Stop successfully after all required fixtures pass and independent verification succeeds. Stop unsuccessfully after 2 failed remediation attempts, real credential exposure, or an unresolved provider constraint requiring a security weakening.

## Failure path
Constrain/disable the affected OAuth integration, preserve sanitized evidence, rotate exposed credentials if applicable, and escalate to the security owner.

## Verification
Use the deterministic script plus host-native tests; verify callback behavior at the actual integration boundary rather than only unit-level helpers.

## Definition of Done
Evidence documented; baseline captured; root cause identified; improvement implemented; legitimate flow passes; all critical adversarial fixtures fail closed; no secrets exposed; independent verification completed; no blocking issue remains.
