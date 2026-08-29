# Model Capability Rules

## Purpose
Prevent product commitments from exceeding demonstrated model capability.

## Scope
Applies to model selection, capability claims, feature feasibility, and launch criteria.

## MUST
- Product requirements MUST distinguish required model behavior from optional quality improvements.
- Capability claims MUST be supported by representative evaluation evidence, not isolated demonstrations.
- Known failure modes, uncertainty, context limits, latency, and cost constraints MUST be reflected in product design.
- Model changes that can materially alter user-visible behavior MUST trigger regression evaluation.

## MUST NOT
- MUST NOT promise deterministic behavior from a probabilistic model unless enforced by deterministic controls.
- MUST NOT market benchmark scores as equivalent to product task success without validated correlation.
- MUST NOT hide material model limitations from stakeholders making launch or contractual decisions.

## SHOULD
- Requirements SHOULD define acceptable degradation and fallback behavior.
- Capability reviews SHOULD compare model-based and non-model controls.

## Exceptions
Any unsupported capability assumption requires explicit risk ownership, bounded exposure, and a validation deadline.

## Verification
Review evaluation results, model cards or equivalent documentation, acceptance thresholds, regression tests, cost and latency measurements, and user-facing claims.