# Hook: Pre-Agent-Card Consumption

## Trigger
Immediately after fetching a card and before using any card-controlled field in LLM context, tool arguments, or endpoint invocation.

## Preconditions
Raw JSON persisted or available read-only; Python 3.10+.

## Action
Run `python scripts/agent_card_guard.py "$AGENT_CARD_PATH"`.

## Expected result
Exit `0` and JSON report with `accepted: true`.

## Failure behavior
Exit `2` quarantines the card and blocks LLM/tool consumption. Exit `64` blocks because validation could not be established.

## Blocking
Yes. Human approval is required for policy exceptions; changing the card requires revalidation.
