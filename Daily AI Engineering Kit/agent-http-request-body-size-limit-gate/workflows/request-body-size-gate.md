# Workflow: HTTP Request Body Size Limit Gate

## Trigger
An HTTP endpoint, upload/import path, body-reading middleware, reverse proxy setting, multipart configuration, request decompression path, or request-size limit changes.

## Entry conditions
Target repository and endpoint scope are known; repository access is available; expected payload behavior can be inferred from requirements/tests or documented as unknown.

## Inputs
Changed files, endpoint names/routes, expected payload sizes, repository-managed proxy/app configuration, tests, scanner output, and any relevant read-only telemetry.

## Context
Trace edge/proxy -> web server -> middleware -> endpoint -> parser/decompression -> storage/downstream side effect.

## Stages
1. **Context** — Body Limit Investigator maps entry points, content types, limits, buffering, decompression, proxy/app layers.
2. **Scan** — Run `python scripts/scan-body-size-risk.py <repo> --output scan.json`.
3. **Evidence** — Confirm/dismiss heuristic findings; record facts separately from hypotheses.
4. **Plan** — Define smallest safe change and targeted tests.
5. **Approval checkpoint** — Stop before production configuration, infrastructure, security weakening, breaking contract, or large dependency upgrade.
6. **Execute** — Implement only approved repository-scoped change.
7. **Test** — Verify normal near-limit request, oversized request, transfer mode without trustworthy Content-Length when applicable, streaming/buffering behavior, and relevant build/tests.
8. **Review** — Re-scan and inspect final diff for global/unintended limit changes.
9. **Independent verify** — Body Limit Verifier re-traces path and challenges evidence.
10. **Contract validate** — Run `python scripts/validate-assessment.py assessment.json`.
11. **Complete** — Status is evidence-based.

## Responsible agents
Investigation: `subagents/body-limit-investigator.md`. Independent verification: `subagents/body-limit-verifier.md`. Implementation may be performed by the host coding agent but cannot be its sole verifier.

## Produced artifacts
`scan.json`, test/build evidence, final diff, and `assessment.json` matching `schemas/assessment.schema.json`.

## Checkpoints
- Effective finite limit identified.
- Oversized body rejected before expensive side effects where practical.
- Multipart/decompression/streaming reviewed when applicable.
- Proxy and application limits aligned or explicitly blocked.
- Normal request regression test passes.

## Retry rules
Tool/environment transient failure: maximum 2 retries, preserving command/output/attempt. Fix-test loop: maximum 2 cycles. Deterministic failure is retryable only after a changed hypothesis, code, or test setup. After budget exhaustion, stop as `blocked` or `fail`.

## Stop conditions
Missing required approval, unresolved high/critical risk, unknown effective deployment limit that prevents verification, exhausted retries, or inability to prove oversized rejection.

## Approval points
Production configuration/deployment, infrastructure change, breaking public API contract, security-control weakening, and large dependency upgrades require explicit human approval before action.

## Failure paths
- Transient tool failure -> bounded retry -> blocked if exhausted.
- Test/build failure caused by change -> fix/retest max 2.
- Permission/environment failure -> preserve evidence -> blocked.
- Required dangerous remediation -> needs-approval.
- Oversized request still reaches expensive processing -> fail until remediated/verified.

## Definition of Done
All entry points are mapped; finite intended limits are known; request enforcement is tested; oversized requests are rejected; streaming/decompression and proxy/app alignment are reviewed; normal requests pass; final diff is scoped; independent verification completes; assessment validation passes; required approvals exist; and no blocking failure remains for `pass`.
