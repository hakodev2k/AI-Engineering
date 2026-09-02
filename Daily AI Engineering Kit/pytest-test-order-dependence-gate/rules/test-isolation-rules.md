# Test Isolation Rules

## MUST

- Reproduce suspected coupling with exact pytest node IDs and preserve the execution order that triggers the failure.
- Run the victim test alone before declaring order dependence.
- Restore environment variables, current working directory, process-global registries, monkeypatches, clocks, locale, logging handlers, caches, singletons, and temporary files modified by a test.
- Use disposable test databases or transaction/fixture cleanup boundaries appropriate to the repository.
- Verify the previously failing predecessor+victim sequence after every repair.
- Keep evidence from baseline, failing permutation, and final verification.
- Require human approval before cleanup logic can delete non-test data, alter schemas, access production, or change CI infrastructure.

## MUST NOT

- Fix hidden coupling by enforcing a favorable test order.
- Add sleeps, retries, or broad exception suppression as a substitute for state cleanup.
- Make a victim test depend on another test creating data or configuration.
- Mutate production services or persistent shared environments to reproduce a test-order issue.
- Delete arbitrary filesystem paths; cleanup must be scoped to test-owned temporary locations.
- Increase permissions or disable security controls to make reproduction pass.
- Treat a passing rerun as proof when the evidence-producing order was not rerun.

## SHOULD

- Prefer fixture scopes no broader than necessary.
- Prefer dependency injection over module-level mutable singletons.
- Make cleanup idempotent so partial fixture setup can still be safely unwound.
- Add a regression test that fails when the leaked state reappears.
- Keep permutation counts bounded in pull-request CI and use larger sweeps only in scheduled/nightly validation.