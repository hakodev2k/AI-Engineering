# Workflow: Secure MCP Authorization Flow

## Trigger
A new MCP OAuth authorization integration, a change to callback handling, or a security regression involving redirect, consent, issuer, resource, or token exchange.

## Goal
Ensure the authorization code can only be accepted by the transaction the user actually consented to.

## Inputs
OAuth/MCP metadata, redirect URI, client identity/metadata, issuer, resource, scopes, PKCE data, state, browser-session correlation, policy, and synthetic security fixtures.

## Baseline
Before change, record which bindings are validated and which malicious fixtures reach callback forwarding/token exchange. Do not use production credentials.

## Context
Read `evidence/research.md`, `rules/oauth-binding-rules.md`, and current MCP authorization security guidance.

## Stages
1. **Observe** — map browser, local client, MCP proxy/server, authorization server, and upstream API trust boundaries.
2. **Measure baseline** — execute synthetic replay/mix-up/substitution fixtures and record current decisions.
3. **Diagnose** — identify missing or independently validated fields that allow transaction confusion.
4. **Form hypothesis** — specify the minimum additional bindings required to block the observed path.
5. **Implement** — create one short-lived record using `scripts/consent_binding_guard.py` or equivalent integration logic.
6. **Measure again** — rerun the exact baseline fixtures.
7. **Independent verify** — `subagents/oauth-security-verifier.md` reviews tests, logs, policy, and secret handling.
8. **Complete** — publish sanitized before/after evidence and residual risks.

## Responsible agent
Implementation owner for stages 1–6; OAuth Security Verifier for stage 7.

## Tools
Repository inspection, deterministic synthetic fixtures, Python 3.11+, application test runner, and secret-safe logs.

## Outputs
Baseline table, implemented transaction-binding logic, callback decisions, regression results, verifier status, and documented residual risks.

## Checkpoints
- Checkpoint A: exact trust boundaries identified.
- Checkpoint B: baseline exploit/mismatch behavior reproduced or explicitly marked not reproducible.
- Checkpoint C: all mandatory bindings implemented.
- Checkpoint D: negative fixtures blocked and valid fixture still succeeds.
- Checkpoint E: independent verifier passes.

## Metrics
Malicious-fixture block rate, valid-flow success rate, replay acceptance count, callback mismatch categories, secret findings, and loopback-policy coverage.

## Retry policy
At most two diagnose/implement/retest cycles. A failed security fixture is not retried by weakening policy.

## Stop conditions
Stop immediately on secret exposure, unauthorized code forwarding, production-impact risk, or inability to identify the authoritative issuer/resource. Escalate after two failed remediation cycles.

## Failure path
Preserve sanitized evidence, invalidate affected test transactions, revert or gate the change, and request human security review for any needed exception.

## Verification
All attack fixtures must be blocked before code forwarding/token exchange. Valid authorization must succeed once and fail on replay. Logs must contain no secret values.

## Definition of Done
Evidence documented; baseline captured; binding implemented; tests pass; loopback behavior measured; no secret leakage; verifier marks `verified`; risks documented; no blocking issue remains.