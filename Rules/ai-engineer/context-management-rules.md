# Context Management Rules
## Purpose
Control what information enters model context and preserve relevance, privacy, and correctness.
## Scope
Conversation history, retrieved documents, tool output, memory, metadata, and prompt context assembly.
## MUST
- Include only context needed for the current task and enforce applicable data-access boundaries.
- Preserve source identity and distinguish trusted instructions from untrusted content.
- Define truncation, summarization, and context-window behavior for long-running interactions.
## MUST NOT
- Insert sensitive data into context without a legitimate need and permitted access.
- Assume stale conversation context remains valid without checking when decisions depend on freshness.
## SHOULD
- Measure context size, relevance, and token cost for important workflows.
## Exceptions
Exceptions require documented purpose, data-handling justification, and review.
## Verification
Inspect context-building code, access checks, token metrics, privacy tests, and long-context evaluations.