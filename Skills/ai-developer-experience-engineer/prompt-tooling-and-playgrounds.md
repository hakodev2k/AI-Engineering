# Prompt Tooling and Playgrounds

## Purpose
Design developer tools for experimenting with prompts, model parameters, context, and outputs while preserving reproducibility and safe promotion into code.

## When to use
Use when creating playgrounds, prompt editors, test consoles, or debugging tools for generative AI applications.

## Inputs
Model APIs, supported parameters, prompt formats, message roles, tool schemas, evaluation hooks, storage policy, sharing requirements, and security constraints.

## Context to inspect
Inspect existing experimentation flows, saved prompts, model selection, parameter controls, token usage, export formats, history, collaboration, and data-retention behavior.

## Core knowledge
Exploration tools should make variation visible and reproducible. A useful playground records model/version, parameters, context, tools, inputs, and outputs. It should not encourage developers to mistake one successful sample for validated production behavior.

## Procedure
1. Identify primary experimentation jobs.
2. Expose only meaningful model controls with clear defaults.
3. Preserve full reproducibility metadata.
4. Show token usage, latency, errors, and truncation.
5. Support side-by-side comparisons when useful.
6. Allow prompt and configuration export into SDK code or fixtures.
7. Add evaluation hooks for repeated test cases.
8. Clearly distinguish saved drafts from deployed configuration.
9. Define data retention and sharing boundaries.
10. Redact or warn on secrets and sensitive data.
11. Test browser refresh, sharing, model changes, and failed requests.

## Decision points
Use advanced controls progressively rather than overwhelming first-time users. Store histories only when privacy and retention policies permit it. Make model updates explicit rather than silently changing experiments.

## Common failure patterns
No reproducibility metadata, hidden system instructions, silent model changes, leaking sensitive prompts through sharing links, encouraging manual eyeballing instead of evaluation, and export code that differs semantically from the playground.

## Verification
Reproduce saved runs exactly where determinism allows, compare exported code with playground requests, test sensitive-data protections, and verify model/version metadata is preserved.

## Expected output
A reproducible experimentation workflow with safe sharing, export, observability, and evaluation integration.

## Stop conditions
Stop when storage policy is unresolved, hidden platform behavior prevents faithful export, or experiments could expose restricted data.