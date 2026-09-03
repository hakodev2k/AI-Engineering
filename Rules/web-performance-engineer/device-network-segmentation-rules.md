# Device and Network Segmentation Rules

## Purpose
Ensure performance engineering represents users on constrained hardware, networks, and geographic paths rather than only developer-class environments.

## Scope
Applies to measurement segmentation, test matrices, device capability, network quality, geographic latency, and adaptive delivery decisions.

## MUST
- Identify materially important device and network cohorts from field evidence or explicit product requirements.
- Test critical journeys against representative constrained conditions before high-impact releases.
- Report regressions that disproportionately harm slow-device or slow-network cohorts even when aggregate metrics remain acceptable.
- Validate adaptive behavior against correctness and accessibility requirements.

## MUST NOT
- Use high-end desktop results as representative proof for a heterogeneous user population.
- Exclude poor-performing cohorts merely because they reduce aggregate scores.
- Infer network quality solely from geography or device class when direct telemetry is available.

## SHOULD
- Prioritize optimization where affected cohort size and user harm are greatest.
- Maintain a small stable benchmark matrix supplemented by field segmentation.

## Exceptions
Exceptions require documented population assumptions, evidence, risk, and review.

## Verification
Use RUM cohort analysis, device labs, throttled tests, regional probes, and release comparisons.