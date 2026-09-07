# Adversarial Red-Team Testing

## Purpose
Challenge guardrails with realistic attacker strategies and chains.

## When to use
Use for high-risk releases, new capabilities, policy changes, incidents, periodic assurance.

## Inputs
Threat model, policies, interfaces, isolated environment, attacks, permissions, criteria.

## Context to inspect
Inspect prompts, retrieval, tools, state, identity, monitoring, bypass history.

## Core knowledge
Test prohibited system outcomes, not only text. Attackers exploit encoding, role confusion, multi-turn setup, indirect content, tools, inconsistent controls.

## Procedure
1. Define outcomes/attacker capability.
2. Isolate safely.
3. Test direct evasion.
4. Test indirect injection/poisoning.
5. Test multi-turn/tool chains.
6. Vary language/encoding/context.
7. Probe privilege/tenant/data.
8. Record traces.
9. Rank findings.
10. Convert fixes to regressions.

## Decision points
Automate mutation; use expert testing for semantic chains.

## Common failure patterns
Famous jailbreaks only, no tools, no benign controls, unreproducible findings, prompt patches for architecture.

## Verification
Retest fixes and adjacent variants.

## Expected output
Red-team report and regressions.

## Stop conditions
Escalate sensitive/privileged exploit paths.