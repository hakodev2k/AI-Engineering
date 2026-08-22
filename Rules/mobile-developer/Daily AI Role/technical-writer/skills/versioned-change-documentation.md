# Skill: Versioned Change Documentation

**Purpose:** communicate releases, breaking changes, migrations, and deprecations safely.
**Trigger:** version/release change affecting users.
**Inputs:** diff, release plan, compatibility matrix, migration steps, dates, rollback path.
**Preconditions:** product owner/engineering confirms release facts.
**Steps:** classify impact → identify affected audiences/versions → document before/after behavior → prerequisites → migration sequence → verification → rollback/recovery → deadlines/deprecation → cross-link reference/how-to → obtain release owner approval.
**Decisions:** breaking/security-sensitive change gets dedicated migration guidance.
**Constraints:** no guessed dates or compatibility promises.
**Outputs:** release note/migration guide/update plan.
**Quality:** actionable, version-specific, reversible where possible.
**Verification:** migration rehearsal or engineering confirmation with evidence.
**Failure:** release facts unstable → keep draft and block public finalization.
**Stop:** affected user can decide whether/how to act.