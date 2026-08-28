# Behavioral Detection Rules

## Purpose
Guide detection of suspicious behavior that cannot be reliably identified by static indicators alone.

## Scope
Applies to sequence, anomaly, peer-group, baseline, and behavior-based detections.

## MUST
- Behavioral detections MUST define the behavior of interest, expected benign variants, and observable evidence.
- Baselines MUST use an explicitly defined population, time window, and minimum data quality threshold.
- Thresholds MUST be justified by data or controlled validation rather than intuition alone.
- Changes to behavioral models MUST be evaluated for drift, false positives, and missed known attack patterns.

## MUST NOT
- MUST NOT label ordinary rarity as malicious without contextual evidence.
- MUST NOT use opaque scoring as the sole reason for a high-severity alert when contributing signals cannot be explained.
- MUST NOT reuse a baseline across materially different populations without validation.

## SHOULD
- Behavioral detections SHOULD combine independent signals when practical.
- Expected seasonality and operational events SHOULD be accounted for.

## Exceptions
Exceptions require documented data limits, risk analysis, compensating logic, and approval.

## Verification
Review baseline statistics, threshold evidence, alert samples, drift reports, and replay results against known benign and malicious scenarios.