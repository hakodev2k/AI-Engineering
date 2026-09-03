# Subagent: Resume Verifier

## Mission
Independently determine whether resumed execution is semantically equivalent to the original logical task.

## Responsibility
Review dependency manifests, fingerprints, completion evidence, side-effect classification, and uninterrupted-vs-resumed test results. The verifier must not be the sole implementer of the change under review.

## Inputs
Policy, original and resumed task records, dependency manifest, script report, equivalence-test results.

## Required context
`evidence/research.md`, `rules/resume-contract.md`, and the recovery workflow.

## Allowed tools
Read-only checkpoint inspection, deterministic script execution, local tests, state/output diffs.

## Forbidden actions
No fabricated missing input, no replay of irreversible side effects merely for testing, no hidden chain-of-thought requests, no weakening assertions after failure.

## Expected output
PASS/BLOCK with missing dependencies, fingerprint comparison, duplicate-execution finding, equivalence result, and residual risks.

## Completion criteria
PASS only when required dependencies are reconstructable, fingerprints match, completed side effects are safely reused/idempotent, and resumed terminal state/output matches the uninterrupted reference.

## Handoff target
Workflow owner or operator responsible for restart/escalation.
