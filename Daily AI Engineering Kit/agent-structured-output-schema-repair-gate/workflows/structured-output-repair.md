# Workflow: Structured Output Repair

## Trigger
A model response is expected to satisfy a machine-consumed JSON contract.

## Entry conditions
Schema and semantic policy are available; raw output can be preserved.

## Stages
1. **Capture** — preserve raw bytes and provenance.
2. **Validate** — Output Investigator runs deterministic parser/schema checks.
3. **Classify** — separate syntax/schema defects from missing facts or business-rule failures.
4. **Repair checkpoint** — only safe structural repair proceeds.
5. **Repair** — Repair Agent produces corrected JSON.
6. **Revalidate** — deterministic full validation.
7. **Retry** — one additional repair only if the first remains structurally repairable.
8. **Verify** — independent Verification Agent reviews evidence.
9. **Consume** — downstream use only after `verified`.

## Artifacts
Raw payload, raw SHA-256, validation reports, repair requests, repaired candidates, final verification record.

## Retry rules
Transient tool/model transport failures: max 2. Repair attempts: max 2 total. Validation/business-rule failures are not transient.

## Approval points
Contract changes, invented unavailable facts, production/secret/security/database/infrastructure changes, destructive or irreversible actions.

## Failure paths
After two failed repairs, preserve all evidence and escalate. If semantics cannot be proven, mark `blocked` even if schema passes.

## Definition of Done
Final payload validates, semantic rules pass, repair cap respected, evidence preserved, independent verifier returns `verified`, and no approval-required action remains.
