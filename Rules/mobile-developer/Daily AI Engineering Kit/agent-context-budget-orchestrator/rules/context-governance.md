# Context Governance Rules

## MUST

- Maintain a task-local `context-ledger.json` for non-trivial tasks.
- Associate every active context item with a current decision question or implementation need.
- Mark evidence freshness and reread conditions.
- Refresh critical evidence after its underlying file, configuration, schema, or runtime state changes.
- Preserve source identifiers for every compressed conclusion.
- Reserve budget for task instructions, tool output, and final verification.
- Surface unresolved evidence gaps explicitly.
- Keep conflicting evidence separate until reconciled.

## MUST NOT

- Load whole repositories or large directory trees without a specific reason.
- Retain duplicate copies of the same evidence.
- Drop critical evidence only to satisfy a budget number.
- Store credentials, tokens, private keys, connection strings, or secret values in summaries.
- Claim a source was checked when it was inferred from another source.
- Reuse a stale summary after the underlying source changed.
- Treat an AI-generated summary as stronger evidence than the original source.
- Hide failed tests or unresolved risks during compression.

## SHOULD

- Read narrow file ranges before whole files.
- Prefer code navigation and targeted search over broad keyword collection.
- Compress completed supporting investigations early.
- Keep final handoffs short and decision-oriented.
- Retain exact values for contracts, permissions, migrations, configuration, and security-sensitive behavior.
- Split very large tasks into verified checkpoints instead of continuously expanding context.

## Human approval boundaries

Human approval is required before deliberately omitting context needed to assess:

- production deployment;
- destructive data changes;
- schema migrations;
- authentication/authorization changes;
- secret or infrastructure configuration changes;
- breaking public contracts.
