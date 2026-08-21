# Regression Safety Rules

## MUST

- Map changed behavior to explicit test obligations before declaring verification.
- Record evidence for every required obligation.
- Preserve existing public contracts unless the task explicitly changes them.
- Keep test fixtures deterministic and isolated from production resources.
- Record failing tests and unresolved gaps honestly.
- Require human approval before weakening security, deleting protections, changing production schema/configuration, or breaking contracts.
- Distinguish implementation success from verification success.

## MUST NOT

- Declare a change verified merely because generated tests pass.
- Treat code coverage percentage as sufficient behavioral evidence.
- Delete, skip, mute, or loosen a failing test just to make the suite green.
- Change production logic solely to satisfy an incorrect test.
- Use live production credentials, production databases, or destructive commands for verification.
- Retry the same deterministic failure indefinitely.
- Hide pre-existing failures that materially affect confidence.

## SHOULD

- Prefer focused tests before broad suites.
- Reuse existing tests when their assertions directly prove the obligation.
- Add regression tests that reproduce a bug before the fix when practical.
- Prefer deterministic clocks, seeded randomness, and isolated dependencies.
- Keep evidence notes concise and traceable to repository paths or commands.
