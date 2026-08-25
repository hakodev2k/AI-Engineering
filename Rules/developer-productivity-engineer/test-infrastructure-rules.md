# Test Infrastructure Rules
## Purpose
Provide deterministic, scalable test execution infrastructure.
## Scope
Test runners, fixtures, environments, sharding, retries, and result collection.
## MUST
- Test infrastructure MUST distinguish product failures, infrastructure failures, and quarantined flakes.
- Parallelization MUST preserve isolation of mutable test state.
- Retries MUST retain first-failure evidence and MUST NOT convert chronic flakes into silent success.
- Test result artifacts MUST identify code revision, environment, shard, and relevant configuration.
## MUST NOT
- MUST NOT share mutable credentials or databases across tests without isolation controls.
- MUST NOT delete failure evidence before triage retention requirements are met.
## SHOULD
- Suites SHOULD optimize critical feedback latency before maximizing raw concurrency.
## Exceptions
Shared fixtures require documented isolation assumptions and cleanup guarantees.
## Verification
Run repeated suites, inject infrastructure failures, inspect retry accounting, shard balance, and artifact traceability.