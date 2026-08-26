# Jailbreak Evaluation

## Purpose
Measure robustness against attempts to override behavioral safeguards.

## Scope
Single-turn, multi-turn, role-play, transformation, encoding, context-manipulation, and adaptive attacks.

## MUST
- Define success criteria before testing and score outcomes consistently.
- Separate complete compromise, partial policy erosion, harmless compliance, and refusal.
- Retest material findings across relevant model or policy versions.

## MUST NOT
- Cherry-pick only successful or failed examples when reporting robustness.
- Treat wording variation as independent evidence without accounting for correlated attacks.

## SHOULD
Use adaptive attacks and held-out attack families to reduce benchmark overfitting.

## Exceptions
Reduced attack breadth requires documented constraints and residual uncertainty.

## Verification
Audit test corpus, scoring rubric, raw responses, version identifiers, and aggregate results for reproducibility.