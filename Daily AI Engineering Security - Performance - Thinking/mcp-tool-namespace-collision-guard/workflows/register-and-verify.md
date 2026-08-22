# Workflow — Register and Verify

## Trigger
Any discovery or refresh that may alter active MCP/tool definitions.

## Goal
Produce a deterministic, collision-free model-facing registry without suppressing unrelated tools.

## Inputs
Discovery manifest, prior registry, naming policy.

## Baseline
Capture active tool count, raw duplicate count, normalized collision count, and previous alias churn before changes.

## Stages
1. **Observe** — collect all servers/tools and prior aliases.
2. **Measure baseline** — count collisions and schema changes.
3. **Diagnose** — classify exact, cross-server, normalization, built-in, and drift conflicts.
4. **Form hypothesis** — determine whether stable qualification can disambiguate without changing authorization.
5. **Implement mapping** — generate aliases from stable server ID + raw name; append a short deterministic digest only when qualification still collides.
6. **Measure again** — require one-to-one alias mapping and zero silent omissions.
7. **Verify** — shuffle manifest order and rerun; output MUST be identical.
8. **Publish** — expose the registry only after verification passes.

## Responsible agent
Namespace auditor. The component configuring/implementing server adapters MUST NOT be the only verifier for high-impact tools.

## Tools
Manifest reader, `scripts/mcp_namespace_guard.py`, registry persistence layer.

## Outputs
Alias map, collision report, schema digests, verification result.

## Checkpoints
After discovery, after alias generation, before model exposure.

## Metrics
Stable alias rate=100% for unchanged inputs; unresolved collisions=0; silent dropped tools=0.

## Retry policy
Refresh server discovery and rebuild at most 2 times. Do not retry unchanged ambiguity indefinitely.

## Stop conditions
Success when verification is deterministic and all aliases are one-to-one. Stop blocked after 2 unchanged failures.

## Failure path
Keep the previous verified registry when safe; otherwise disable only the ambiguous tool set and escalate for explicit mapping. Never select a winner by order.

## Definition of Done
Evidence exists, mapping is deterministic, collisions are either safely disambiguated or blocked, permissions are unchanged, and the model sees no ambiguous identifier.