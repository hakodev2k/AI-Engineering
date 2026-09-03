# Privacy and De-identification Rules

## Purpose
Prevent synthetic datasets from exposing or reconstructing information about real individuals or confidential records.

## Scope
Applies to generators trained, calibrated, prompted, conditioned, or validated with sensitive or person-linked data.

## MUST
- Define the privacy threat model before claiming that an output is privacy preserving.
- Evaluate record memorization, membership inference, attribute inference, nearest-neighbor similarity, and rare-record disclosure risks where relevant.
- Apply privacy controls appropriate to sensitivity, including aggregation, clipping, suppression, differential privacy, or other validated mechanisms when required.
- Treat quasi-identifiers and combinations of low-sensitivity fields as potential re-identification vectors.
- Establish release thresholds for unacceptable similarity to source records.
- Escalate high-risk privacy failures before dataset distribution.

## MUST NOT
- Label data anonymous or de-identified solely because names or direct identifiers were removed.
- Publish examples known to reproduce real source records or uniquely identifying combinations.
- Claim differential privacy unless the mechanism, parameters, accounting, and composition assumptions are documented and valid.
- Weaken privacy checks to improve apparent fidelity without explicit approval.

## SHOULD
- Evaluate privacy at subgroup and tail-distribution levels, not only globally.
- Use held-out source records to distinguish generalization from memorization.
- Prefer conservative release criteria for small, rare, or highly sensitive populations.

## Exceptions
Exceptions require a documented threat model, residual risk, intended audience, compensating controls, and privacy or security approval.

## Verification
Review privacy test reports, similarity distributions, attack results, privacy budgets where applicable, release thresholds, and evidence that failed examples are blocked from publication.