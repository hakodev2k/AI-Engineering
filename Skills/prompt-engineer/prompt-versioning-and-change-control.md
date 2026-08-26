# Prompt Versioning and Change Control

## Purpose
Treat prompts as production artifacts with traceable versions, review, testing, rollback, and ownership.

## When to use
Use for any prompt deployed to users or shared across teams.

## Inputs
Current prompt, repository/process, eval suite, model configuration, owners, release mechanism, and telemetry.

## Context to inspect
Inspect how prompts are stored, loaded, cached, deployed, and associated with model/version and evaluation results.

## Core knowledge
Prompt behavior depends on prompt text plus model, parameters, tools, schemas, and context pipeline. Reproducibility requires versioning the effective configuration, not text alone.

## Procedure
1. Store prompts in a reviewable version-controlled form.
2. Assign stable identifiers and owners.
3. Record model/version, parameters, schemas, tools, and dependencies.
4. Require a change rationale linked to observed need.
5. Run targeted and full regression evals.
6. Review semantic diffs, not only textual diffs.
7. Canary material changes when risk warrants.
8. Attach deployment telemetry to prompt version.
9. Maintain a tested rollback path.
10. Retire obsolete variants to prevent configuration drift.

## Decision points
Use feature flags for risky experiments; direct rollout for low-risk changes with strong regression evidence. Pin versions when provider behavior can change independently.

## Common failure patterns
Editing prompts in dashboards without source control; no mapping from production request to prompt version; simultaneous model and prompt changes; no rollback; stale duplicate prompts.

## Verification
A production output can be traced to exact effective configuration, eval results are reproducible, and rollback is exercised or demonstrably available.

## Expected output
Versioned prompt artifact, change record, test evidence, rollout plan, and rollback reference.

## Stop conditions
Stop deployment when version provenance is missing, regression thresholds fail, or rollback is unavailable for a high-impact change.