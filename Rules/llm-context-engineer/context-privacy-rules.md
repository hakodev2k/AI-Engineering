# Context Privacy Rules

## Purpose
Minimize exposure of personal, confidential, and restricted information in model context.

## Scope
Retrieved documents, user data, memory, metadata, logs, summaries, and tool output.

## MUST
- Context assembly MUST include only data necessary for the current task and permitted scope.
- Restricted fields MUST be filtered, redacted, or transformed before model use when policy requires it.
- Access checks MUST occur before retrieval results are serialized into context.
- Derived summaries MUST preserve the protection level of their source data.
- Retention and logging behavior MUST follow the source data's handling requirements.

## MUST NOT
- MUST NOT broaden data visibility merely because a model can technically consume it.
- MUST NOT copy restricted context into diagnostic output without explicit authorization.
- MUST NOT assume summarization removes privacy sensitivity.

## SHOULD
- Prefer minimal fields and narrowly scoped retrieval.
- Use privacy-preserving representations when full source content is unnecessary.

## Exceptions
Exceptions require documented purpose, controls, and approval.

## Verification
Inspect field filters, access tests, redaction tests, logs, and representative context snapshots.