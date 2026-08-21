# API Contract Safety Rules

## MUST
- Compare the proposed OpenAPI document against an explicit baseline from the target branch or release artifact.
- Treat every blocking change from `config/policy.yaml` as a failed gate unless a recorded human approval exists.
- Preserve evidence: baseline path, candidate path, detected change type, JSON pointer or operation, and final status.
- Verify both syntax and semantic contract changes before declaring success.
- Keep analysis read-only until an approved implementation task explicitly authorizes edits.

## MUST NOT
- Do not infer backward compatibility from successful compilation alone.
- Do not silently remove endpoints, parameters, response codes, enum values, or required/optional guarantees.
- Do not weaken the policy, alter the baseline, or regenerate the baseline merely to make the gate pass.
- Do not approve breaking changes on behalf of a human.
- Do not expose secrets or production payloads in evidence files.

## SHOULD
- Prefer additive API changes.
- For intentional breaking changes, require a migration note, versioning strategy, consumer impact analysis, and approval reference.
- Use generated or repository-owned OpenAPI artifacts consistently across local and CI runs.
