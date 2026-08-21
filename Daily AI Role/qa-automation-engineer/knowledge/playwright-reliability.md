# Playwright Reliability Guide

## Locator hierarchy
Prefer accessibility-driven locators: role + accessible name, label, placeholder when semantic, visible text when stable, then explicit test id. CSS/XPath is a last resort for structures without a stable user-facing identity.

## Synchronization
Playwright actions and web-first assertions auto-wait. Wait for the state that proves readiness:
- `await expect(locator).toBeVisible()`
- `await expect(page).toHaveURL(...)`
- `await expect(locator).toHaveText(...)`
- bounded polling for a legitimate eventually-consistent backend state

Avoid `waitForTimeout`; elapsed time is not application state.

## Fixtures
Use fixtures for reusable environment/auth/data capabilities. Keep fixtures composable and scoped. Worker-scoped state must be immutable or uniquely owned by that worker.

## Authentication
Use stored state when it reflects realistic authorization and can be generated safely. Maintain distinct identities for roles/permissions. Never commit session tokens or real credentials.

## Parallelism
Assume tests can run concurrently. Generate unique identifiers, avoid fixed shared rows, and clean up only resources owned by the test. Serial mode is acceptable only when the product behavior is truly sequential and the reason is documented.

## Network control
Mock when testing frontend behavior in isolation or rare failure states. Do not mock the same integration when the test claims end-to-end confidence. Keep separate contract/integration evidence.

## Diagnostics
Configure trace/screenshot/video primarily on failure or retry according to repository policy. First inspect the earliest divergence in trace/network/console, not only the final assertion.

## Page objects
Represent stable domain interactions:
`checkout.submitOrder()` is better than a page object exposing every CSS node. Keep assertions close to behavior unless a reusable component has a stable contract.

## CI
Shard only independent tests. Keep environment identity and commit SHA visible. Track duration, retry usage, quarantine, and flaky signatures over time.

## Flake threshold
Use `config/role-config.yaml` as the default policy. Projects may override it explicitly, but should not silently weaken it to make CI green.
