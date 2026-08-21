# PR Review Resolution Rules

## MUST

- Resolve each review comment against the exact code and current pull-request diff.
- Preserve the reviewer intent in a short finding before editing.
- Collect repository evidence before deciding whether a comment is valid.
- Make the smallest change that satisfies the review concern.
- Run relevant tests for every code change and record the commands and outcomes.
- Inspect the final diff for unrelated edits.
- Keep unresolved or disputed comments visible with evidence.
- Stop before actions listed in `config/policy.yaml` as approval-required.

## MUST NOT

- Do not mark a comment resolved because code was edited; verification is required.
- Do not silently ignore a reviewer request.
- Do not change public API contracts unless the review explicitly requires it and approval exists.
- Do not force push, rewrite history, delete branches, or weaken security controls.
- Do not add unrelated refactors while addressing review feedback.
- Do not fabricate test results, repository facts, or reviewer intent.
- Do not retry the same failing edit/test loop more than two times without changing the hypothesis.

## SHOULD

- Prefer existing repository conventions over introducing new abstractions.
- Group comments that share one root cause, but report resolution per comment ID.
- Reuse nearby tests and helpers before creating new infrastructure.
- Prefer a documented rejection with evidence over a speculative implementation.
