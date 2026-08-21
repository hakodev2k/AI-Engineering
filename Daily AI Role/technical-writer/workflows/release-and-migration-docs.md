# Workflow: Release and Migration Docs

**Trigger:** release, deprecation, breaking change, migration, or compatibility change.
**Goal:** let affected users understand impact and act safely.
**Inputs:** approved release facts, diff, compatibility, migration/rollback, dates, owner.
**Stages:** impact classification → affected audience/version map → before/after behavior → migration plan → parallel API/example/risk review → rehearsal/evidence → release-owner approval → synchronized publication → post-release verification → follow-up on support/search signals.
**Dependencies:** confirmed release facts and migration path before final publication.
**Human approval:** breaking changes, deprecation dates, security implications, irreversible steps.
**Retries:** max 2 failed rehearsal/validation cycles before escalation.
**Outputs:** release notes, migration guide, updated reference/how-to pages, source map.
**DoD:** dates and versions confirmed, migration verified, rollback/escalation explicit, linked docs consistent.