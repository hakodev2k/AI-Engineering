# Skill: Environment Drift Analysis

## Purpose
Detect and resolve meaningful divergence between desired configuration and actual environments.

## Trigger
Works-in-one-environment failures, configuration mismatch, manual hotfix, IaC drift, expired dependency/credential, or inconsistent deployment result.

## Inputs
Desired state, deployed versions, configuration metadata, infrastructure state, secrets references/versions, runtime versions, policies, and timestamps.

## Procedure
1. Define the expected baseline and comparison scope.
2. Collect read-only state from each relevant environment.
3. Normalize values while redacting secrets.
4. Categorize differences: intentional, expected temporal, configuration, infrastructure, runtime, permission, artifact, or unknown.
5. Rank drift by user/security/reliability impact.
6. Identify the authoritative source for each drifted property.
7. Plan convergence through managed configuration/IaC rather than undocumented manual edits.
8. Verify convergence and record any intentional exception with owner and expiry.

## Outputs
Drift report, source-of-truth mapping, convergence plan, exception list, and verification evidence.

## Constraints
Never print secret values. Do not automatically overwrite production drift when intent is uncertain.

## Stop conditions
Require approval before destructive convergence or when drift may be an active emergency mitigation.