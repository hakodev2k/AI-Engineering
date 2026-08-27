# Robustness and Domain Shift Rules

## Purpose
Prevent brittle vision systems from being accepted on narrow in-distribution evidence.

## Scope
Environmental, geographic, temporal, sensor, compression, weather, lighting, viewpoint, and population shifts.

## MUST
- Known deployment shifts MUST have explicit evaluation slices or stress tests.
- Model acceptance MUST define behavior for out-of-distribution, low-quality, or unsupported inputs when detectable.
- Material domain changes in cameras, optics, encoding, environment, or population MUST trigger revalidation.
- Robustness claims MUST cite measured evidence and tested perturbation ranges.

## MUST NOT
- Synthetic corruption benchmarks MUST NOT be presented as complete evidence of real-world robustness.
- Unsupported operating conditions MUST NOT be silently treated as validated.

## SHOULD
- Confidence, abstention, fallback, or human review SHOULD be used where uncertainty can be detected and failure cost is high.

## Exceptions
Uncovered shifts require documented risk acceptance, monitoring, and a plan to collect evidence.

## Verification
Review stress tests, cross-domain holdouts, sensor matrices, OOD behavior, failure thresholds, and post-deployment drift evidence.