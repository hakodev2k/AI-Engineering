# Adversarial Example Rules

## Purpose
Reduce security risk from intentionally crafted inputs that cause unsafe or incorrect model behavior.

## Scope
Applies to models exposed to adversarially influenced images, text, audio, tabular, sensor, or multimodal inputs.

## MUST
- Identify whether evasion attacks are credible for the model's deployment context.
- Test security-critical models against representative adversarial perturbations and realistic attacker constraints.
- Measure attack success, clean-performance impact, and defense limitations before claiming robustness.
- Treat robustness results as model- and threat-model-specific evidence.

## MUST NOT
- Claim a model is adversarially robust based on a single attack method or synthetic benchmark.
- Deploy a defense that materially harms safety or correctness without documented trade-off review.
- Assume preprocessing alone eliminates adversarial risk.

## SHOULD
- Use multiple independent attack strategies and adaptive evaluation when stakes justify it.
- Prefer layered mitigations including input controls, detection, fallback behavior, and operational monitoring.

## Exceptions
Reduced testing requires documented infeasibility, threat rationale, compensating controls, and approval.

## Verification
Review attack configurations, threat assumptions, robustness metrics, baseline comparisons, and defense regression tests.