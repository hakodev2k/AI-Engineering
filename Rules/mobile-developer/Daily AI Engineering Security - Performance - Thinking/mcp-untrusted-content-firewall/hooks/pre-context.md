# Hook — Pre-Context Trust Validation

## Trigger
Immediately before external content is inserted into model context.

## Preconditions
Content bytes/text and source metadata are available; policy file is readable.

## Action
Run `python scripts/content_firewall.py scan --input <file> --source <source> --action <action> --policy config/policy.json`.

## Expected result
Exit 0 = allow; exit 10 = allow-with-taint; exit 20 = require review; exit 30 = block; other nonzero = internal failure.

## Failure behavior
For write/execute/credential/production/network actions, any internal failure blocks completion. For read-only display, fallback is allowed only if configured and content remains marked untrusted.

## Blocks completion
Yes for privileged chains or invalid policy/provenance.
