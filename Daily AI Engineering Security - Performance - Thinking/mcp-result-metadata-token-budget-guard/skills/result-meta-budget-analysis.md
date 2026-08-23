# Skill: Result Metadata Budget Analysis

## Purpose
Attribute MCP result context cost to semantic payload versus repeated metadata.

## Trigger
High token usage, context pressure, MCP migration, or unexpected tool-result growth.

## Inputs
Representative JSONL result capture and model-context serialization policy.

## Preconditions
Capture must include at least 20 typical calls when available; preserve originals.

## Procedure
1. Record baseline tokens/task and tool calls/task.
2. Run `scripts/profile_result_meta.py`.
3. Rank repeated `_meta` paths by bytes.
4. Classify each path as semantic, protocol-control, security/correlation, UI/display, or unknown.
5. Propose removal only for verified UI/display fields from the model projection.
6. Replay the same capture through the proposed projection.
7. Compare bytes/tokens and task-level quality checks.
8. Reject the change if correctness/security state is lost.

## Decision points
Unknown/control/security metadata remains. Stable display metadata may be deduplicated. Task-relevant identity remains if the model needs it.

## Expected output
Attribution table, candidate filter paths, baseline, optimized measurements, risk assessment.

## Metrics
Metadata ratio, repeated bytes, tokens/task, quality regression.

## Failure handling
Restore unfiltered projection and document the field causing regression.

## Stop conditions
At most 2 filter/replay iterations; stop early if target savings are met without regression.