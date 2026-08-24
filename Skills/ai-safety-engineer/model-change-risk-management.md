# Model Change Risk Management

## Purpose
Assess and control safety risk introduced by model upgrades, provider changes, fine-tunes, or configuration changes.

## When to use
Use before changing model family/version, system prompt, sampling, context limits, fine-tuning, or safety settings.

## Inputs
Current and candidate configurations, eval suites, release notes, system dependencies, risk thresholds.

## Context to inspect
Capability differences, tool behavior, refusal patterns, latency, cost, context handling, provider controls, and rollback path.

## Core knowledge
A model change can alter behavior nonlocally. Passing generic benchmarks does not prove compatibility with application-specific safety controls.

## Procedure
1. Inventory behavior and controls dependent on the current model.
2. Identify changed capabilities and uncertainty.
3. Run functional, safety, adversarial, and tool-use regressions.
4. Compare risk-relevant slices against baseline.
5. Test downstream parsers and policy assumptions.
6. Define canary population and rollback thresholds.
7. Deploy gradually where feasible.
8. Monitor leading safety signals.
9. Record the release decision and evidence.

## Decision points
Use shadow/canary rollout for uncertain behavior; require full gating before high-consequence tool use.

## Common failure patterns
Treating provider version changes as drop-in; comparing only aggregate quality; no rollback; silently changing safety settings.

## Verification
Confirm candidate meets all release gates and rollback is operationally tested.

## Expected output
A model-change risk assessment, comparative evidence, rollout plan, and rollback criteria.

## Stop conditions
Stop when critical regressions occur or candidate behavior cannot be evaluated adequately.