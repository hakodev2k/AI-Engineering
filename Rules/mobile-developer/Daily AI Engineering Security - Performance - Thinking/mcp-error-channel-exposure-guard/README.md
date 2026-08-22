# MCP Error Channel Exposure Guard

**Category:** Security

## Problem
MCP tool errors may be intentionally forwarded to the model as error results. If those results are built from raw exceptions or downstream bodies, stack traces, internal identifiers, PII, tokens, paths, headers, or service details can cross into model-visible context.

## Evidence
See `evidence/research.md`. MCP issue #3003 identifies the unstructured error-path gap, while the official Python SDK troubleshooting guide confirms that normal tool execution errors can be returned to the model through `is_error` results rather than caught as application exceptions.

## Existing approach
Exception handling, generic safe messages, log redaction, success-output schemas, and host content filtering.

## Existing limitations
Catching exceptions does not guarantee safe MCP error forwarding; success schemas may not constrain failure text; regex-only filters miss registered opaque values; eliminating all detail harms retry and operations.

## Proposed improvement
Split failure handling into two channels: a protected operator diagnostic and a bounded model-safe envelope. The envelope carries only stable code, safe message, retryability, and correlation ID. A deterministic pre-forward guard scans registered secrets and forbidden diagnostic patterns, failing closed if the raw error is unsafe.

## Architecture
- `skills/error-channel-threat-analysis.md` maps failure trust boundaries.
- `rules/error-forwarding-rules.md` defines enforceable safety constraints.
- `subagents/security-verifier.md` independently validates the failure corpus.
- `workflows/harden-error-channel.md` provides bounded measure/diagnose/fix/verify execution.
- `hooks/pre-model-error-forward.md` blocks unsafe forwarding.
- `scripts/sanitize_mcp_error.py` generates a model-safe envelope and detects dangerous raw content.
- `tests/test_sanitize_mcp_error.py` covers safe output, registered-secret leakage, and stack traces.

## Package tree
```text
README.md
evidence/research.md
skills/error-channel-threat-analysis.md
rules/error-forwarding-rules.md
subagents/security-verifier.md
workflows/harden-error-channel.md
hooks/pre-model-error-forward.md
scripts/sanitize_mcp_error.py
tests/test_sanitize_mcp_error.py
```

## Installation
Python 3.9+ with the standard library. Integrate the hook after protected raw-error capture and before any failed tool result is placed into LLM/model context.

## Configuration
Maintain a runtime-only registered-secret map when exact-value scanning is available; do not commit it. Map internal exception classes/downstream statuses to the small public-code set. Configure operator diagnostic access and retention independently of model-facing content.

## Usage
Prepare raw error metadata with only an explicitly authored `safe_message`; raw exception text may exist in the protected input but is never copied into the model-safe output. Then run:

`python3 scripts/sanitize_mcp_error.py --input raw-error.json --output safe-error.json --secrets-file runtime-secrets.json`

Exit 0 means no forbidden marker was detected in the raw captured object and the safe envelope was written. Exit 2 means invalid configuration/input. Exit 3 means unsafe raw content was detected; forwarding must be blocked and a generic envelope used by the host.

Run tests with `python3 -m unittest tests/test_sanitize_mcp_error.py`.

## Workflow
Observe → baseline leakage/size → diagnose error fields → define minimal public error contract → sanitize/separate diagnostics → measure again → independent verification. Maximum two implementation cycles for one root cause.

## Metrics
Forbidden-marker leakage count, registered-secret leakage count, model-facing error bytes, retry success rate, false-redaction count, operator correlation success.

## Verification
Security verification must inject only synthetic markers and confirm zero forbidden marker appears in model-facing results, error payloads remain bounded, public retry semantics still work, and protected diagnostics remain outside model context.

## Safety
Never use production secrets/regulated PII in tests. Never copy operator logs back into the model to “help diagnose” an error. Never weaken authentication, sandboxing, or permission boundaries to reduce error frequency.

## Failure handling
Sanitizer failure blocks forwarding. For detected unsafe raw data, the host returns a generic safe error with correlation ID. Retry is bounded by the host policy. Repeated leakage after two fix cycles escalates to the security owner and blocks release for the affected integration.

## Implemented / Measured / Verified
**Implemented** means the error-channel split and hook are integrated. **Measured** means the same failure corpus has before/after leakage and retry metrics. **Verified** means independent tests show zero covered sensitive-marker leakage while safe retry semantics remain functional.

## Definition of Done
Evidence documented; baseline captured; all error-producing paths mapped; sanitizer integrated; tests pass; zero synthetic secret/PII/stack-trace marker reaches model-facing errors; error sizes are bounded; protected diagnostics remain isolated; independent verifier passes; residual risks are documented; no blocking issue remains.

## Customization
Extend public error codes and forbidden patterns conservatively, but never allow arbitrary exception strings into `safe_message`. Add provider-specific PII detectors or DLP tools at the same pre-forward boundary when required.