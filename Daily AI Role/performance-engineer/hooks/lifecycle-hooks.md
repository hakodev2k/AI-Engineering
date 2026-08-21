# Lifecycle Hooks

## Intake hook
Reject tasks lacking a target metric or identifiable workload; request/derive an explicit assumption instead of silently guessing.

## Pre-benchmark hook
Validate environment, dataset, versions, warmup, duration, concurrency, request mix, and stop thresholds.

## Pre-production-test hook
Block disruptive production load until human approval is recorded.

## Post-run hook
Persist configuration, raw results, invalid-run markers, and summary. Idempotently overwrite only the same run identifier.

## Post-optimization hook
Require independent verification for high-impact changes.

## Close hook
Ensure root cause/lesson/process-improvement/prevention are captured when a regression or failed experiment occurred.