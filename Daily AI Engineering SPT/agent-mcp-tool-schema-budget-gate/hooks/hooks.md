# Hooks

## Hook 1 — Pre-session catalog budget check
**Trigger:** agent session/task initialization after tools are registered but before full schemas are sent to the model.

**Action:** export normalized catalog and run audit mode.

**Command:** `python scripts/tool_schema_budget.py catalog.json --mode audit`

**Expected result:** exit 0 when full catalog fits hard budget; exit 2 when selective loading is required.

**Failure behavior:** malformed/unreadable catalog blocks startup integration and is not retried blindly.

## Hook 2 — Pre-model schema promotion
**Trigger:** immediately before constructing the model request for a task needing tools.

**Action:** run selection using current task intent and explicit required tools.

**Command:** `python scripts/tool_schema_budget.py catalog.json --mode select --query "<task intent>" --required <tool> --output selected-tools.json`

**Expected result:** selected schemas fit target/hard policy and all required tools are present.

**Failure behavior:** enter bounded low-confidence fallback; never silently drop required tools or auto-increase hard budget.

## Hook 3 — Tool-catalog change
**Trigger:** MCP `tools/list_changed`, server reconnect/version change, or host-detected schema fingerprint change.

**Action:** invalidate cached selection/index metadata, re-export catalog, rerun audit and representative regression before treating the new catalog as verified.

**Expected result:** new baseline and selector verification are attached to the catalog version.

**Failure behavior:** keep last verified catalog/config when host semantics permit; otherwise block with explicit unverified-catalog status.

## Hook 4 — Post-change regression
**Trigger:** selector algorithm/config/budget threshold changes.

**Action:** run `python -m unittest tests/test_tool_schema_budget.py` and the host's representative task benchmark.

**Expected result:** deterministic tests pass; required-tool recall and quality thresholds pass.

**Failure behavior:** reject rollout and restore last verified configuration.

## Hook 5 — Final verification
**Trigger:** before declaring optimization complete.

**Action:** compare baseline vs selected schema tokens, review benchmark recall, fallback count, task-quality delta, pinned-tool preservation, and measurement method.

**Expected result:** report explicitly separates **Implemented**, **Measured**, and **Verified**.

**Failure behavior:** status remains unverified; token savings alone cannot promote the change.
