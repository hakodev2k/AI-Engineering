# Skill: Mobile Requirement Framing
Purpose: convert product intent into an implementable mobile contract.

Trigger: new feature, behavior change, platform discrepancy, or ambiguous ticket.
Inputs: user goal, acceptance criteria, API/data contracts, analytics/privacy needs, supported OS/device matrix.
Preconditions: identify affected platforms and release constraints.
Procedure:
1. Restate user outcome and non-goals.
2. Enumerate foreground/background, online/offline, first-run, returning-user, denied-permission, process-death, upgrade, and error states.
3. Identify data ownership, persistence, sync, security, analytics, accessibility, localization, and deep-link implications.
4. Split platform-neutral behavior from iOS/Android-specific behavior.
5. Record dependencies and approval gates.
6. Produce testable acceptance criteria and telemetry expectations.
Decisions: simplify when mobile constraints make a desktop/web pattern unsafe or costly; escalate material product behavior changes.
Constraints: do not invent API capability or OS guarantees.
Output: implementation brief with states, contracts, risks, dependencies, tests, telemetry, and DoD.
Verification: every user-visible transition has expected behavior and recovery.
Failure: unresolved contract/permission/privacy ambiguity -> blocked.
Stop: scope is testable and dependency owners are explicit.