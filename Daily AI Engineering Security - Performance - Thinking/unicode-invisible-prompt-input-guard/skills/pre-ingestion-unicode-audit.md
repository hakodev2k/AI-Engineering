# Pre-Ingestion Unicode Audit Skill

## Purpose
Detect and safely handle invisible Unicode content before untrusted text reaches an AI agent or downstream security logic.

## Trigger
Any ingestion of external email, ticket, web, document, chat, RAG, MCP, or tool output into a model-enabled workflow.

## Inputs
Raw UTF-8 text, source trust level, canonicalization policy, intended destination and authority level.

## Preconditions
Raw bytes/text are available before tokenization and the guard runs outside the model being protected.

## Required context
Legitimate Unicode needs, trust boundary, whether a human approval step exists, and downstream privilege level.

## Allowed tools
Deterministic scanner, Unicode metadata, approved policy file, test fixtures.

## Constraints
Do not blanket-convert or delete arbitrary Unicode. Never expose decoded hidden instructions to an execution-capable model during analysis.

## Procedure
1. Hash raw input.
2. Scan code points for configured risky ranges and characters.
3. Produce an escaped review rendering containing code point names and positions.
4. Apply canonicalization policy to a copy, preserving raw input for evidence.
5. Hash canonical output.
6. If risky content exists on a high-authority path, block pending explicit policy or human review.
7. Run security matching on canonical text, not raw-only text.
8. Verify that the exact reviewed canonical text is what downstream consumers receive.
9. Record verdict, hashes, findings, and policy version.

## Decision points
- No risky code points: pass.
- Known allowlisted legitimate sequence: pass with audit record.
- Unknown invisible content on low-authority read-only path: quarantine or require review according to policy.
- Any risky content on write/credential/exec path: block by default.

## Expected output
Machine-readable finding list, escaped display, raw/canonical SHA-256 hashes, canonical text, and PASS/BLOCK verdict.

## Metrics
Risky characters per item, blocked items, allowed exceptions, false-positive rate, human-review rate, representation-divergence incidents.

## Verification
Known Unicode-tag and zero-width fixtures MUST be detected; ordinary multilingual text MUST remain unchanged; hash mismatch between reviewed and consumed canonical content MUST block execution.

## Failure handling
Parser, encoding, or policy errors block high-authority ingestion. Retry once after correcting deterministic input/config errors; otherwise escalate.

## Stop conditions
Finish only when the representation presented for policy/human review is cryptographically tied to the representation entering the downstream AI/tool path.
