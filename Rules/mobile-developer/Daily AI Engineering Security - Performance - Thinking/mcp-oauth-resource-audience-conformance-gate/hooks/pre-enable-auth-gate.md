# Hook — Pre-Enable MCP OAuth Gate

## Trigger
Before a protected MCP server/connector is enabled in staging promotion or production configuration.

## Preconditions
A sanitized conformance input exists with canonical resource URI, authorization/token request resource values, expected issuer/audience/scopes, decoded claim summary, and optional token fingerprints.

## Action
Run `python3 scripts/oauth_conformance_gate.py <input.json>`. Require an `allow` decision before enablement.

## Script/command
```bash
python3 scripts/oauth_conformance_gate.py conformance-input.json
```

## Expected result
Exit 0 and `decision: allow`. Every required control reports pass.

## Failure behavior
Exit 3 (`block`) or exit 2 (`invalid`) prevents enablement. Do not bypass by disabling audience/issuer checks. Preserve only sanitized findings.

## Blocking
Yes. This is a security boundary. Override requires explicit authorized human risk acceptance outside the implementing agent and MUST be documented separately.