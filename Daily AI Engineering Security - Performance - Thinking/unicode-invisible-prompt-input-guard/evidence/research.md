# Research

## Topic
Unicode Invisible Prompt Input Guard

## Category
Security

## Problem
AI agents and content-processing pipelines can receive machine-visible Unicode characters that normal user interfaces do not render. Attackers can use invisible tag characters, zero-width characters, or related encodings to hide prompt-injection instructions, fracture high-signal words, or create a mismatch between what a human approves and what a model or detector actually reads.

## Why it matters now
Microsoft Security Research published new findings on September 3, 2026 showing that a technique popularized in AI prompt-injection research—ASCII smuggling using the Unicode Tags block U+E0000–U+E007F—was adopted at large scale in a phishing campaign. Microsoft observed its tuned signature rise from roughly 21,000 messages on February 8 to more than 1.3 million on February 9, with weekday peaks above 2.3 million. Microsoft explicitly recommends normalization before matching and applying the same normalization upstream of AI ingestion. The Agent Threat Rule registry separately tracks zero-width binary steganography as a critical prompt-injection detection pattern and points to NVIDIA garak coverage.

## Affected users
Agent developers, email-to-agent and ticket-to-agent systems, RAG pipelines, browser agents, MCP/tool consumers, security filters, content-moderation systems, and human-approval interfaces.

## Current public evidence
### Observed evidence
1. Microsoft Security Blog, September 3, 2026: invisible Unicode tag characters were used at multi-million-message scale to alter downstream parsing/tokenization while remaining visually innocuous.
2. Microsoft states the same Unicode Tags block has been repeatedly used in AI cross-prompt-injection research, where hidden instructions are invisible to users but present to language models.
3. Microsoft recommends stripping or normalizing tag characters and other invisible code points before signature matching and before AI ingestion, while preserving legitimate cases such as subdivision-flag emoji sequences.
4. Agent Threat Rule ATR-2026-00313 documents zero-width binary steganography using U+2062/U+2064/U+200B as a critical prompt-injection pattern and references NVIDIA garak probes.

### Interpretation
The security boundary must operate on a canonical representation of content, not only on the rendered view. Human approval is unreliable when the reviewer and model consume materially different text. A deterministic pre-ingestion guard can reduce this representation gap, but must avoid destructive blanket normalization that changes valid user data.

## Existing approaches
Current approaches include Unicode normalization, stripping selected non-rendering characters, anomaly detection, OCR/visual extraction, layered reputation and behavioral signals, prompt-injection classifiers, and model-level instructions to treat external content as untrusted. Microsoft emphasizes layered protections rather than a single signature.

## Remaining limitations
- Unicode normalization forms do not remove all invisible or tag characters.
- Blanket removal can corrupt legitimate emoji, language, accessibility, or domain-specific data.
- A single blocklist misses alternate zero-width or steganographic encodings.
- A model instruction such as “ignore hidden instructions” is not a deterministic control.
- Human approval can still be fooled if the UI renders sanitized text while the model receives raw text.
- Security scanners often inspect after tokenization rather than before canonicalization.

## Root-cause analysis
1. Different pipeline stages consume different string representations.
2. Security policy is applied after parsing/tokenization rather than at the trust boundary.
3. Invisible-character handling is implicit and library-dependent.
4. Legitimate Unicode exceptions discourage strict filtering, leading to permissive defaults.
5. Approval interfaces do not attest that reviewed bytes/canonical text equal model-ingested text.

## Improvement opportunity
Introduce a deterministic canonicalization-and-diff gate before untrusted text enters model context. The gate detects risky invisible ranges, preserves explicitly allowed legitimate sequences, emits a visible escaped representation for review, optionally strips configured risky characters, and produces hashes of raw and canonical text. High-risk changes block ingestion unless policy permits them, preventing silent divergence between reviewed and consumed content.

## Relevant sources
- Microsoft Security Research, September 3, 2026: https://www.microsoft.com/en-us/security/blog/2026/09/03/ascii-smuggling-crosses-over-from-ai-prompt-injection-to-phishing-evasion/
- Agent Threat Rule ATR-2026-00313: https://agentthreatrule.org/en/rules/ATR-2026-00313
- MITRE ATLAS, LLM Prompt Obfuscation (referenced by Microsoft): https://atlas.mitre.org/
