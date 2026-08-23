# Lifecycle Hooks

## Pre-consume validation
**Trigger:** before any AI JSON reaches a downstream consumer. **Preconditions:** raw output and trusted schema exist. **Action:** run `python scripts/validate_output.py --input <candidate> --schema <schema> --report <report>`. **Expected:** exit 0. **Failure:** block consumption and enter bounded repair workflow. **Blocking:** yes.

## Post-repair validation
**Trigger:** immediately after deterministic or model-assisted repair. **Action:** rerun the same validator against the same schema. **Expected:** exit 0. **Failure:** record evidence; continue only if repair budget remains and failure differs. **Blocking:** yes.

## Pre-side-effect verification
**Trigger:** before a validated payload invokes a write/tool/API side effect. **Action:** Output Verifier reruns validation on the exact bytes to be consumed and checks the hash against the handoff record. **Expected:** verified hash and exit 0. **Failure:** block side effect. **Blocking:** yes.

## Final evidence check
**Trigger:** workflow completion. **Action:** confirm raw hash, reports, final status, attempts <= 2, and any required approval. Validate the gate result with `schemas/result.schema.json`. **Expected:** evidence-complete result. **Failure:** mark task blocked/incomplete. **Blocking:** yes.
