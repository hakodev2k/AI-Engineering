# Tool-Use Post-Training

## Purpose
Train models to select, call, and recover from tools reliably while respecting schemas, permissions, and execution feedback.

## When to use
Use when a model must invoke APIs, functions, search, code execution, or agent tools and base behavior shows wrong-tool selection, malformed arguments, unnecessary calls, or weak recovery.

## Inputs
Tool schemas, execution traces, successful and failed trajectories, authorization rules, target tasks, latency/cost constraints, and tool-use evaluations.

## Preconditions
Tool contracts are stable enough for training, dangerous actions are externally permissioned, and execution outcomes can be recorded accurately.

## Context to inspect
Review tool descriptions, argument schemas, ambiguity between tools, error responses, idempotency, parallel-call support, context-window effects, and deployment parser behavior.

## Core knowledge
Tool use combines decision making with strict protocol adherence. Training should distinguish whether to call, which tool to call, how to construct arguments, how to interpret results, and when to stop. Model tuning cannot replace deterministic authorization. Failed tool calls are valuable supervision when they teach recovery rather than repeated retries.

## Procedure
1. Define task-level success and tool-call correctness separately.
2. Collect representative no-tool, single-tool, multi-tool, and failure-recovery trajectories.
3. Validate schema formatting exactly as production expects.
4. Include negative examples where calling a tool is unnecessary or prohibited.
5. Teach argument grounding from user/context data rather than invented values.
6. Add recoverable failures such as timeouts, validation errors, empty results, and partial responses.
7. Train the model to interpret execution output before taking the next action.
8. Include explicit completion examples so loops terminate.
9. Evaluate tool selection, schema validity, argument accuracy, task success, call count, and latency.
10. Test schema changes and ambiguous tool descriptions.
11. Verify behavior around irreversible actions with external approval boundaries.
12. Compare against prompting-only and constrained-decoding baselines.

## Decision points
Use constrained decoding for syntax guarantees where available; use post-training for semantic selection and recovery. Parallelize independent calls only when ordering is irrelevant and costs are acceptable. Keep authorization outside the model for consequential actions.

## Common failure patterns
Tool hallucination; valid syntax with wrong semantics; repeated retry loops; ignoring error output; unnecessary tool calls; fabricated arguments; training against a schema different from production.

## Verification
Run end-to-end execution tests against realistic sandboxes. Measure task success, invalid-call rate, wrong-tool rate, unnecessary-call rate, retries, and recovery success. Audit high-impact calls manually.

## Expected output
A tool-use-capable checkpoint with trajectory dataset lineage, end-to-end metrics, failure-recovery results, and documented runtime constraints.

## Stop conditions
Stop if production schemas are unstable, permissions depend on model discretion, execution traces cannot be trusted, or tuning increases consequential wrong-tool actions.