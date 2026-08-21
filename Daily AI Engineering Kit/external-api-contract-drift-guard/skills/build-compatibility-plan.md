# Skill: Build Compatibility Plan

## Purpose
Turn drift analysis into a minimal, testable migration plan with rollback boundaries.

## When to use
After contract drift has been classified and affected consumers have been mapped.

## Inputs
- drift assessment;
- current integration architecture;
- supported upstream versions;
- project build/test commands;
- rollout constraints.

## Preconditions
All breaking, potentially-breaking, and unknown drift items have explicit dispositions.

## Process
1. Group drift items by consumer and runtime path.
2. Decide strategy per group: no code change, tolerant reader, adapter translation, dual-version support, generated-client refresh, feature flag, staged migration, or explicit incompatibility.
3. Prefer changes at integration boundaries rather than leaking provider-specific changes into domain code.
4. Define exact files/symbols expected to change.
5. Define tests proving old behavior, candidate behavior, error handling, and fallback where applicable.
6. Define rollout and rollback signals.
7. Mark approval-required operations.
8. Record unresolved provider assumptions.
9. Produce an ordered implementation plan with checkpoints.

## Allowed tools
Repository read/search, local test discovery, architecture documentation, non-destructive commands.

## Constraints
- No implementation edits in this skill.
- No weakening validation solely to accommodate unknown provider behavior.
- No removal of old-version compatibility without evidence that support is no longer required.

## Expected output
A compatibility plan listing change groups, affected files, tests, rollout, rollback, approvals, and residual risks.

## Verification
Every high-risk drift item maps to at least one plan action or a documented no-change justification.

## Failure handling
If plan scope becomes materially larger than the original task, stop and request human scope approval before implementation.

## Stop conditions
Stop if production auth, breaking public contracts, infrastructure, or destructive migrations are required without approval.
