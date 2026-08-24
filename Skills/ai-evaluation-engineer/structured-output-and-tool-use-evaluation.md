# Structured Output and Tool-Use Evaluation

## Purpose
Evaluate whether AI systems produce valid structured outputs and invoke tools correctly, safely, and efficiently.

## When to use
Use for JSON/schema-constrained generation, function calling, API orchestration, workflow automation, and agent tool use.

## Inputs
- Output schemas or tool contracts
- Candidate traces
- Expected actions
- Error cases
- Permission and side-effect rules

## Context to inspect
Inspect tool schemas, validators, retries, fallback logic, side-effect permissions, idempotency requirements, and parser behavior.

## Core knowledge
Correct tool use requires more than syntactically valid arguments. Evaluation must distinguish schema validity, semantic argument correctness, tool selection, sequencing, error recovery, and side-effect safety.

## Procedure
1. Define machine-checkable schema and action invariants.
2. Build cases for valid, missing, ambiguous, and conflicting inputs.
3. Validate syntax and schema compliance automatically.
4. Compare chosen tool and arguments against task requirements.
5. Test multi-step sequencing and dependency handling.
6. Inject tool errors, timeouts, and partial failures.
7. Check retry bounds, idempotency, and duplicate side effects.
8. Test attempts to exceed permissions or invoke irrelevant tools.
9. Measure completion rate, invalid-call rate, retries, latency, and cost.
10. Preserve severe action failures as regression cases.

## Decision points
Use exact validators for syntax and invariants; use semantic judges or humans only where intent cannot be mechanically established. Treat unsafe side effects as hard failures even if the final task succeeds.

## Common failure patterns
- Scoring only valid JSON
- Ignoring semantically wrong arguments
- Unlimited retries
- Duplicate non-idempotent actions
- Tool success accepted without verifying resulting state

## Verification
Verify actual environment state after actions, reproduce injected failures, and confirm invalid or unsafe calls are detected deterministically.

## Expected output
A tool-use evaluation with schema, semantic correctness, sequencing, recovery, safety, and efficiency metrics.

## Stop conditions
Stop when tool side effects cannot be isolated safely, permissions are unclear, or expected state transitions cannot be independently verified.