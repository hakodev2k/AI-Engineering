# Security Testing for Agents

## Purpose
Build repeatable adversarial tests that validate agent security controls across prompts, tools, memory, identities, delegation, and external integrations.

## When to use
Use before release, after capability changes, during security reviews, and after incidents involving agent misuse or unexpected tool behavior.

## Inputs
Threat model, agent workflows, tool inventory, policies, test environment, abuse cases, and acceptance criteria.

## Preconditions
Run destructive tests only in isolated environments with non-production credentials and controlled side effects.

## Context to inspect
Prompt pipeline, model configuration, tools, authorization, sandbox, memory, browser/network access, logging, approvals, and rate limits.

## Core knowledge
Agent security tests must evaluate behavior across multiple turns and capabilities. Success is not merely getting the model to say something unsafe; tests should determine whether protected data or side effects can actually cross deterministic boundaries.

## Procedure
1. Convert prioritized threats into executable abuse cases.
2. Establish clean baseline workflows and expected results.
3. Test direct and indirect prompt injection.
4. Test unauthorized tool calls and resource identifiers.
5. Test secret extraction and data exfiltration.
6. Test memory poisoning and cross-session persistence.
7. Test cross-tenant access and confused-deputy delegation.
8. Test approval bypass, replay, and parameter substitution.
9. Test sandbox escape assumptions, prohibited egress, and resource abuse.
10. Test malformed model outputs and parser edge cases.
11. Vary language, encoding, ordering, context length, and multi-step attack chains.
12. Record control that stopped each attack, evidence, residual risk, and regression case.
13. Re-run the suite against model or prompt changes that could alter behavior.

## Decision points
Prioritize tests by real impact and reachable capabilities, not novelty. Use deterministic expected outcomes for security boundaries; probabilistic model refusal rates are secondary evidence.

## Common failure patterns
Testing only jailbreak text, running once per attack, ignoring side effects, using production systems, failing to preserve regressions, and treating refusal wording as authorization enforcement.

## Verification
Verify every critical threat has at least one negative test and that failed model behavior cannot cross the protected boundary. Confirm test results are reproducible enough to detect regressions.

## Expected output
A versioned adversarial security suite with attack cases, expected control points, evidence, and residual-risk findings.

## Stop conditions
Stop and escalate if tests could cause uncontrolled production side effects or if critical controls cannot be exercised safely in a test environment.