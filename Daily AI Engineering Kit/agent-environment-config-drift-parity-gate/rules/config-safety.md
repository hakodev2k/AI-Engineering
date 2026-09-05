# Configuration Safety Rules

## MUST
- Inventory configuration consumers before changing required keys.
- Keep real secret values out of repository manifests, examples, logs, and agent outputs.
- Run deterministic parity validation after configuration-affecting edits.
- Treat type and requiredness mismatch as blocking drift.
- Preserve evidence for approved environment-specific exceptions.
- Run relevant build/tests after remediation.
- Require independent verification before completion.

## MUST NOT
- Copy production secrets into `.env`, JSON, YAML, tests, examples, or prompts.
- Change production configuration without explicit human approval.
- Weaken authentication, authorization, TLS, validation, or secret controls to make parity checks pass.
- Hide drift by adding keys to `ignore_keys` without a documented reason.
- Force push, rewrite history, deploy production, perform destructive SQL, or delete data without explicit approval.
- Retry indefinitely.

## SHOULD
- Use typed configuration binding where supported.
- Fail fast on missing required keys at application startup.
- Keep environment-specific values explicit and minimal.
- Prefer generated/normalized manifests over manual comparison for CI.
