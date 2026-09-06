# Prompting and Interaction Strategy Research

## Purpose
Study how users formulate intent, supply context, refine requests, and develop interaction strategies with AI without assuming expert prompting is the desired end state.

## When to use
Use when prompt formulation, conversation structure, templates, suggested actions, or instruction interfaces materially affect outcomes.

## Inputs
Target tasks, user groups, interface, model behavior, prompt affordances, existing interaction logs, and outcome criteria.

## Context to inspect
Inspect natural user language, system instructions visible to users, templates, examples, prompt history, context limits, editing affordances, and failure cases.

## Core knowledge
Prompt quality is partly an interface-design problem. Users vary in domain knowledge, AI literacy, vocabulary, and willingness to iterate. Effective interaction strategies may involve decomposition, examples, constraints, verification, or direct manipulation rather than longer prompts.

## Procedure
1. Define task outcomes independently of prompt form.
2. Observe users attempting tasks without prescribing a prompt technique.
3. Capture initial prompts, refinements, context additions, and abandonment.
4. Identify recurring intent-expression and repair strategies.
5. Relate strategies to outcomes, effort, expertise, and model behavior.
6. Test interface supports such as structured inputs, examples, suggestions, or previews.
7. Check whether supports improve novice outcomes without constraining experts.
8. Evaluate whether users understand what context is available to the model.
9. Test prompt reuse and adaptation across tasks.
10. Recommend interaction changes that reduce required prompt expertise.

## Decision points
Use free-form prompting when flexibility is central; structured controls when requirements are predictable; hybrid interaction when users need both discoverability and expressiveness.

## Common failure patterns
Optimizing for prompt length, teaching hidden syntax instead of fixing UX, comparing prompts without controlling model state, treating power-user behavior as universal, and rewarding brittle prompt tricks.

## Verification
Show that proposed supports improve task outcomes or reduce effort across representative users and remain robust across relevant model variability.

## Expected output
An interaction-strategy analysis with user patterns, outcome relationships, friction points, and evidence-backed interface recommendations.

## Stop conditions
Stop when system state cannot be reconstructed, sensitive prompts cannot be ethically analyzed, or task outcome quality cannot be assessed.