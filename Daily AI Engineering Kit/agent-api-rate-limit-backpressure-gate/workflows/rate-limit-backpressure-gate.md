# API Rate Limit & Backpressure Gate Workflow

## Trigger
A new/changed downstream integration, bulk fan-out, retry/concurrency change, or incident involving throttling, retry storms, queue growth, or downstream overload.

## Entry conditions
Target call path is known; repository and safe test environment are available.

## Inputs
Call entry point, downstream API contract, concurrency/admission settings, retry policy, queue/buffer behavior, timeout/cancellation rules, logs/tests.

## Stages
1. **Context** — Backpressure Investigator maps request/job → queue → worker → downstream call → retry/recovery.
2. **Static scan** — run `python3 scripts/scan-rate-limit-risk.py <repo> --output scan.json`; exit 1 means findings require review, not automatic failure.
3. **Capacity model** — record max producers, queue depth, workers, per-worker fan-out, and maximum in-flight downstream requests.
4. **Retry model** — classify retryable errors; document backoff, jitter, Retry-After/reset handling, maximum attempts, and total time budget.
5. **Test plan** — define 429 + Retry-After, sustained 503, burst above capacity, queue saturation, and recovery scenarios.
6. **Approval checkpoint** — stop if remediation requires production config/deployment, infrastructure change, breaking contract, or large dependency upgrade.
7. **Execute** — implement only approved/in-scope changes.
8. **Test** — use deterministic stubs where possible; capture request timestamps/counts, in-flight peak, queue/rejection behavior, retry attempts, and recovery.
9. **Review** — inspect diff for nested fan-out, widened timeouts, silent drops, or unrelated changes.
10. **Independent verification** — Verification Agent re-runs critical scenarios and challenges assumptions.
11. **Contract validation** — save assessment JSON and run `python3 scripts/validate-assessment.py assessment.json`.

## Checkpoints
Downstream contract identified; concurrency bounded; pending work bounded; retries bounded; provider metadata handling known; recovery test defined.

## Retry rules
Maximum two reruns for transient test/tool infrastructure failures. Preserve command, output, stub behavior, request timeline, and attempt number. Deterministic failures require diagnosis/change before rerun. After two transient failures, status becomes `blocked`.

## Failure paths
Unknown downstream semantics → blocked pending contract evidence. Verification detects pressure amplification → fail. Dangerous remediation → needs-approval before mutation. Permission/environment failure → preserve evidence and block.

## Stop conditions
Unbounded production load would be required to test; dangerous action lacks approval; two transient attempts fail; downstream retry semantics remain unknown; independent verification finds unresolved storm amplification.

## Produced artifacts
`scan.json` when scanner is used, test evidence, and assessment matching `schemas/assessment.schema.json`.

## Definition of Done
Rate-limit behavior and pressure boundaries are mapped; Retry-After behavior is tested; parallelism and pending work are bounded; storm/recovery behavior is verified; independent verification completed; assessment validates; approvals exist where required; remaining risks are recorded; no blocking failure remains for `pass`.
