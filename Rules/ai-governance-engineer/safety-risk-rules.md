# AI Safety Risk Rules

## Purpose
Identify, assess, control, and monitor harmful AI behavior before it creates unacceptable user, business, societal, or operational impact.

## Scope
Applies to foreseeable misuse, harmful outputs, unsafe autonomy, hazardous advice, cascading failures, model capability changes, and system-level safety controls.

## MUST
- Material AI systems MUST document credible harmful failure modes, affected parties, severity, likelihood or exposure, detectability, and planned controls.
- Safety assessment MUST evaluate the complete system, including prompts, tools, retrieval, orchestration, human workflows, and downstream actions, not only the base model.
- High-severity hazards MUST have preventive and detective controls plus a defined response or shutdown mechanism.
- Safety controls MUST be evaluated under realistic adversarial, edge-case, and degraded conditions where those conditions are credible.
- Residual safety risk above approved tolerance MUST be escalated to an authorized decision maker before production use.
- Material capability, autonomy, or deployment changes MUST trigger renewed safety review.

## MUST NOT
- MUST NOT infer safety from the absence of known incidents.
- MUST NOT use average benchmark performance to dismiss rare but severe hazards.
- MUST NOT rely solely on user instructions or disclaimers where technical controls are reasonably available.
- MUST NOT broaden system autonomy beyond the approved safety assessment without review.

## SHOULD
- Safety assessments SHOULD prioritize severity and exposure over exhaustive enumeration of trivial failures.
- Controls SHOULD favor limiting blast radius, preserving reversibility, and enabling fast disablement.
- Safety evidence SHOULD include representative real-world scenarios in addition to curated tests.

## Exceptions
Exceptions MUST document the hazard, why the standard control is infeasible, alternative controls, residual risk, monitoring, review date, and explicit approval. Catastrophic or legally prohibited risks cannot be accepted as routine exceptions.

## Verification
Inspect hazard analyses, evaluation suites, control configuration, red-team evidence, operational limits, kill switches, incident history, and approval records. Confirm high-severity risks have both prevention and response coverage.