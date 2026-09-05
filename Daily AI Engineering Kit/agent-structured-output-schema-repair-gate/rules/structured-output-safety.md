# Structured Output Safety Rules

## MUST
- Preserve raw model output before repair.
- Validate deterministically before consumption.
- Keep schema fixed during a repair cycle.
- Cap repair attempts at two.
- Revalidate the complete payload after every repair.
- Preserve input hashes and validation evidence.
- Require independent verification before high-impact consumption.

## MUST NOT
- Silently coerce invalid values into valid ones.
- Drop unknown fields merely to make validation pass unless the repair policy explicitly requires returning a corrected payload and the omitted field is unsupported by the contract.
- Invent missing facts.
- Treat parse success as semantic correctness.
- Change public contracts, security controls, production config, secrets, or persistent data without explicit approval.
- Retry indefinitely.

## SHOULD
- Prefer `partial` or `failed` states over fabricated completeness.
- Keep validation deterministic and model repair isolated.
- Log exact failure paths and codes.
- Retain raw and final payload hashes for observability.
