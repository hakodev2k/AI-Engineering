# Test Quality Rules

## MUST
- Map each generated test to a behavior, regression, branch, or failure mode in changed code.
- Preserve evidence showing why the test would fail before the intended fix when a regression is being covered.
- Include at least one meaningful assertion per test file.
- Add negative, boundary, or failure-path coverage when the changed logic has such behavior.
- Keep tests deterministic: control time, randomness, network, filesystem, and external services through fixtures/fakes when needed.
- Run the repository's relevant test command after edits and record the command plus exit status.
- Inspect the final diff and identify unrelated generated changes.
- Stop and request approval before any breaking public contract, destructive data, production configuration, or security-control change.

## MUST NOT
- Treat line coverage alone as proof of test quality.
- Generate tests that only assert non-null, successful construction, or implementation details when user-visible behavior can be asserted.
- Disable, skip, quarantine, or focus tests to obtain a green run.
- Relax production validation/security behavior merely to make a test pass.
- Mock the unit under test itself.
- Assert unstable values such as wall-clock timestamps or unordered collections without normalization.
- delete existing tests or fixtures unless explicitly required and independently justified.
- Retry failing tests indefinitely.

## SHOULD
- Prefer behavior-oriented names: `method_condition_expected-result` or repository convention.
- Reuse existing fixtures/builders before introducing new abstractions.
- Prefer a small number of high-signal tests over many redundant permutations.
- Include regression comments only when the intent is not obvious from the test name and assertions.
- Keep generated test helpers local unless reuse is demonstrated.
