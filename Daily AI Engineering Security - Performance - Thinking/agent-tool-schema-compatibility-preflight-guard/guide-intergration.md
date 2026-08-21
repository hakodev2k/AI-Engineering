# Integration Guide

## Goal
Insert deterministic tool-schema compatibility checks between tool discovery/transformation and provider submission, plus a lightweight runtime argument gate for generic/deferred tool dispatch.

## Recommended placement

```text
MCP / framework tool discovery
        ↓
Preserve original schemas
        ↓
Provider-profile preflight  ← this package
        ↓
Compatible manifest / quarantine list
        ↓
Model provider
        ↓
Tool-call arguments
        ↓
Runtime argument gate       ← this package when provider-native validation is absent
        ↓
MCP / local tool dispatch
```

## 1. Copy the package
Keep `scripts/schema_preflight.py` and `config/provider-profiles.json` together with your agent host, CI validation, or repository tooling. Python 3.10+ is sufficient; the script uses only the standard library.

## 2. Export the discovered manifest
Preferred normalized shape:

```json
{
  "tools": [
    {
      "name": "search_orders",
      "inputSchema": {
        "type": "object",
        "properties": {
          "customer_id": {"type": "string"}
        },
        "required": ["customer_id"],
        "additionalProperties": false
      }
    }
  ]
}
```

A raw single schema object is also accepted.

## 3. Select an explicit provider profile
Example:

```bash
python scripts/schema_preflight.py \
  --input tool-manifest.json \
  --profiles config/provider-profiles.json \
  --profile openai-strict \
  --report preflight-report.json
```

Exit codes:
- `0`: compatible;
- `2`: incompatible schema/arguments;
- `3`: invalid input/config/I/O.

Do not convert exit `2` into an automatic retry against the provider. It describes a deterministic incompatibility until the schema/profile changes.

## 4. Cache verdicts safely
Use a key containing at least:

```text
provider-profile-name
profile-config-version
schema-fingerprint
SDK/converter version (recommended)
```

Invalidate on provider/model change, MCP reconnect with changed schema, converter upgrade, or profile update.

## 5. Quarantine incompatible tools
If your host supports partial tool manifests, remove only incompatible tools and synchronize all planner-visible metadata so the model is not offered a tool it cannot call.

If the tool is required for the task, or the platform treats the manifest atomically, block the turn with a compatibility error instead of silently degrading behavior.

## 6. Runtime validation for deferred/generic tools
When the model sees a generic bridge rather than the concrete schema, validate arguments before dispatch:

```bash
python scripts/schema_preflight.py \
  --input single-tool-schema.json \
  --profiles config/provider-profiles.json \
  --profile mcp-baseline \
  --args candidate-args.json
```

The included runtime gate checks required fields, unknown properties for closed objects, simple JSON types, and enum membership. It is intentionally not a full JSON Schema engine. Keep framework/server validation too.

## 7. Handle a provider rejection that passed locally
Do not blindly retry. Capture only:
- provider/model;
- profile version;
- tool name;
- schema fingerprint;
- sanitized error code/message/path;
- converter/SDK version.

Then follow Workflow C in `workflows/workflows.md`: reproduce → add failing fixture → smallest rule update → full regression → independent review.

## 8. CI integration
Recommended CI checks:

```bash
python tests/test_schema_preflight.py
python scripts/schema_preflight.py --input path/to/exported-tools.json --profiles config/provider-profiles.json --profile openai-strict
```

For multiple supported providers, run the manifest against each profile used in production.

## 9. Production metrics
Record counters/timers without argument values:
- discovered tools;
- preflighted tools;
- incompatible/quarantined tools by rule code;
- validation latency;
- provider invalid-schema failures;
- duplicate invalid fingerprint attempts;
- runtime argument rejects and correction success.

## 10. Extending a provider profile
Only add a rule when backed by provider documentation or a reproducible provider error. Add a fixture first. Prefer a provider-specific profile change over a global restriction.

Do not use normalization to weaken semantics. Removing requiredness, widening enums/types, or dropping security/identity parameters requires explicit design review and should normally be rejected.

## Rollout
1. **Observe-only:** run preflight and measure findings without changing tool exposure.
2. **Quarantine:** locally remove known-incompatible optional tools.
3. **Enforce:** block unvalidated manifests and unknown profiles.
4. **Verify:** compare provider schema error rate and retry rate to baseline.

## Rollback
If false positives block valid tools, roll back the specific profile rule/version, not the entire preflight layer. Preserve failing evidence and add a regression fixture before re-enabling the rule.
