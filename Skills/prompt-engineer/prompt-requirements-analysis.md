# Prompt Requirements Analysis

## Purpose
Translate an ambiguous AI task into explicit goals, constraints, inputs, outputs, risks, and acceptance criteria before prompt design begins.

## When to use
Use for new prompts, major prompt changes, or when output quality is inconsistent. Do not optimize wording before the task itself is understood.

## Inputs
Business goal, target users, model/tool environment, examples, policies, latency/cost limits, and expected output.

## Context to inspect
Existing prompts, downstream consumers, model capabilities, tool schemas, evaluation data, failure reports, and production constraints.

## Core knowledge
Prompt quality depends on task specification more than clever phrasing. Separate hard constraints from preferences, observable requirements from assumptions, and model responsibilities from application responsibilities.

## Procedure
1. State the user outcome in one sentence.
2. Identify required inputs and missing information.
3. Define output contract and invariants.
4. Classify constraints as safety, correctness, format, cost, latency, or style.
5. Identify ambiguity and conflicting requirements.
6. Define representative success and failure cases.
7. Decide what belongs in code, tools, retrieval, or prompt instructions.
8. Produce testable acceptance criteria.

## Decision points
Prefer application enforcement for deterministic rules. Use prompt instructions for semantic judgment. Ask for clarification only when assumptions would materially change the result.

## Common failure patterns
Prompting before defining success; mixing business goals with formatting trivia; hidden assumptions; asking the model to enforce guarantees better handled by code.

## Verification
A reviewer can map every hard requirement to an instruction, application control, or test. Ambiguities and unresolved dependencies are explicit.

## Expected output
A concise prompt requirements specification with acceptance criteria and known risks.

## Stop conditions
Stop when critical requirements conflict, required model/tool capabilities are unavailable, or policy ownership is unclear.