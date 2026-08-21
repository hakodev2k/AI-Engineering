# Engineering Rules

## MUST
- Every bounded or truncated tool result MUST expose a machine-readable completeness state.
- A known-size result MUST satisfy `produced_bytes = retained_bytes + omitted_bytes`.
- A truncated result MUST state omitted size or explicitly mark it unknown; unknown omission fails closed for evidence-sensitive work.
- If full output is retained externally, the residual MUST include a stable handle and digest.
- Model-visible truncation metadata MUST appear before retained content, not only in the omitted middle.
- Verification claims MUST cite only complete output or explicitly recovered ranges from a verified artifact.
- Exit code `0`, HTTP `200`, or tool status `success` MUST NOT be treated as proof that model-visible evidence is complete.
- Capture completeness MUST be tracked separately from command success.
- Recovery loops MUST be bounded; default maximum is three targeted reads.
- Non-idempotent commands MUST NOT be re-executed just to recover output when the original full artifact exists.
- Full artifacts MUST remain outside the prompt unless their size is explicitly approved and within context budget.
- High-impact conclusions MUST be independently checked by a verifier that did not implement the change.

## MUST NOT
- MUST NOT fabricate or reconstruct omitted tool output from expectation.
- MUST NOT convert `unknown`, missing, or truncated evidence into a positive verification result.
- MUST NOT hide truncation by summarizing a partial buffer as if it were the complete source.
- MUST NOT delete or overwrite a captured artifact before its dependent verification is complete.
- MUST NOT silently weaken output limits to avoid dealing with residual metadata.
- MUST NOT retry indefinitely after failed recovery.
- MUST NOT expose hidden chain-of-thought; record observable facts, assumptions, evidence, decisions, risks, and verification state instead.

## SHOULD
- SHOULD externalize full output to content-addressed artifacts and provide head/tail views to the model.
- SHOULD use deterministic search/range reads before asking the model to inspect more bytes.
- SHOULD preserve final command summaries and failure regions when choosing bounded views.
- SHOULD instrument produced bytes, retained bytes, omitted bytes, recovery reads, and artifact verification failures.
- SHOULD alert when a tool frequently exceeds its output budget; the upstream command may need filtering or structured output.
- SHOULD prefer structured tool output over free-form logs when the tool supports it.
- SHOULD expire artifacts only after workflow retention requirements are satisfied and no verification references remain.

## Testable policy invariants
1. No truncated fixture may report `omitted_bytes = 0`.
2. Different true output sizes must produce different `produced_bytes` values.
3. A verified artifact's file size and SHA-256 must equal the residual metadata.
4. A result over the model-view budget must never include the entire payload in `model_view`.
5. Corrupt/missing artifacts must make verification fail with a non-zero exit code.
6. An incomplete capture cannot satisfy Definition of Done for an evidence-sensitive task.
