# Skill: Inspect Feature Flag Rollout

## Purpose
Assess whether a feature-flagged change is safe to roll out and produce evidence for a rollout plan.

## When to use
Use before introducing a new flag, changing targeting, changing defaults, or increasing production exposure.

## Inputs
- Repository root
- Flag contract JSON
- Target environment
- Acceptance criteria
- Available telemetry and rollback signals

## Preconditions
- Repository is readable.
- Flag provider/configuration source is identifiable.
- Production mutation is not required during inspection.

## Allowed tools
Repository search, read-only provider/config access, test/build commands, `scripts/scan-feature-flags.py`, and `scripts/validate-flags.py`.

## Constraints
Do not mutate production flags. Do not expose secrets or sensitive targeting attributes.

## Procedure
1. Run the feature-flag scanner and identify all flag evaluation/configuration points relevant to the requested change.
2. Trace the flagged branch from entry point to side effects.
3. Locate nearby tests, telemetry, fallback behavior, and existing rollout conventions.
4. Validate the proposed contract with `scripts/validate-flags.py` for the target environment.
5. Confirm owner, expiry date, kill switch, default, environments, targeting, rollout percentage, success metrics, and rollback conditions.
6. Identify business or technical side effects that are irreversible or expensive to compensate.
7. Separate facts from hypotheses and attach file/test/metric evidence to each important finding.
8. Produce a recommended next rollout step from the configured allowed percentages.
9. Stop before any approval-required production action.

## Expected output
A rollout assessment containing findings, evidence, current exposure, recommended next step, rollback criteria, approval requirements, and unresolved risks.

## Verification
The contract validates, all relevant evaluation points are accounted for, and every rollout recommendation has at least one success and rollback metric.

## Failure handling
Retry read-only tooling failures at most twice. Do not retry validation failures without changing inputs. Stop on permission failures or ambiguous production source-of-truth.

## Stop conditions
Stop when evidence is insufficient, the flag is stale/unowned, a kill switch is missing, or production approval is required.
