# Differential Privacy for Federated Learning

## Purpose
Apply and validate differential privacy (DP) in federated training with explicit privacy accounting, clipping, noise calibration, and utility trade-offs.

## When to use
Use when model training must provide a formal bound on information leakage about a client or example, especially when aggregate updates may reveal sensitive information.

## Inputs
Privacy unit, target epsilon/delta, sampling scheme, clipping norm, number of rounds, noise mechanism, participation rate, and utility target.

## Context to inspect
Inspect whether privacy is client-level or example-level, whether sampling assumptions match deployment, how secure aggregation interacts with noise, and whether repeated training consumes a shared privacy budget.

## Core knowledge
DP guarantees depend on the privacy unit, neighboring-dataset definition, clipping, noise multiplier, composition, and sampling. An epsilon value is meaningless without its accounting assumptions and delta.

## Procedure
1. Define the protected privacy unit.
2. Specify neighboring datasets and attacker knowledge.
3. Choose client- or example-level clipping.
4. Measure unclipped update norms before selecting thresholds.
5. Select an accountant compatible with the sampling process.
6. Calibrate noise against target epsilon/delta and round count.
7. Integrate secure aggregation where distributed noise or hidden updates are required.
8. Track cumulative privacy spend across experiments and releases.
9. Evaluate utility globally and on important cohorts.
10. Document privacy parameters with the released model.

## Decision points
Use client-level DP when participation itself represents a sensitive entity. Use example-level DP when records within a client are the protected unit. Prefer a simpler privacy mechanism whose assumptions can be audited over a nominally stronger but operationally unverifiable design.

## Common failure patterns
- Reporting epsilon without delta or accountant details.
- Calibrating with the wrong sampling model.
- Setting clipping blindly.
- Reusing privacy budget across untracked experiments.
- Assuming secure aggregation provides DP.

## Verification
Recompute privacy accounting independently, test clipping/noise implementation, and verify measured utility under the exact released parameters.

## Expected output
A DP configuration, privacy ledger, utility analysis, and reproducible accounting evidence.

## Stop conditions
Stop if the privacy unit is undefined, accounting assumptions do not match production, or requested privacy and utility targets are mutually infeasible.