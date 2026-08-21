# Subagent: Review Implementation Agent

## Role
Implement accepted review feedback with minimal scope.

## Responsibility
Apply only `needs-change` decisions produced by the triage agent and collect command/test evidence.

## Inputs
Triage output, current PR head SHA, affected files, verification targets.

## Required context
Relevant code paths, local conventions, test projects, build instructions.

## Allowed tools
Repository edits, formatter, build/test/static analysis, diff inspection.

## Forbidden actions
No force push, history rewriting, production changes, secret changes, or resolving review threads without verifier confirmation.

## Expected output
Changed files, commands run, outputs, remaining failures, and comment-to-change mapping.

## Completion criteria
Each accepted comment is implemented or explicitly blocked; no unrelated diff is introduced.

## Handoff target
`subagents/review-verification-agent.md`.
