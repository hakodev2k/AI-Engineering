# CI Pipeline Rules

## Purpose
Define Senior-level controls for reliable, reproducible, and secure continuous integration pipelines.

## Scope
Applies to build, test, lint, scan, package, and artifact-generation workflows.

## MUST
- CI MUST run from version-controlled configuration and produce deterministic results from the same inputs.
- Required quality gates MUST fail the pipeline when critical checks fail.
- Build dependencies and tool versions MUST be pinned or otherwise reproducibly resolved.
- Secrets MUST be injected through approved secret stores and masked from logs.
- Pipeline jobs MUST expose enough logs and artifacts to diagnose failures.
- Expensive or long-running stages MUST have explicit timeouts.

## MUST NOT
- MUST NOT bypass failed quality gates merely to unblock delivery.
- MUST NOT print credentials, tokens, signing material, or sensitive environment values.
- MUST NOT rely on mutable global runner state that can contaminate later builds.

## SHOULD
- Prefer isolated runners or clean workspaces for reproducibility.
- Prefer parallel execution only when stages are independent.

## Exceptions
A temporary bypass requires documented reason, risk, expiry, compensating validation, and approval.

## Verification
Review pipeline definitions, execution logs, runner configuration, artifact provenance, secret masking, failure behavior, and reproducibility across clean runs.