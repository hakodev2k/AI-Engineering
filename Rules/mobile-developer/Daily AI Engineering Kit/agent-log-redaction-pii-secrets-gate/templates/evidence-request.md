# Evidence Request

## Investigation goal
<specific question to answer>

## Source scope
- System/service: <name>
- Environment: <development|staging|production>
- Time range: <start/end>
- Correlation/request IDs: <non-secret identifiers>
- Required fields: <minimal fields>
- Excluded fields/payloads: <sensitive/unnecessary fields>

## Destination
- Consumer: <agent/team/tool>
- Trust boundary: <same repository/team/external>
- Reason AI context is required: <reason>

## Redaction
- Policy: `config/redaction.yaml`
- Raw input path: <protected temporary path>
- Sanitized output path: <path>
- Report path: <path>
- Gate status: <sanitized|blocked_sensitive_input|error>
- Verification status: <verified|blocked|inconclusive>

## Findings
- Facts: <confirmed>
- Hypotheses: <unconfirmed>
- Evidence references: <sanitized lines/event IDs>
- Remaining risk: <risk>

Do not include real credentials, authorization headers, private keys, connection strings, customer payloads, or raw matched values in this document.
