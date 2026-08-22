# Change Impact Rules
## Purpose
Keep documentation synchronized with product, API, infrastructure, and policy changes.
## Scope
Change requests, pull requests, releases, migrations, incidents, and deprecations.
## MUST
- Assess documentation impact for changes to user-visible behavior, interfaces, defaults, limits, permissions, workflows, errors, or operational procedures.
- Identify affected topics, examples, screenshots, translations, generated reference, and redirects before release when practical.
- Treat documentation updates required for safe adoption as part of release readiness.
- Record known documentation gaps when a change ships under an approved exception.
## MUST NOT
- Assume a code change has no documentation impact merely because its implementation is internal.
- Publish incompatible guidance across related pages after a known change.
## SHOULD
- Integrate documentation-impact prompts into engineering/product change workflows.
## Exceptions
Truly internal changes with verified no user, operator, support, or contract impact may require no documentation update.
## Verification
Review change diffs, impact checklist, affected-content search, release documentation, and post-release feedback.