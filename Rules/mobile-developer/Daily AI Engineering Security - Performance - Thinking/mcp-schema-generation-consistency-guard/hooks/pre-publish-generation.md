# Hook — Pre Publish Generation

## Trigger
Immediately before replacing the active MCP tool metadata generation.

## Preconditions
Candidate catalog JSON is available and the current active generation has not been mutated.

## Action
Run:
```bash
python scripts/schema_generation_guard.py build --catalog candidate-tools.json --output .agent-state/candidate-generation.json
```
Then compare the resulting generation manifest with the expected tool count and compilation status in the host validator layer.

## Expected result
Exit `0` and a deterministic generation digest. Host schema compilation must also report success for every schema-bearing tool.

## Failure behavior
Any non-zero result or compile failure blocks publication. Keep the old generation active and emit a refresh-failure event.

## Blocking
Yes. A partially built generation must never become active.
