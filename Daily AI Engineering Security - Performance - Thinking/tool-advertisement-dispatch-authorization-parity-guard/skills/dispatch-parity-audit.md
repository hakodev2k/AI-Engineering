# Skill: Dispatch Parity Audit

## Purpose
Prove that the executor cannot run a capability wider than the effective tool set authorized for a request.

## Trigger
Framework upgrade, resolver change, new agent/tool integration, security review, prompt-injection finding, or any unadvertised tool-call trace.

## Inputs
Representative dispatch traces, request tool sets, tool registry/resolver configuration, authorization policy, framework version.

## Preconditions
Use a non-production test environment for adversarial calls. Identify all tool execution entry points first.

## Required context
Request identity, tenant/user context where applicable, tool names, dynamic selection rules, resolver fallback settings, approval policy.

## Allowed tools
Read-only source/config inspection, trace export, unit/integration tests, package checker. No destructive production calls.

## Constraints
Do not treat the model's advertised schema as authorization evidence. Do not store raw secret arguments. Never weaken tool-local authorization to make a test pass.

## Procedure
1. Capture baseline traces for allowed and deliberately unadvertised tool names.
2. Enumerate framework default, streaming, custom manager, MCP/proxy wrapper, retry and resume paths.
3. Record `request_tools`, requested tool, resolver result and final decision.
4. Run `scripts/verify_dispatch_policy.py` over normalized events.
5. Classify any widening as fallback resolver, stale cache, custom wrapper, post-selection mutation or bypass path.
6. Place parity enforcement at the last boundary before side effect.
7. Re-run baseline and adversarial corpus.
8. Hand off to the independent Security Verifier.

## Decision points
Absent from request and global policy → BLOCK. Present in request → continue to tool-local authorization/HITL. Malformed state → BLOCK. Global exception → require documented owner and independent authorization.

## Expected output
Before/after mismatch table, sanitized decision logs, blocked adversarial fixtures, covered dispatch paths.

## Metrics
Mismatch count, path coverage, fallback usage, false-positive rate, blocked/allowed ratio.

## Verification
Independent verifier reproduces at least one allowed and two blocked cases on every dispatch implementation.

## Failure handling
Retry diagnosis at most twice. On unresolved ambiguity, disable the path or require human review.

## Stop conditions
Stop only when all known paths enforce parity and regression tests pass, or a blocking unknown is escalated.