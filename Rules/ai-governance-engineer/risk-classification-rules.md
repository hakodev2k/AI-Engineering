# AI Risk Classification Rules

## Purpose
Classify AI systems consistently so governance rigor is proportional to potential harm, regulatory exposure, and operational impact.

## Scope
Applies to initial classification, reclassification, risk-tier criteria, and governance obligations derived from risk level.

## MUST
- Every governed AI system MUST receive a documented risk classification before production approval.
- Classification criteria MUST consider intended use, affected population, decision criticality, autonomy, reversibility, data sensitivity, security exposure, potential physical or financial harm, legal rights, scale, and dependence on model outputs.
- High-impact or rights-affecting uses MUST receive enhanced review regardless of model size or implementation simplicity.
- Classification MUST be revisited after material changes to purpose, users, autonomy, data, model, provider, jurisdiction, or deployment scale.
- Ambiguous cases MUST be escalated to the more conservative applicable tier until evidence supports a lower classification.
- Each risk tier MUST map to explicit lifecycle controls and approval requirements.

## MUST NOT
- MUST NOT classify risk solely from the underlying model's provider label or benchmark performance.
- MUST NOT lower a risk tier merely to reduce review effort or meet a delivery date.
- MUST NOT assume an internal-only deployment is low risk when it influences consequential decisions or sensitive data.
- MUST NOT use average-case impact to ignore credible severe failure modes.

## SHOULD
- Classification schemes SHOULD use clear thresholds and examples to reduce reviewer inconsistency.
- Risk scoring SHOULD preserve qualitative rationale rather than relying only on a numeric total.
- Reclassification triggers SHOULD be automated where inventory or monitoring signals make that practical.

## Exceptions
Exceptions to standard classification criteria MUST document the conflicting facts, evidence, residual uncertainty, decision owner, and approval. Safety or legal uncertainty MUST NOT be waived by a delivery team alone.

## Verification
Inspect classification records, scoring inputs, reviewer comments, risk-tier mappings, and change history. Sample systems across tiers and verify equivalent facts produce materially consistent outcomes.