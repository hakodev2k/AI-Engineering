# Skill: Plan a Compatible MCP Migration
## Purpose
Turn confirmed drift into the smallest safe migration.
## Process
1. Prefer preserving the old contract.
2. Prefer additive optional fields over new required fields.
3. Use aliases/versioned tools when rename/removal cannot stay compatible.
4. Update known agent prompts/workflows and tests.
5. Define compatibility-layer removal criteria.
6. Mark intentional breaking change as approval-required.
7. Define deterministic acceptance tests.
8. Limit implementation retries to two.
## Output
Ordered edits, consumer list, tests, approval point, rollback conditions.
## Stop conditions
Unapproved break, unclear semantics, security weakening, destructive or production action without approval.
