# Skill — MCP Annotation Risk Audit

## Purpose
Audit whether an MCP host uses server-supplied tool annotations safely and consistently.

## Trigger
Run when integrating a new MCP server, changing approval logic, refreshing a tool catalog, or investigating approval fatigue/security regressions.

## Inputs
- MCP `tools/list` output.
- Server identity and locally established trust classification.
- Host approval policy.
- Decision logs or representative tool calls.

## Preconditions
The server identity must be known. Trust must be sourced from local configuration, not server metadata.

## Required context
The evaluator semantics in `scripts/mcp_annotation_gate.py` and rules in `rules/trust-boundary.md`.

## Allowed tools
Read-only inspection, local policy evaluation, test execution, schema validation.

## Constraints
Do not execute target MCP tools as part of the audit. Do not infer safety from names alone.

## Procedure
1. Inventory every tool and annotation field.
2. Normalize missing fields to pessimistic MCP defaults.
3. Mark each server as trusted or untrusted from local policy.
4. Detect any path where an untrusted hint lowers approval requirements.
5. Detect trusted read-only tools that still incur avoidable prompts.
6. Evaluate representative tools with the gate script.
7. Record decision, normalized risk facts, and reason codes.
8. Run negative tests for dishonest annotations and missing fields.
9. Recommend policy changes only when security invariants remain intact.

## Decision points
- If server trust is unknown, treat as untrusted.
- If `readOnlyHint=true` conflicts with known behavior, block auto-approval and escalate.
- If a tool is open-world or destructive, prefer `ask` or `deny` according to local policy.
- If catalog identity or annotations changed, invalidate prior decision evidence.

## Expected output
An audit table containing server, tool, trust, raw hints, normalized facts, decision, reasons, and remediation.

## Metrics
Approval-rate reduction for trusted read-only tools; zero risk-lowering decisions from untrusted hints; annotation coverage; mismatch count.

## Verification
All security fixtures pass and the audit can explain each decision without hidden model reasoning.

## Failure handling
Malformed metadata fails closed. Missing trust classification becomes untrusted. If policy cannot be loaded, return a blocking error.

## Stop conditions
Stop when all tools are classified, no untrusted hint weakens policy, and high-risk mismatches are either fixed or explicitly escalated.
