# Security Rules — MCP Untrusted Content Firewall

## MUST
- MUST treat content from MCP tools, fetched pages, repository discussions, third-party APIs, and unknown servers as untrusted until provenance and policy say otherwise.
- MUST preserve source provenance across context ingestion and downstream tool calls.
- MUST require explicit approval when low-trust content influences a write, execute, credential, production, or external-network action.
- MUST validate declared schemas before using structured tool output.
- MUST record deterministic rule matches and policy decisions in an audit record.
- MUST fail closed for privileged actions when provenance or policy evaluation is unavailable.
- MUST keep approval scope narrow: exact tool/action/resource where technically possible.
- MUST separate content admission from privileged action authorization.

## MUST NOT
- MUST NOT treat tool annotations, descriptions, or server-supplied metadata as trusted solely because they are syntactically valid.
- MUST NOT allow external text to redefine system/developer/user instruction hierarchy.
- MUST NOT auto-execute secrets access, command execution, repository writes, production changes, or external posting based only on untrusted content.
- MUST NOT use a model-based classifier as the only security control.
- MUST NOT silently discard taint/provenance before a downstream action.
- MUST NOT weaken sandboxing or approvals to reduce friction.

## SHOULD
- SHOULD keep remote server allowlists and trust tiers in version-controlled configuration.
- SHOULD distinguish read-only display from admission into model context.
- SHOULD run adversarial regression fixtures whenever policy changes.
- SHOULD expose concise human-readable reasons for review/block decisions.
- SHOULD expire broad approvals quickly and prefer session/task scoped grants.
- SHOULD isolate high-risk tools behind stronger approval and sandbox boundaries.
