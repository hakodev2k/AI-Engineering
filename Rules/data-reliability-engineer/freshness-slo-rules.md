# Freshness SLO Rules

## Purpose
Make data timeliness an explicit reliability target rather than an implicit expectation.

## Scope
Critical datasets, pipeline completion times, event lag, replication delay, and consumer-visible freshness.

## MUST
- Define freshness objectives for business-critical data products.
- Measure freshness at the consumer-visible boundary, not only job start or completion time.
- Alert on sustained or material freshness violations using thresholds tied to impact.
- Distinguish source lateness from processing lateness during diagnosis.

## MUST NOT
- Claim a dataset is fresh solely because the latest pipeline run succeeded.
- Use one universal freshness threshold for datasets with materially different business requirements.
- Silence recurring lag without documented risk acceptance and remediation ownership.

## SHOULD
- Track percentile-based delay and error-budget consumption where useful.
- Publish freshness metadata for consumers.

## Exceptions
Temporary relaxation requires reason, duration, impact, owner, and restoration criteria.

## Verification
Review freshness metrics, timestamps, alert definitions, source lag, orchestration history, and consumer-facing metadata.