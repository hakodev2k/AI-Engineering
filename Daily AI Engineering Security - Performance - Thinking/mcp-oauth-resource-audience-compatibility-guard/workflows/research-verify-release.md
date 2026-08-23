# Workflow — Research, Verify, Release

## Trigger
New MCP OAuth provider, provider/config change, MCP authorization spec upgrade, or security regression.

## Goal
Reach an evidence-backed release decision without silently weakening resource/audience isolation.

## Inputs
Provider metadata, canonical MCP resource, scopes, tool inventory, policy, test tokens/introspection evidence.

## Baseline
Record whether `resource` is accepted at authorization and token endpoints, current wrong-audience behavior, and number of tools exposed under fallback.

## Context
Use `evidence/research.md`, `rules/oauth-audience-boundary.md`, and `skills/verify-oauth-resource-boundary.md`.

## Stages
1. **Observe** — collect current provider and MCP configuration evidence.
2. **Measure baseline** — run good- and wrong-audience fixtures.
3. **Diagnose** — classify RFC 8707 support and token-verification path.
4. **Hypothesize** — choose strict binding or an explicitly approved low-risk compatibility fallback.
5. **Implement** — update provider/MCP configuration; never relax unrelated controls.
6. **Measure again** — rerun deterministic checks.
7. **Independent verify** — OAuth Security Reviewer checks evidence.
8. **Release/deny** — release only when Definition of Done is met.

## Responsible agent
Implementer for stages 1–6; `subagents/oauth-security-reviewer.md` for stage 7.

## Tools
Provider metadata endpoints, test MCP client/server, `scripts/audience_guard.py`.

## Outputs
Baseline, before/after decisions, fallback record if used, independent review, release decision.

## Checkpoints
After baseline, after configuration change, before release.

## Metrics
Wrong-audience rejection = 100%; high-impact fallback = 0; silent fallback = 0.

## Retry policy
At most 2 configuration retries. Each retry must change a concrete hypothesis or configuration value and rerun both positive and negative tests.

## Stop conditions
Stop immediately on wrong-audience acceptance, unverifiable high-impact token, secret exposure, or exhausted retries.

## Failure path
Block affected tools, preserve logs/evidence, escalate to identity/security owner. Do not broaden scopes or bypass validation.

## Verification
Independent reviewer must reproduce or inspect deterministic evidence and confirm no raw tokens are persisted.

## Definition of Done
Evidence documented; baseline captured; resource compatibility classified; audience validation implemented; wrong-audience fixture rejected; high-impact fallback absent; tests pass; risks/fallback expiry documented; independent review approved.
