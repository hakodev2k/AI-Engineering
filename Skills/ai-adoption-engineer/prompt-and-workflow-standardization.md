# Prompt and Workflow Standardization

## Purpose
Create reusable prompt, context, review, and workflow conventions so AI-enabled work is consistent enough to support quality control, training, and measurement.

## When to use
Use when multiple users or teams solve similar tasks with ad hoc prompts, or when output variance makes support and evaluation difficult.

## Inputs
Target tasks, successful examples, failure cases, system capabilities, approved data sources, quality criteria, and user roles.

## Context to inspect
Inspect current prompts, templates, context assembly, review practices, model settings, output formats, and downstream consumers.

## Core knowledge
Standardization should reduce avoidable variance without freezing experimentation. Stable task instructions, context contracts, output schemas, and verification steps are more valuable than universal prompt phrasing.

## Procedure
1. Group recurring use cases by task and required output.
2. Inspect successful and failed prompt patterns.
3. Define required context and authoritative sources.
4. Separate system-controlled instructions from user-editable inputs.
5. Standardize output structure where downstream use benefits.
6. Define verification steps and review responsibilities.
7. Version templates and configuration.
8. Test against representative and edge cases.
9. Publish examples and supported customization points.
10. Monitor failure patterns and revise based on evidence.

## Decision points
Standardize high-volume or high-risk tasks more strongly. Leave exploratory tasks flexible. Prefer structured outputs when other systems consume the result.

## Common failure patterns
Treating one prompt as universally optimal, hiding assumptions inside templates, no versioning, uncontrolled user overrides, and optimizing wording without evaluating task outcomes.

## Verification
Run the standard workflow against a defined test set and compare quality, variance, user effort, and failure behavior with the prior baseline.

## Expected output
Versioned workflow templates, context requirements, output conventions, review guidance, and test evidence.

## Stop conditions
Stop when task requirements are too heterogeneous for one standard or when standardization would conceal materially different risk profiles.