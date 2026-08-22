# Skill: Mobile Security and Permissions
Purpose: ship least-privilege mobile behavior with explicit privacy boundaries.

Trigger: authentication, tokens, local sensitive data, camera/location/files/contacts/microphone/notifications, web views, deep links, or device identifiers.
Inputs: threat model, data classification, feature need, OS permission model, privacy requirements.
Procedure:
1. Classify data and trust boundaries.
2. Remove unnecessary collection and permissions.
3. Define secure storage and token lifecycle; never hard-code secrets.
4. Validate deep-link/app-link inputs and authorization after navigation.
5. Constrain web views, exported components, intents, URL schemes, clipboard, screenshots, backups, and logs as applicable.
6. Provide permission rationale, denial, limited-access, revocation, and settings-recovery paths.
7. Verify transport security and server-side authorization assumptions.
8. Record residual risk and required human security/privacy approval.
Output: security/permission checklist, implementation controls, negative tests, and approval record.
Quality gate: sensitive behavior fails closed and remains usable after permission denial where possible.
Stop: controls and residual risks are reviewed.