# Rate Limit & Backpressure Assessment Skill

## Purpose
Verify that outbound API clients and worker pipelines stay bounded under throttling and downstream degradation.

## When to use
Use for HTTP integrations, bulk fan-out, queue consumers, webhook processors, polling jobs, retry-policy changes, or incidents involving 429/503 spikes.

## Inputs
Target entry point, downstream APIs, concurrency model, retry policy, queue/buffer type, timeout budget, relevant tests/logs, and `config/rate-limit-policy.json`.

## Preconditions
Repository is readable and target call path is identifiable. Production mutation is not required.

## Allowed tools
Repository search/read, bundled scanner, local tests/build, disposable stubs/load harnesses, read-only logs/metrics.

## Constraints
Scanner findings are hypotheses. Do not treat every 429 as retryable without checking contract. Do not expose credentials or raw sensitive payloads.

## Procedure
1. Trace producer/request → queue/buffer → worker → downstream call → response handling.
2. Identify maximum in-flight work at each layer: HTTP requests, workers, tasks, queue depth, batches.
3. Identify retryable vs non-retryable failures and where retry state is stored.
4. Verify `Retry-After` or provider reset metadata is honored when present.
5. Verify retry delay uses bounded exponential backoff with jitter and a maximum attempt/time budget.
6. Verify concurrency is explicitly bounded and does not multiply across nested fan-out layers.
7. Verify pending work is bounded by capacity, admission control, dropping, rejection, or producer slowing.
8. Run `python3 scripts/scan-rate-limit-risk.py <repo> --output scan.json` and validate findings in context.
9. Design deterministic tests for: 429 with Retry-After, repeated 503, burst larger than parallelism, and queue saturation.
10. Confirm retries do not increase effective request rate after throttling.
11. Implement the smallest safe change if in scope; stop before approval-required production/config/infrastructure actions.
12. Re-run focused tests/build, inspect the diff, create assessment JSON, and validate it with `scripts/validate-assessment.py`.

## Expected output
Assessment with evidence, affected component, risk, recommendation, verification flags, and remaining risks.

## Verification
A pass requires Retry-After behavior tested, parallelism bounded, queue/admission bounded, and a throttling storm test showing request pressure decreases or remains bounded.

## Failure handling
Retry transient local tool/test infrastructure failures at most twice. Preserve logs and inputs. Deterministic failures require diagnosis before rerun. Permission/environment blockers become `blocked`.

## Stop conditions
Stop when downstream contract is unknown, dangerous change lacks approval, required test cannot be executed safely, or two transient attempts fail.
