# Fallback Model Behavior Parity Investigation

## Purpose
Prove that an LLM fallback preserves required behavior before routing production traffic to it.

## When to use
Use when adding/changing a fallback model, provider, model version, routing policy, or failover path.

## Inputs
Primary and fallback evaluation JSON, acceptance scenarios, routing constraints, cost/latency budgets.

## Preconditions
Run both models against identical frozen inputs and tool fixtures. Record model identifiers and evidence. Do not use production side effects.

## Allowed tools
Repository read/search, test runners, local scripts, sandboxed model/evaluation harnesses, read-only telemetry.

## Constraints
Do not weaken acceptance criteria to make fallback pass. Do not expose secrets or production data. Production routing changes require human approval.

## Procedure
1. Identify the exact failover trigger and current primary/fallback identifiers.
2. Freeze scenario inputs, tool fixtures, system instructions, schemas, and evaluator version.
3. Cover structured output, tool selection, refusal boundary, and context grounding plus repository-specific critical paths.
4. Run the primary and preserve raw evidence.
5. Run the fallback with the same fixtures.
6. Validate both result files with `scripts/validate_results.py`.
7. Compare with `scripts/compare_results.py`.
8. Investigate each failure independently; distinguish capability mismatch, prompt incompatibility, tool/schema incompatibility, latency, and cost regression.
9. Permit at most two corrective implementation iterations. Re-run the full frozen suite after each change.
10. Hand results to the independent verifier.

## Expected output
A machine-readable parity report plus evidence references and unresolved risks.

## Verification
All required scenarios exist; fallback passes every primary-passing safety/contract scenario; score, latency, and cost stay within configured thresholds.

## Failure handling
Transient model/tool failure: retry once while preserving the failed attempt. Deterministic validation failure: do not retry unchanged inputs. Repeated failure: stop after two corrective iterations and escalate.

## Stop conditions
Stop on missing evidence, unavailable required model, permission failure, approval-required routing change, or parity failure after the bounded repair loop.
