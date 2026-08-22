# Tool Name Collision Identity Guard

## Category
Security / Thinking

## Problem
Aggregated local, deferred, handoff, and MCP tools can share model-visible names even though they route to different callables. Warning-only or last-wins dispatch can make approval, audit, and execution identities diverge.

## Evidence
See `evidence/research.md` for current OpenAI Agents SDK and MCP evidence, including duplicate function-tool collisions and MCP cross-server uniqueness limits.

## Existing approach and limitation
Namespacing and SDK collision policies help, but server display names are not globally unique, dynamic refresh changes the collision set, and approval systems may still key decisions by ambiguous public names.

## Proposed improvement
Fail closed before model exposure unless every model-visible name maps one-to-one to a canonical identity, callable, and approval key. Re-run validation after every effective tool-set change.

## Architecture
- `evidence/research.md` — current evidence, limitations, root causes, metrics.
- `config/policy.json` — secure default policy.
- `rules/identity-rules.md` — enforceable identity invariants.
- `skills/tool-identity-preflight.md` — reusable diagnosis/preflight procedure.
- `subagents/identity-reviewer.md` — independent verifier.
- `workflows/preflight-and-refresh.md` — bounded implementation and refresh workflow.
- `hooks/pre-model-exposure.md` — blocking validation hook.
- `scripts/validate_tool_identities.py` — deterministic validator.
- `tests/fixtures.json` — cross-server duplicate-name fixture.

## Installation
Requires Python 3.10+ and no third-party packages. Copy this directory into the agent/runtime repository.

## Configuration
Start from `config/policy.json`. Production mode should keep fail-closed collision behavior and canonical approval binding enabled.

## Usage
Provide an inventory JSON array containing `server_instance`, optional `namespace`, `name`, `callable_id`, and `approval_key`, then run:

`python scripts/validate_tool_identities.py inventory.json`

Exit 0 allows exposure; non-zero blocks or reports invalid input.

## Workflow
Observe complete tool set → measure collision baseline → diagnose identity layer → build deterministic namespaced exposure map → validate again → independent review → expose.

## Metrics
Unresolved collision count, ambiguous dispatch count, renamed-tool count, approval-binding coverage, unchanged-inventory map stability.

## Verification
The package is **Implemented** when the validator is integrated, **Measured** when the pre/post collision metrics are recorded, and **Verified** when independent review plus positive/negative/refresh fixtures pass.

## Safety
Do not resolve ambiguity by silently dropping tools, selecting the last registered callable, or weakening human approval. Existing in-flight calls may retain a pinned known-good map; new generations must pass fresh validation.

## Failure handling
Detection: validator failure or identity-map drift. Evidence: collision report and inventory generation. Retry: at most two mapping rebuilds per generation, each with a changed hypothesis. Fallback: keep the new generation unavailable. Escalation: runtime owner. Stop: unresolved canonical identity corruption or exhausted retries.

## Definition of Done
Evidence documented; all listed files exist; zero unresolved collisions; approval coverage 100%; dynamic refresh revalidated; negative tests block ambiguity; independent review succeeds; no security boundary is weakened.

## Customization
Adapt the canonical identity fields to the host, but preserve a stable server-instance component and one-to-one binding across model exposure, dispatch, approval, and audit.
