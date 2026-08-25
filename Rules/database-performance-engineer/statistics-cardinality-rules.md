# Statistics and Cardinality Rules
## Purpose
Protect optimizer decisions from stale or misleading data-distribution information.
## Scope
Optimizer statistics, histograms, cardinality estimation, and skew.
## MUST
- Investigate statistics freshness and estimation error when plans degrade unexpectedly.
- Account for skew, correlation, and rapidly changing distributions on critical predicates.
- Validate statistics maintenance changes against workload and maintenance-window impact.
## MUST NOT
- Force statistics refresh indiscriminately during peak production load.
- Attribute every estimation error to stale statistics without evidence.
## SHOULD
- Monitor critical tables for distribution changes that can alter plan quality.
## Exceptions
Emergency refreshes require operational approval when they may materially affect production resources.
## Verification
Inspect statistics metadata, estimated-versus-actual cardinalities, maintenance logs, plan history, and post-change performance.