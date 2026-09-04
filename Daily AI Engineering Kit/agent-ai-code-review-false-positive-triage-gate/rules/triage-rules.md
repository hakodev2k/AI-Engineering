# Triage Rules

## MUST

- Every finding must identify an exact repository path and, when available, a line or symbol.
- A blocking finding must include reproducible evidence and independent verification.
- Facts, hypotheses, and decisions must be recorded separately.
- Review only code and behavior relevant to the finding and changed surface unless evidence requires expansion.
- Preserve failing command output or runtime evidence used to confirm a finding.
- Use the severity, confidence, status, and evidence vocabulary defined in `config/triage-policy.json`.
- Stop before any approval-required action.

## MUST NOT

- Do not block a merge solely because an LLM asserts a problem.
- Do not mark a finding confirmed because code "looks suspicious".
- Do not invent runtime behavior, test output, specifications, or repository facts.
- Do not silently broaden scope into refactoring unrelated code.
- Do not change public API contracts, production configuration, secrets, infrastructure, database schema, security controls, or Git history without explicit human approval.
- Do not lower test coverage, suppress analyzers, or weaken validations to make a finding disappear.
- Do not allow the implementation agent to be the only verifier of a blocking finding.

## SHOULD

- Prefer the smallest test that falsifies or confirms the claim.
- Prefer repository-native build, test, lint, and static-analysis commands.
- Reject findings when repository evidence directly contradicts the claim.
- Use `needs-human-review` when the claim depends on business intent, undocumented external contracts, unavailable production evidence, or privileged systems.
- Keep remediation minimal and scoped to the confirmed defect.
