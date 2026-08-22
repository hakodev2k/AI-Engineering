# Webhook Signature and Replay Protection Gate

## Trigger
A webhook endpoint is added/changed, provider SDK or middleware changes, signing-secret rotation is planned, or duplicate/forged webhook behavior is investigated.

## Entry conditions
Target endpoint and provider are known; repository inspection and local/test execution are allowed.

## Inputs
Provider signing contract, endpoint/middleware path, header names, secret source, replay/dedup storage, business side effects, tests/logs.

## Stages
1. **Context** — Webhook Investigator maps raw request → verification → replay guard → parsing → side effects → response.
2. **Static scan** — run `python3 scripts/scan-webhook-security.py <repo> --output scan.json`; exit 1 means findings require review, not automatic failure.
3. **Contract extraction** — record exact signed material, algorithm/encoding, freshness rule, provider event identity, and rotation semantics.
4. **Threat scenarios** — define valid, modified body, bad signature, stale timestamp, exact replay, legitimate duplicate delivery, and current/previous secret tests.
5. **Approval checkpoint** — stop before production secret/config/deployment changes, security weakening, breaking contract, or destructive action.
6. **Execute** — implement the smallest in-scope fix.
7. **Test** — execute scenarios through production-equivalent middleware where possible; measure protected business effect count for duplicate/replay cases.
8. **Review** — inspect diff for unrelated changes, secret leakage, bypass paths, or reduced freshness/replay controls.
9. **Independent verification** — Webhook Verifier re-runs relevant negative and rotation tests.
10. **Contract validation** — save assessment JSON and run `python3 scripts/validate-assessment.py assessment.json`.

## Checkpoints
Raw signed bytes identified; constant-time compare confirmed; freshness window enforced; replay key/TTL mapped; duplicate side effects controlled; rotation overlap bounded.

## Retry rules
Maximum two retries for transient tool/test-environment failures. Preserve sanitized input metadata, command output, and attempt number. Deterministic failures require diagnosis/change before rerun. After two transient failures, mark `blocked` and escalate.

## Failure paths
Provider contract unavailable → `blocked`. Security test fails → `fail`. Required production secret/config/deployment change → `needs-approval`. Permission/environment failure → preserve evidence and block.

## Stop conditions
Dangerous action lacks approval; exact signing semantics cannot be established; required verification would expose secrets or mutate production; two repeated transient infrastructure failures; verifier finds an unresolved bypass/replay issue.

## Produced artifacts
Optional `scan.json` plus an assessment matching `schemas/assessment.schema.json`.

## Definition of Done
Valid request accepted; invalid signature rejected; stale timestamp rejected; replay behavior verified; secret rotation tested; no secret leakage found; independent verification complete; assessment validates; approvals obtained where required; no blocking failure remains for `pass`.
