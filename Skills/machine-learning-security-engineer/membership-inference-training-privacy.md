# Membership Inference and Training Privacy

## Purpose
Assess whether model behavior reveals whether specific records or populations were present in training, and select controls that reduce privacy leakage.

## When to use
Use for models trained on sensitive, proprietary, user-level, or regulated data; especially when outputs are externally accessible.

## Inputs
Training policy, model, representative member/non-member data, output interface, privacy requirements, and attacker assumptions.

## Preconditions
Use authorized datasets and avoid exposing sensitive records during testing.

## Context to inspect
Review sampling, deduplication, memorization risk, overfitting, confidence outputs, fine-tuning, data retention, and model access controls.

## Core knowledge
Membership inference exploits behavioral differences between training members and non-members. Risk depends on overfitting, output richness, dataset uniqueness, attacker knowledge, and query access. Aggregate benchmark accuracy does not measure privacy.

## Procedure
1. Define the privacy property and realistic attacker knowledge.
2. Construct matched member/non-member evaluation sets without introducing obvious distribution differences.
3. Establish utility and generalization baselines.
4. Apply suitable black-box or white-box membership tests.
5. Measure attack advantage across important subgroups and rare records.
6. Inspect confidence exposure and calibration.
7. Evaluate mitigations such as regularization, deduplication, output reduction, access controls, or privacy-preserving training.
8. Quantify utility/privacy trade-offs.
9. Re-test after mitigation using the same attacker model and stronger variants where feasible.
10. Record residual risk and deployment constraints.

## Decision points
Use formal privacy mechanisms when the requirement demands quantifiable guarantees; use operational controls when the principal risk is unrestricted querying. Avoid claiming privacy from a single empirical attack failure.

## Common failure patterns
Distribution-mismatched evaluation sets; testing only average records; exposing raw confidence unnecessarily; conflating differential privacy with anonymization; ignoring fine-tuning data; reporting attack accuracy without baseline prevalence.

## Verification
Validate evaluation construction, reproduce attacks, compare against random/baseline inference, verify mitigation settings, and document both utility and privacy metrics.

## Expected output
A scoped membership-risk assessment, reproducible evidence, mitigation choice, and explicit residual-risk statement.

## Stop conditions
Escalate when privacy requirements are legally ambiguous, testing requires unauthorized sensitive data, formal guarantees are required but cannot be established, or model/data access is insufficient for valid evaluation.