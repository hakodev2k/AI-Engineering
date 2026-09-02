# Concept Drift Monitoring

## Purpose
Detect changes in the relationship between inputs and outcomes that can invalidate previously acceptable model behavior.

## Scope
Applies when delayed or sampled ground truth, proxy outcomes, or post-decision labels can reveal changes in predictive relationships.

## MUST
- Concept-drift monitoring MUST define which outcome evidence represents the target concept and the expected label delay.
- Quality trends MUST be compared on consistent cohorts and label-complete windows.
- Monitoring MUST distinguish genuine model-quality change from label-pipeline failure or changed outcome definition.
- Significant deterioration MUST trigger model-owner review before baseline acceptance or retraining decisions.

## MUST NOT
- MUST NOT infer concept drift solely from input-distribution drift.
- MUST NOT compare partially matured labels with fully matured historical windows without correction.
- MUST NOT redefine outcome semantics to suppress a degradation signal without approved governance.

## SHOULD
- Use leading proxies only when their relationship to the true outcome is validated and periodically rechecked.
- Segment concept-drift evidence by risk-relevant cohorts.

## Exceptions
Proxy-only monitoring requires documented label constraints, validation evidence, limitations, and owner approval.

## Verification
Review target definitions, label-latency analysis, cohort queries, historical backtests, proxy validation, and incident records.