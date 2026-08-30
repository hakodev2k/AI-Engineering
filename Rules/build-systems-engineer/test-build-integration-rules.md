# Test Build Integration Rules

## Purpose
Ensure test execution is correctly represented in the build graph and test results are trustworthy.

## Scope
Applies to unit, integration, generated, platform, and build-system tests invoked through build targets.

## MUST
- Test targets MUST declare their runtime inputs, data, environment requirements, and generated dependencies.
- Test discovery MUST be deterministic for a given source revision and configuration.
- Failed tests MUST produce structured result data and actionable diagnostics.
- Test sharding or parallelization MUST preserve isolation and result equivalence.
- Build-system changes affecting test execution MUST be validated against representative suites.

## MUST NOT
- MUST NOT rely on undeclared local services or machine state for tests classified as hermetic.
- MUST NOT hide failing tests by silently excluding them from target discovery.
- MUST NOT use retries to redefine a deterministic failure as success.

## SHOULD
- Expensive test suites SHOULD be partitioned according to dependency and runtime evidence.
- Test artifacts SHOULD be retained long enough to support failure investigation.

## Exceptions
Non-hermetic or externally dependent tests MUST declare those requirements explicitly and define failure classification.

## Verification
Inspect test target definitions, discovery output, dependency declarations, shard consistency, result artifacts, and clean-environment execution.