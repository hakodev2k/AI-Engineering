# Prompt Regression Response

## Purpose
Diagnose and contain incidents caused by prompt, system-instruction, template, or context-composition changes.

## When to use
Use after sudden quality, policy, formatting, tool-use, or behavioral regressions correlated with prompt releases.

## Inputs
Prompt versions, rendered prompts, model versions, failing examples, evaluation results, deployment history.

## Preconditions
Historical prompt versions and representative traces are available.

## Context to inspect
Template engine, system/developer/user message ordering, truncation rules, injected context, localization, tool descriptions, safety instructions.

## Core knowledge
Prompt regressions can be data-dependent and model-dependent. Rendered prompts matter more than source templates because interpolation and truncation can alter behavior.

## Procedure
1. Capture failing rendered prompts and outputs.
2. Compare against last-known-good prompt and context.
3. Check message ordering and role boundaries.
4. Identify changed instructions, examples, schemas, and token budget.
5. Replay paired examples on fixed model settings.
6. Roll back or gate the changed prompt if evidence is strong.
7. Run regression and safety evaluation.
8. Restore gradually and monitor segment-level outcomes.

## Decision points
Rollback before full root cause when impact is high and a known-good prompt exists.

## Common failure patterns
Comparing template source instead of rendered input, changing prompt and model simultaneously, missing truncation effects, and using anecdotal examples only.

## Verification
Paired replay shows the regression follows the prompt change and rollback restores expected behavior across the evaluation set.

## Expected output
Prompt incident diagnosis, rollback/fix, evaluation evidence, and prevention action.

## Stop conditions
Escalate if prompt content may have leaked secrets, bypassed policy, or altered authorization semantics.