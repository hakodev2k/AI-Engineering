# MCP Schema Preflight Timeout Guard

## Category
Performance

## Problem
AI runtimes can dispatch syntactically valid but schema-invalid MCP arguments, then wait on slow server-side validation, hung handlers, or long timeout budgets. Generic/deferred tool bridges make this worse when concrete provider-native schemas are replaced by a generic dispatcher.

## Evidence
See `evidence/research.md`. Current signals include Hermes Agent reports on 2026-08-04 and 2026-07-28 showing malformed/deferred MCP calls bypassing full pre-dispatch schema checks, plus timeout/hang reports in VS Code Copilot and Claude Code MCP integrations.

## Existing approach
JSON parsing, provider-native validation, shallow required-field checks, server-side validation, fixed/global timeout values, and agent retries.

## Existing limitations
These controls do not consistently catch type, enum, nested, or additional-property violations before dispatch. Longer timeouts protect slow legitimate work but increase the cost of deterministic failures. Repeated identical invalid calls add tool and token overhead without new information.

## Proposed improvement
Resolve the concrete schema at dispatch time, run deterministic client-side preflight, return actionable validation paths without calling the server, fingerprint failures, bound identical repair attempts, then apply a finite tool-specific timeout only to schema-valid calls.

## Architecture
```text
model/tool call
  -> resolve concrete tool + schema
  -> pre-dispatch hook
  -> scripts/mcp_preflight.py
       -> schema violation: repair_required / block_retry
       -> valid: bounded timeout
  -> existing approval/guardrails/middleware
  -> MCP transport/server
  -> result + metrics
```

## Package tree
```text
mcp-schema-preflight-timeout-guard/
├── README.md
├── config/
│   └── policy.json
├── evidence/
│   └── research.md
├── hooks/
│   └── pre-dispatch.md
├── rules/
│   └── tool-dispatch.md
├── scripts/
│   └── mcp_preflight.py
├── skills/
│   └── mcp-call-preflight.md
├── subagents/
│   └── performance-investigator.md
├── tests/
│   └── fixtures.json
└── workflows/
    └── measure-diagnose-optimize.md
```

## Installation
Requires Python 3.9+ and no third-party Python packages. Copy the package into the agent/runtime repository or invoke the script from a pre-dispatch middleware/hook.

## Configuration
Edit `config/policy.json` to set default/max timeout, identical-invalid retry budget, schema-unavailable behavior, and supported validation policy. Keep timeout values finite.

## Usage
Create a request JSON containing `tool_name`, `schema`, `arguments`, optional `prior_invalid_fingerprints`, and optional `requested_timeout_seconds`, then run:

`python scripts/mcp_preflight.py request.json --policy config/policy.json`

Use the structured decision and process exit code described in `hooks/pre-dispatch.md`.

## Workflow
Follow `workflows/measure-diagnose-optimize.md`: observe → baseline → diagnose → hypothesize → integrate preflight → measure again → independently verify.

## Metrics
- p50/p95 invalid-call failure latency
- invalid MCP dispatches prevented
- tool timeout rate
- identical retry count
- repair success rate
- valid-call preflight overhead
- valid-call false rejection rate

## Verification
Use `tests/fixtures.json` as canonical positive/negative cases. Integrators should add a handler invocation counter and prove invalid fixtures produce zero server calls while the valid fixture produces exactly one. Benchmark equivalent before/after runs rather than claiming speedup from design alone.

## Safety
Preflight is not authorization. It must remain before, not instead of, permission checks, approvals, sandboxing, output validation, secret protections, and audit middleware. Missing or unsupported schemas must be explicit; never claim validation that did not occur.

## Failure handling
Detection: non-zero preflight exit, remote timeout, repeated fingerprint, or regression fixture failure. Evidence: retain redacted decision records and timings. Retry: one identical-invalid repair by default; at most two workflow hypothesis revisions. Fallback: if schema cannot be supported safely, mark it unavailable and retain bounded timeout protections according to policy. Escalation: unsupported schema dialect or valid-call regression requires human/runtime maintainer review. Stop: no infinite retries.

## Definition of Done
### Implemented
- Preflight is wired before MCP dispatch.
- Known invalid arguments never reach the server.
- Existing approval/security middleware remains intact.

### Measured
- Baseline and post-change invalid-call latency, dispatch count, retry count, and valid-call overhead are captured.

### Verified
- Invalid enum/type/nested/additional-property fixtures are blocked.
- Valid fixture dispatches normally.
- Legitimate long-running tool behavior is tested.
- No blocking security or correctness regression remains.

## Customization
Replace the lightweight built-in validator with a production JSON Schema library when broader draft/ref support is required, while preserving the same decisions, retry fingerprinting, observable failures, and permission boundaries.
