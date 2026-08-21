# Workflow: Harden MCP Error Channel

## Trigger
New/changed MCP tool, observed diagnostic leakage, or security review.

## Goal
Keep failure semantics useful for the model while preventing confidential diagnostics from reaching model-visible content.

## Inputs
Failure corpus, current MCP results, sanitizer policy, downstream error mappings.

## Baseline
Measure raw error size, forbidden-marker count, current retry success, and which raw fields reach model context/logs.

## Stages
1. Observe representative synthetic failures.
2. Measure baseline leakage and payload size.
3. Diagnose raw exception/downstream fields crossing the trust boundary.
4. Form a minimal public-error hypothesis: code + safe message + retryability + correlation ID.
5. Implement sanitization and protected diagnostic separation.
6. Measure again against the same corpus.
7. Run independent security verification.
8. Complete only when leakage is zero for covered forbidden markers and retry quality remains acceptable.

## Responsible agent
Implementation agent changes mappings; `subagents/security-verifier.md` independently verifies.

## Tools
`scripts/sanitize_mcp_error.py`, unit tests, MCP integration harness, protected logging/trace system.

## Outputs
Before/after evidence, safe error mapping, verification report, residual-risk record.

## Checkpoints
No release if a raw fixture marker appears in model-visible error content. No production-secret fixture may be introduced.

## Metrics
Forbidden-marker leakage count, error bytes, retry success rate, false-redaction count, diagnostic correlation success.

## Retry policy
Maximum two implementation/verification cycles for the same root cause.

## Stop conditions
Stop on repeated leakage, inability to separate operator/model channels, or policy conflict requiring security-owner review.

## Failure path
Return a generic non-sensitive error envelope, disable automatic retry for the affected error class when necessary, and escalate with sanitized evidence.

## Verification
Run the full synthetic corpus; validate bounded payload size; confirm operator detail is accessible only by correlation ID through protected storage.

## Definition of Done
Baseline measured; mapping implemented; tests pass; zero forbidden markers reach model-facing error results; retry semantics are measured; independent verifier returns PASS; no secrets are present in repository artifacts.