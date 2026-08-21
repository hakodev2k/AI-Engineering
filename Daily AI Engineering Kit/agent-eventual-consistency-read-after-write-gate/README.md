# Eventual Consistency Read-After-Write Gate

A standalone, bounded verifier for proving that an acknowledged write becomes observable through the read contract that users or downstream systems actually consume.

## Purpose

Turn missing or stale read-after-write behavior into repeatable evidence without retrying the original mutation, hiding intermediate observations, or looping until success.

## When to use

Use after an acknowledged write when a projection, cache, replica, event consumer, search index, or asynchronous workflow may delay visibility. It is also useful when changing one of those boundaries or investigating an intermittent stale-read incident.

Do not use it to issue the write, flush shared caches, alter a consistency model, or prove the root cause of delay. The verifier performs bounded HTTP GET requests only.

## Package contents

```text
agent-eventual-consistency-read-after-write-gate/
├── README.md
├── requirements.txt
├── config/policy.yaml
├── examples/sample-request.json
├── examples/result.example.json
├── hooks/lifecycle.md
├── rules/safety.md
├── schemas/result.schema.json
├── scripts/consistency_gate.py
├── scripts/verify_package.py
├── skills/investigate-consistency.md
├── skills/verify-read-after-write.md
├── subagents/consistency-investigator.md
├── subagents/verification-agent.md
├── tests/test_consistency_gate.py
└── workflows/read-after-write-gate.md
```

## Copy and install

Copy this entire directory into the consumer repository and keep its relative paths intact. Python 3.10+ is required. From the copied package root:

```bash
python -m pip install -r requirements.txt
python scripts/verify_package.py
python -m unittest tests/test_consistency_gate.py -v
```

The runtime dependency is package-local; collection-root files are not required.

## Configuration

`config/policy.yaml` sets the maximum attempt/delay envelope, default acceptable HTTP statuses, and approval boundaries. The CLI loads that file by default from the copied package. Pass `--policy path/to/policy.yaml` only for an explicitly reviewed consumer policy.

A request may narrow acceptable statuses or lower retry/delay values. It cannot exceed the policy maximum or introduce a status not allowed by policy. Keep `max_attempts` at or below four so output remains compatible with `schemas/result.schema.json`.

## Input contract

Start from `examples/sample-request.json` and change the URL, correlation ID, value path, and expectation. The URL must use HTTP or HTTPS and must be an explicitly approved read-only endpoint. Do not place bearer tokens or secrets in committed examples; inject narrowly scoped headers at runtime through a protected consumer-owned request file.

`expect.value` is compared to the value selected by `value_path`. If `expect.version_path` and `expect.min_version` are present, the observed version must be at least the minimum using the reference script's string ordering. Use an application-specific adapter when the domain has different version semantics.

## Run

Run from the copied package root. The example URL is illustrative and requires a separately started local fixture; it is not contacted by package tests.

```bash
python scripts/consistency_gate.py \
  --request path/to/request.json \
  --policy config/policy.yaml \
  --output artifacts/consistency-result.json
```

The script creates the output parent directory when needed and prints the same secret-free JSON result to stdout. It performs only bounded GET requests, adds `X-Correlation-Id` when absent, records every attempt, respects numeric `Retry-After` values within the configured delay cap, and never retries the original mutation.

Exit codes:

- `0`: expected value/version became observable and result is `verified`;
- `2`: request/policy is missing, malformed, or outside the policy envelope;
- `3`: bounded observations completed without verification.

DNS, connection, timeout, and invalid-response failures are preserved as unverified attempt evidence rather than crashing or becoming a false pass.

## Integration

Follow `workflows/read-after-write-gate.md`. Preserve the original write receipt, entity/correlation identity, timestamp, and version; run this verifier through the same read path whose consistency matters; then correlate its evidence with the asynchronous boundary using `skills/investigate-consistency.md`. The host must provide secret injection, endpoint allowlisting, and artifact retention.

## Safety and approval

The package authorizes no production mutation. Explicit human approval remains required before a production write, destructive compensation, shared cache flush, consumer checkpoint change, infrastructure/routing change, consistency-model change, permission expansion, or security-control change. Never broaden credentials to make verification pass.

## Verification

```bash
python scripts/verify_package.py
python -m unittest tests/test_consistency_gate.py -v
```

Package verification covers eventual success through a local loopback server, invalid contract rejection, and policy-bound attempt validation without external services. A consumer integration is verified only when the output conforms to `schemas/result.schema.json`, all attempts are retained, the exact write identity/version is bound to the result, and an independent reviewer confirms the evidence. `examples/result.example.json` is synthetic shape evidence only.

## Failure handling

Correct invalid input instead of retrying it. A transient read may retry only within policy. Persistent stale/missing state permits one evidence-driven investigation re-entry and one final gate run; then stop with `unverified`. Preserve failures and unavailable evidence. Never interpret tool failure or missing output as verified.

## Definition of Done

The expected value and version are observed within policy, evidence is schema-compatible and tied to the acknowledged write, no unintended mutation occurred, required approvals were respected, and remaining risk is recorded. Otherwise the outcome remains explicitly unverified or blocked.

