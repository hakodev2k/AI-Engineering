# Privacy-Preserving Synthesis

## Purpose
Design synthetic-data generation to reduce disclosure risk while retaining enough statistical and task utility for approved downstream uses.

## When to use
Use when source data contains personal, confidential, proprietary, health, financial, or otherwise sensitive information.

## Inputs
Data classification, privacy requirements, source dataset, generator approach, allowed uses, attack model, utility metrics, retention policy.

## Preconditions
Legal and governance requirements are known. Access to source data is restricted to approved environments.

## Context to inspect
Direct and quasi-identifiers, rare combinations, membership risk, nearest-neighbor similarity, memorization risk, provider retention, logging, export controls, downstream sharing model.

## Core knowledge
Synthetic does not automatically mean anonymous. Generators can memorize or reproduce rare records, and high-fidelity outputs can enable membership or attribute inference. Privacy must be evaluated against a defined attacker model.

## Procedure
1. Classify sensitive fields and linkage risks.
2. Define acceptable disclosure risk and intended sharing boundary.
3. Minimize unnecessary source attributes before training.
4. Choose privacy controls appropriate to risk, including aggregation, clipping, noise, differential privacy, or constrained generation.
5. Prevent direct identifiers from entering prompts or generators unless explicitly required.
6. Test exact and near-duplicate similarity to source records.
7. Run membership or attribute inference tests when appropriate.
8. Evaluate rare-record exposure separately from average risk.
9. Measure utility loss against privacy gains.
10. Document residual risk and approved usage scope.

## Decision points
Use formal differential privacy when measurable guarantees are required and acceptable utility can be preserved. Use non-formal controls only when governance accepts empirical privacy evidence.

## Common failure patterns
Calling data anonymous because names were removed, ignoring rare attribute combinations, testing only aggregate similarity, and exposing sensitive source examples through generation prompts or logs.

## Verification
Privacy tests meet defined thresholds and downstream utility remains acceptable on independent validation data.

## Expected output
A privacy risk assessment, configured generator, privacy test results, and documented usage restrictions.

## Stop conditions
Stop when privacy risk cannot be bounded, governance approval is missing, or utility requires unacceptable disclosure risk.