# Context Freshness Governance

## MUST
- Bind every derived context artifact to an immutable repository revision and one or more source file hashes.
- Re-run freshness validation before planning, editing, review, verification, and resumed execution after repository state changes.
- Treat `stale`, `missing`, and `unknown` as blocking for any dependent artifact.
- Refresh only affected context where source bindings prove unaffected artifacts remain valid.
- Preserve staleness reports as evidence.
- Use independent review when context controls high-impact changes.
- Require explicit human approval before production deployment, destructive actions, security weakening, breaking contracts, irreversible migrations, or permission escalation.

## MUST NOT
- Do not treat path existence as proof of freshness.
- Do not use timestamps alone as the freshness oracle.
- Do not silently rewrite a manifest to match current files after a mismatch.
- Do not claim a context artifact is verified when its bound sources were not checked.
- Do not let the same agent that refreshed critical context be the only freshness verifier.
- Do not use prior chat memory, cached summaries, embeddings, or indexes to override current repository evidence.
- Do not broaden repository read/write permissions to refresh context.
- Do not continue planning/editing with unresolved blocking findings.

## SHOULD
- Prefer SHA-256 content hashes and Git commit IDs.
- Keep context scopes narrow and task-relevant.
- Reuse fresh artifacts whose source bindings remain unchanged.
- Record why an artifact was refreshed or retained.
- Separate facts, hypotheses, decisions, and open questions in generated context artifacts.