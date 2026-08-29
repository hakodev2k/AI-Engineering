# Fairness and Nondiscrimination Rules

## Purpose
Prevent AI systems from creating unjustified disparate treatment, exclusion, or materially unequal outcomes across relevant populations.

## Scope
Applies to training and evaluation data, model outputs, ranking, recommendations, automated decisions, eligibility, prioritization, and human-AI decision workflows.

## MUST
- High-impact AI systems MUST identify populations for which fairness or nondiscrimination risk is materially relevant to the use case.
- Fairness evaluation MUST use metrics and subgroup analyses appropriate to the decision context rather than a single universal metric.
- Material disparity findings MUST be investigated for data, model, policy, workflow, or deployment causes before approval.
- Governance decisions MUST document which disparities are accepted, mitigated, or escalated and why.
- Proxy variables and derived features that can reproduce protected or sensitive characteristics MUST be assessed when relevant.
- Fairness assumptions MUST be revisited after material changes in data, model, population, policy, or operating context.

## MUST NOT
- MUST NOT claim a system is 'unbiased' solely because protected attributes are excluded from model inputs.
- MUST NOT average results across populations when doing so hides material subgroup harm.
- MUST NOT optimize one fairness metric while ignoring a known severe trade-off without documenting the decision.
- MUST NOT use synthetic balance alone as proof of fair real-world outcomes.

## SHOULD
- Evaluation SHOULD combine quantitative disparity analysis with domain expertise and operational context.
- High-risk systems SHOULD monitor post-deployment outcomes for emerging disparities where lawful and feasible.
- Mitigation SHOULD target root causes rather than cosmetic threshold adjustments when practical.

## Exceptions
Exceptions MUST document the affected population, measured disparity, business or technical constraint, alternatives, residual risk, monitoring, and authorized approval. Legal nondiscrimination duties cannot be waived through an engineering exception.

## Verification
Inspect subgroup metrics, dataset composition, feature reviews, decision thresholds, test methodology, outcome monitoring, reviewer rationale, and approval records. Recalculate sampled fairness metrics from source evidence where feasible.