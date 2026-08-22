# Adaptive Throttling Workflow

## Trigger
Repeated 429/503 responses, quota alerts, new provider integration, or evidence of retry-driven latency amplification.

## Entry conditions
A concrete API call path is identified and logs/metrics are available. If no evidence exists, the workflow remains investigation-only.

## Inputs
Failure window, provider headers, request volume, retry settings, timeout settings, affected repository paths, and acceptance criteria.

## Context
Load the API client, retry middleware/SDK config, caller/job retry logic, nearby tests, `config/rate-limit-policy.yaml`, and relevant telemetry only.

## Stages
1. **Context** — `rate-limit-investigator.md` maps retry ownership and collects headers/metrics.
2. **Diagnose** — investigator separates throttling, provider degradation, client timeout, and permanent errors.
3. **Plan** — choose the smallest change: retry classification, backoff/jitter, adaptive concurrency, or telemetry only.
4. **Approval checkpoint** — stop if the plan requires quota increase, production config change, provider plan change, or bypassing the gate.
5. **Implement** — `rate-limit-implementer.md` applies the bounded change and tests.
6. **Deterministic gate** — run `python scripts/adaptive_throttle.py --statuses 429,429,200 --retry-after 1` and the project tests.
7. **Verify** — `rate-limit-verifier.md` independently checks retry multiplication, delay budgets, concurrency bounds, and failure classification.
8. **Complete** — record verified evidence and residual risk.

## Produced artifacts
Investigation finding, implementation diff, test output, deterministic gate result, and verification result.

## Checkpoints
- No implementation before a supported causal hypothesis exists.
- Permanent errors remain non-retryable.
- Total attempts <= 4 and total planned wait <= 90 seconds unless project policy is stricter.
- Concurrency remains inside configured min/max.

## Retry rules
Implementation/verification correction loop: maximum 2 retries. Retry only code/test defects or configuration mistakes. Preserve failed test output and the previous diff. Tool/network failures may be retried up to 3 times with evidence. Permission/approval failures are never retried automatically.

## Failure paths
- Missing telemetry -> `blocked`, request instrumentation.
- Permanent provider/business error -> stop; do not apply throttling retries.
- Test/build failure -> return to implementer, maximum 2 correction cycles.
- Approval-required action -> stop before execution.
- Repeated verification failure -> escalate with preserved evidence.

## Stop conditions
Unsupported hypothesis, exhausted correction budget, missing approval, missing permissions, or total-wait/retry amplification beyond policy.

## Definition of Done
Cause is evidenced; change is minimal; deterministic and repository tests pass; independent verification is `verified`; no unintended changes exist; approval-required actions were either not needed or explicitly approved; remaining risks are documented.
