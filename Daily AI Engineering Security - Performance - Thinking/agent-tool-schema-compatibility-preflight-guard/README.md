# Agent Tool-Schema Compatibility Preflight Guard

## Topic
Provider-specific tool-schema incompatibility in MCP and AI-agent tool pipelines.

## Category
**Thinking** — engineering reliable agent planning/execution by preventing invalid tool manifests and malformed deferred tool calls from reaching providers or tool servers.

## Problem
AI agents often discover tools from MCP servers or framework reflection, transform their schemas, and submit them to a model provider. JSON Schema support differs across providers and conversion layers. A schema that is valid at the source can be rejected by the destination provider before inference, or arguments can bypass concrete provider-native validation and fail only at dispatch time.

This failure mode is expensive because one incompatible tool may invalidate a whole manifest, trigger repeated deterministic retries, or make the planner believe a tool is usable when the runtime cannot actually call it.

## Evidence
Recent public signals are documented in `evidence/research.md`. Notable examples include:
- Zed issue #60474 (2026-07-06): MCP schemas accepted upstream but rejected by OpenAI/Azure-compatible tool validation.
- google_workspace_mcp issue #979 (2026-07-28): one incompatible `anyOf` schema can make every turn fail while the MCP server is enabled.
- Hermes Agent issue #73175 (2026-07-28): deferred tool disclosure loses provider-native concrete-schema validation and existing checks were incomplete.
- MCP Python SDK issue #3099 (2026-07-16): published schema aliases and runtime function arguments can diverge.

## Existing approach
Common approaches are provider-side validation, generic JSON Schema validation, SDK/framework auto-conversion, and retry after a 400/tool error.

## Existing limitations
- Provider-side rejection happens after request construction/network latency and may poison the whole turn.
- Generic JSON Schema validity does not prove provider function-schema compatibility.
- Auto-converters can emit unsupported constructs or mutate schema meaning.
- Retrying an unchanged deterministic schema failure wastes latency and tokens.
- Generic/deferred tool bridges may bypass native argument validation.

## Proposed improvement
Insert a deterministic compatibility layer before provider submission and a runtime argument gate before generic/deferred dispatch.

Core mechanisms:
1. provider-specific compatibility profiles;
2. recursive schema linting with actionable JSON paths;
3. stable schema fingerprints;
4. validation cache keyed by fingerprint/profile version;
5. incompatible-tool quarantine where host semantics allow it;
6. no retry for unchanged invalid fingerprints;
7. bounded runtime argument correction;
8. regression-driven provider-profile updates;
9. independent verification of compatibility changes.

## Architecture

```text
Tool discovery / MCP
        ↓
Original schema preservation
        ↓
Schema fingerprint
        ↓
Provider compatibility preflight
        ├── compatible → provider-visible manifest
        ├── optional incompatible → quarantine
        └── required/unknown profile → block
                              ↓
                         Model provider
                              ↓
                   Tool call / generic bridge
                              ↓
                    Runtime argument gate
                              ↓
                         Tool dispatch
```

## Package structure

```text
agent-tool-schema-compatibility-preflight-guard/
├── README.md
├── guide-intergration.md
├── config/
│   └── provider-profiles.json
├── evidence/
│   └── research.md
├── hooks/
│   └── hooks.md
├── rules/
│   └── engineering-rules.md
├── scripts/
│   └── schema_preflight.py
├── skills/
│   └── core-skills.md
├── subagents/
│   └── subagents.md
├── tests/
│   └── test_schema_preflight.py
└── workflows/
    └── workflows.md
```

## Installation
Requires Python 3.10+ and no third-party dependencies.

Clone/copy this directory into the agent host or repository. Keep the script and provider profile config under version control.

## Configuration
Profiles live in `config/provider-profiles.json`.

Included profiles:
- `openai-strict`
- `generic-openai-compatible`
- `gemini-conservative`
- `mcp-baseline`

Profiles intentionally represent conservative engineering rules, not a claim that every model/version from a vendor has identical behavior. Version and test profiles against the concrete providers you operate.

## Usage
Validate a manifest:

```bash
python scripts/schema_preflight.py \
  --input tool-manifest.json \
  --profiles config/provider-profiles.json \
  --profile openai-strict \
  --report preflight-report.json
```

Validate a single schema plus runtime arguments:

```bash
python scripts/schema_preflight.py \
  --input single-tool-schema.json \
  --profiles config/provider-profiles.json \
  --profile mcp-baseline \
  --args candidate-args.json
```

Exit codes:
- `0` compatible;
- `2` incompatible;
- `3` input/config/I/O error.

## Workflow
The primary flow in `workflows/workflows.md` is:

**Observe → Profile → Validate → Classify → Plan → Execute → Measure → Verify**

For an unexpected provider rejection:

**Freeze fingerprint → Capture evidence → Reproduce → Hypothesis → Fixture → Minimal rule change → Regression → Independent verification**

Retries are bounded. An unchanged invalid schema is never retried against the provider.

## Skills
`skills/core-skills.md` defines:
- Provider Schema Compatibility Preflight;
- Runtime Tool Argument Contract Check.

Each skill includes triggers, inputs, procedure, decisions, constraints, metrics, verification, failure handling, and stop conditions.

## Rules
`rules/engineering-rules.md` provides observable MUST / MUST NOT / SHOULD rules.

The central safety invariant is: **do not weaken schema semantics merely to satisfy a provider**.

## Subagents
`subagents/subagents.md` defines three non-overlapping roles:
- Compatibility Investigator;
- Guard Implementation Agent;
- Independent Verification Agent.

The implementation agent cannot be the sole verifier of a new compatibility/normalization rule.

## Hooks
`hooks/hooks.md` defines predictable integration points:
- post-discovery schema preflight;
- provider/model change invalidation;
- pre-dispatch argument validation;
- unexpected provider schema-error capture;
- final verification.

## Metrics
Track at minimum:
- preflight coverage;
- local incompatible tool count;
- quarantined tools by reason;
- provider invalid-schema error rate;
- duplicate invalid fingerprint attempts;
- validation p50/p95 latency;
- runtime argument rejection/correction rate.

Recommended targets:
- `preflight_coverage = 100%` for enabled tools;
- `duplicate_invalid_manifest_attempts = 0` for unchanged fingerprints;
- provider-side schema errors approach zero for covered profiles.

## Verification
Run:

```bash
python tests/test_schema_preflight.py
```

Verification must distinguish:

### Implemented
The guard/profile/hook exists and is wired into the intended boundary.

### Measured
Baseline and post-change metrics have been collected.

### Verified
Regression fixtures pass, enabled tools have 100% preflight coverage, unchanged invalid fingerprints are not submitted, and downstream schema errors are measurably reduced or absent in the observation window.

Do not label a change Verified merely because the script runs.

## Safety
- Fail closed when profile/config is unknown or validator execution fails.
- Preserve original schemas.
- Never remove required/auth/identity/approval fields merely for compatibility.
- Never widen enum/type acceptance merely to silence provider errors.
- Do not log secret argument values in validation reports.
- Quarantine only when the host can safely operate without the affected tool.
- Planner-visible tools must match actually callable tools.

## Failure handling

### Detection
Local exit code 2/3, unexpected provider schema error, schema fingerprint drift, or runtime argument rejection.

### Evidence
Capture provider/profile/version, tool name, schema fingerprint, rule/path, and sanitized provider error.

### Retry policy
- unchanged schema incompatibility: 0 provider retries;
- suspected schema drift: 1 discovery refresh;
- malformed deferred arguments: 1 correction attempt;
- provider-rule investigation: at most 2 evidence-backed hypotheses.

### Fallback
Quarantine optional incompatible tools; block when the tool is required or the manifest is atomic.

### Escalation
Escalate when semantic-preserving compatibility cannot be proven or a provider rejection cannot be reproduced within the bounded investigation.

### Stop condition
Stop rather than weakening correctness/security or entering an unbounded retry loop.

## Definition of Done
- problem and evidence documented;
- provider compatibility profile selected/versioned;
- original schemas preserved;
- all enabled tools preflighted;
- known incompatible fixtures rejected locally;
- compatible fixtures pass;
- runtime deferred-call validation tested where relevant;
- no unchanged invalid fingerprint is retried downstream;
- metrics captured against baseline;
- residual risks documented;
- independent verification complete;
- no blocking incompatibility remains for required tools.

## Customization
Add provider rules only from reproducible evidence or authoritative provider documentation. Add a regression fixture before modifying behavior. Prefer provider-specific restrictions over global restrictions.

The included linter is deliberately small and deterministic. For production systems requiring complete JSON Schema validation, compose it with a standards-compliant validator while retaining this provider-compatibility layer and its fingerprint/quarantine/retry semantics.

## Integration details
See `guide-intergration.md` for rollout, CI, caching, quarantine, runtime validation, metrics, and rollback guidance.

## Research
See `evidence/research.md` for observed evidence, existing approaches, limitations, root-cause hypotheses, success metrics, and source links.
