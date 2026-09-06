# Safety Policy Behavior Testing

## Purpose
Validate that an AI system follows intended safety and policy behavior without creating excessive false refusals that break legitimate use.

## When to use
Use for assistants, agents, copilots, moderation-sensitive workflows, or any system with explicit allowed and disallowed behavior.

## Inputs
Policy requirements, system instructions, risk taxonomy, representative benign and harmful requests, expected response behavior, and escalation rules.

## Preconditions
Policy owners have defined the required behavior at a level that can be tested.

## Context to inspect
Inspect system prompts, policy classifiers, guardrails, tool permissions, refusal templates, logging, and known policy incidents.

## Core knowledge
Safety quality has at least two error classes: harmful compliance and unnecessary refusal. Tests should cover direct requests, indirect framing, multi-turn escalation, obfuscation, role-play, quoted content, and benign look-alikes.

## Procedure
1. Translate policy requirements into observable test categories.
2. Build positive, negative, boundary, and ambiguous cases.
3. Include multi-turn and transformed variants.
4. Define expected comply, refuse, safe-complete, or escalate behavior.
5. Run the system with version metadata captured.
6. Measure harmful-compliance and false-refusal rates separately.
7. Inspect severe failures manually.
8. Test policy consistency across languages and formats when relevant.
9. Verify tool access remains constrained even when text behavior is safe.
10. Add confirmed failures to a protected regression suite.

## Decision points
Use strict hard gates for severe harmful-action categories. For ambiguous low-risk content, prefer calibrated safe completion over blanket refusal when policy permits.

## Common failure patterns
Testing only obvious prompts, ignoring benign near-neighbors, measuring one aggregate safety score, failing to test tool actions, and accepting policy drift after model upgrades.

## Verification
Confirm severe categories meet hard thresholds and false-refusal behavior remains within product acceptance criteria.

## Expected output
A safety behavior report with per-category pass rates, severe failures, false refusals, and release recommendation.

## Stop conditions
Stop when policy requirements conflict, ownership is unresolved, or severe failures require security/safety escalation.