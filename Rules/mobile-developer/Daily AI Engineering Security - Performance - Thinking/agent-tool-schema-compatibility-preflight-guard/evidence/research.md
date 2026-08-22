# Research — Agent Tool-Schema Compatibility Preflight Guard

## Category
Thinking

## Problem
Agent hosts increasingly bridge MCP or framework-generated JSON Schema into provider-specific tool/function schemas. A schema can be valid enough for the source framework but still be rejected by the destination provider before inference or before dispatch. One incompatible tool may poison an entire turn because the full manifest is submitted together.

## Why it matters now
Recent reports show the failure mode across independent stacks and providers. It creates avoidable 400 errors, tool-call failures, retries, wasted tokens, and misleading agent behavior.

## Current public signals

1. **Zed issue #60474 — 2026-07-06.** Zed reports that an enabled MCP server can expose JSON Schema constructs accepted by MCP yet rejected by OpenAI/Azure-compatible function validation, causing the agent request to fail before inference. Source: https://github.com/zed-industries/zed/issues/60474
2. **google_workspace_mcp issue #979 — 2026-07-28.** Gmail label tools emit an `anyOf` shape that strict providers reject; because all tool schemas are sent with each request, one invalid schema can make every turn fail while the MCP server is enabled. Source: https://github.com/taylorwilsdon/google_workspace_mcp/issues/979
3. **Hermes Agent issue #73175 — 2026-07-28.** Progressive/deferred tool disclosure replaces provider-visible concrete schemas with a generic bridge. Existing validation checked only top-level required keys, so nested type, enum, required, and `additionalProperties` violations could still be dispatched. Source: https://github.com/NousResearch/hermes-agent/issues/73175
4. **MCP Python SDK issue #3099 — 2026-07-16.** A field alias is correctly published in the tool schema but forwarded as an invalid Python keyword at runtime, demonstrating that schema publication and executable argument contracts can diverge. Source: https://github.com/modelcontextprotocol/python-sdk/issues/3099
5. **OpenAI Agents Python issue #2449 — 2026-02-09.** `call_tool()` forwarded calls missing required MCP parameters, producing avoidable server rejection and retries. Source: https://github.com/openai/openai-agents-python/issues/2449

## Observed evidence
- Provider schema dialects are not interchangeable.
- Validation often happens too late: at model request time or after dispatch.
- Tool manifests are frequently all-or-nothing; one bad tool can break unrelated turns.
- Generic or deferred-tool bridges can remove provider-native validation.
- Published schema and runtime callable contract may diverge.

## Interpretation
The host needs a deterministic compatibility gate between tool discovery/transformation and provider submission. The gate should classify failures before model inference, normalize only transformations that are explicitly safe, and quarantine incompatible tools rather than allowing one schema to invalidate the whole manifest.

## Existing approaches

### Provider-side rejection
Let the provider validate the manifest.

**Strength:** authoritative for that provider.

**Limitation:** failure happens after network latency and request construction; the whole turn can fail and the error may be difficult to map back to the originating MCP tool.

### Generic JSON Schema validation
Validate against a JSON Schema meta-schema.

**Strength:** catches malformed schemas.

**Limitation:** provider function-calling dialects intentionally support narrower or different subsets; valid JSON Schema may still be invalid for a provider.

### Framework auto-conversion
SDKs convert Pydantic/Zod/reflection schemas automatically.

**Strength:** low developer effort.

**Limitation:** converters can emit unsupported keywords, omit strict-mode requirements, preserve `$ref`/`$defs` where unsupported, or change aliases/types.

### Retry after 400/tool failure
The agent or host retries.

**Limitation:** deterministic schema incompatibility is not transient. Retrying unchanged manifests wastes latency/tokens and can create loops.

## Root-cause hypotheses
1. JSON Schema has a broader feature set than provider tool-schema dialects.
2. Multiple conversion layers mutate schemas without preserving a compatibility contract.
3. Hosts do not fingerprint validated schemas, so the same invalid manifest is retried repeatedly.
4. Validation does not run per tool before constructing the provider request.
5. Runtime argument contracts are not checked against published schemas.

## Proposed engineering solution
A reusable preflight guard with:
- provider profiles defining forbidden/required schema constructs;
- deterministic recursive linting with JSON paths;
- optional safe normalization for explicitly supported transformations;
- per-tool fingerprinting and validation cache;
- quarantine of incompatible tools instead of poisoning the full manifest;
- runtime argument validation for required keys and unknown properties;
- metrics for rejected tools, provider-request failures, retry reduction, and validation latency;
- independent verification using fixtures for known problematic patterns.

## Improvement target
After integration:
- 100% of configured tool schemas are preflighted before provider submission;
- known incompatible fixtures are rejected locally with actionable paths;
- unchanged invalid schemas are not retried against the provider;
- one invalid tool can be quarantined without disabling unrelated compatible tools when host semantics allow it;
- provider-side `invalid_function_parameters` / invalid-schema failures decrease measurably;
- no schema is silently rewritten in a way that changes requiredness, enum semantics, or accepted argument meaning.

## Success metrics
- `preflight_coverage = validated_tools / discovered_tools`, target 100%.
- `provider_schema_error_rate`, target near zero for covered profiles.
- `duplicate_invalid_manifest_attempts`, target 0 for unchanged fingerprints.
- `quarantined_tool_count` and reason distribution.
- validation p50/p95 latency.
- false-positive/false-negative counts from regression fixtures and production feedback.

## Safety
The guard fails closed for schema incompatibility. It must not weaken required fields, widen enums, remove authorization-relevant parameters, or turn unknown fields into accepted input merely to satisfy a provider. Automatic transformations are allowed only when semantics are preserved and are recorded in a report.

## Sources
- https://github.com/zed-industries/zed/issues/60474
- https://github.com/taylorwilsdon/google_workspace_mcp/issues/979
- https://github.com/NousResearch/hermes-agent/issues/73175
- https://github.com/modelcontextprotocol/python-sdk/issues/3099
- https://github.com/openai/openai-agents-python/issues/2449
- https://github.com/github/copilot-cli/issues/1825
- https://github.com/modelcontextprotocol/inspector/issues/1005
