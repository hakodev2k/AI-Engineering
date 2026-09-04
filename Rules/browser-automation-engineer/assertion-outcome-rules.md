# Assertion and Outcome Rules

## Purpose
Ensure browser automation verifies meaningful outcomes rather than merely completing interactions.

## Scope
Applies to assertions, workflow success criteria, UI state checks, side-effect verification, and failure messages.

## MUST
- Every automated scenario MUST define an observable success or failure outcome tied to its purpose.
- Assertions MUST validate externally meaningful state, contract behavior, or persisted side effects when those are the intended outcomes.
- Negative scenarios MUST verify that prohibited outcomes did not occur where practical.
- Assertion failures MUST identify the expected condition, observed evidence, and relevant context without leaking secrets.
- Critical mutations SHOULD be validated beyond a transient success notification when a durable side effect can be observed.

## MUST NOT
- A completed click, navigation, or absence of exceptions MUST NOT be treated as sufficient proof of business success.
- Assertions MUST NOT depend on unrelated UI text or implementation details when a stronger domain signal exists.
- Broad catch-and-ignore logic MUST NOT suppress failed assertions.

## SHOULD
- Assertions SHOULD be placed at stable outcome boundaries rather than after every low-level interaction.
- Important asynchronous side effects SHOULD use bounded eventual-consistency checks when immediate consistency is not guaranteed.

## Exceptions
A narrowly scoped component interaction may validate only local UI state when deeper effects are explicitly outside its scope and covered elsewhere.

## Verification
Review each scenario's stated purpose against its assertions, inject representative failures, and verify that false-positive success cannot occur when the intended outcome is absent.