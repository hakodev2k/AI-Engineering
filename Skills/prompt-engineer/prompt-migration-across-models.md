# Prompt Migration Across Models

## Purpose
Migrate a production prompt to a new model or model version while preserving intended behavior and exploiting capabilities deliberately.

## When to use
Use for provider/version upgrades, deprecations, cost optimization, or capability migrations.

## Inputs
Current prompt/configuration, source and target models, eval suite, production traces, tool/schema requirements, cost and latency constraints.

## Context to inspect
Inspect model-specific prompt assumptions, unsupported parameters, context limits, structured-output/tool differences, and known source-model workarounds.

## Core knowledge
Prompts encode accidental dependencies on model behavior. A migration should preserve the task contract, not every workaround or wording artifact.

## Procedure
1. Freeze a representative baseline on the source model.
2. Run the unchanged prompt on the target model.
3. Classify differences by capability, instruction following, format, safety, tools, latency, and cost.
4. Remove source-model workarounds that are unnecessary on target.
5. Adapt instructions only for observed failures.
6. Validate tool/schema behavior separately.
7. Re-run full and slice-level evals.
8. Shadow or canary target traffic.
9. Monitor production quality and operational metrics.
10. Maintain rollback until migration is stable.

## Decision points
Prefer minimal adaptation when behavior transfers. Redesign the prompt when the target offers materially different primitives such as native schemas/tools. Do not migrate solely on benchmark reputation.

## Common failure patterns
Rewriting before baseline comparison; changing model and retrieval simultaneously; ignoring safety differences; assuming parameters have equivalent semantics; no rollback.

## Verification
Target clears quality/safety thresholds and operational constraints on held-out and canary traffic, with known differences documented.

## Expected output
Migration diff, adapted prompt, benchmark report, rollout and rollback plan.

## Stop conditions
Stop if required capabilities are absent, regression thresholds fail, or provider/version behavior cannot be pinned sufficiently for the risk level.