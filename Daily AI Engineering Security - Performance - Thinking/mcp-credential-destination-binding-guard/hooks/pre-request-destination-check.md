# Hook — Pre-request Destination Check

## Trigger
Immediately before constructing or sending any credential-bearing outbound request from an MCP/tool handler.

## Preconditions
The normalized destination candidate and credential class are available; `config/policy.json` exists.

## Action
Serialize a minimal JSON envelope containing `url`, `credential_class`, and optional destination-bound approval. Run the deterministic validator before credentials are attached.

## Script / command
`python scripts/validate_destination.py request.json --policy config/policy.json`

## Expected result
Exit `0` with `decision=allow`. Exit `4` means approval is required. Exit `5` means deny. Exit `2` means invalid input/configuration.

## Failure behavior
On any non-zero exit, do not attach or transmit credentials. Record normalized decision metadata without secret values. Approval-required may resume only with an approval bound exactly to the emitted binding key.

## Blocks completion
Yes. A credential-bearing request MUST NOT proceed if the hook fails, is skipped, or cannot parse policy.
