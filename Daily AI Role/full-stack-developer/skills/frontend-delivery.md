# Skill: Frontend Delivery
Purpose: deliver accessible, resilient UI behavior aligned with backend contracts.
Trigger: UI or client-facing behavior change.
Inputs: UX/design, API contract, state rules, browser/device targets.
Procedure: model view states; define data-fetch/mutation lifecycle; implement semantic interaction; handle loading/empty/error/partial states; validate client inputs without replacing server validation; preserve URL/navigation state where relevant; add component/integration tests; verify accessibility and performance budget.
Decisions: prefer server-derived authority for security-sensitive state; avoid duplicating business rules unless required for UX and kept contract-aligned.
Outputs: UI change, tests, telemetry hooks, compatibility notes.
Verification: keyboard path, screen sizes, network failure, stale data, authorization failure, race/double-submit.
Stop: unclear contract, unsafe client-side authority, or unsupported browser/platform requirement.