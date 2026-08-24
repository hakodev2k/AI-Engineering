# Lead Management Rules

## Purpose
Ensure lead capture, qualification, routing, and handoff are reliable and commercially useful.

## Scope
Applies to inbound leads, campaign responses, scoring, routing, and marketing-to-sales handoffs.

## MUST
- Lead capture flows MUST validate required data and preserve source context.
- Qualification criteria MUST be documented and aligned with downstream consumers.
- Routing rules MUST have ownership, fallback behavior, and monitoring for failures.
- Material scoring changes MUST be versioned and evaluated against downstream outcomes.

## MUST NOT
- MUST NOT inflate lead quality by redefining stages without disclosure.
- MUST NOT route sensitive data beyond approved recipients.
- MUST NOT silently discard leads because automation fails.

## SHOULD
- Lead definitions SHOULD be reviewed with sales or downstream teams periodically.
- Scoring SHOULD use evidence of predictive usefulness rather than intuition alone.

## Exceptions
Exceptions require rationale, owner, risk, and review date.

## Verification
Inspect forms, validation, routing logs, scoring definitions, handoff SLAs, and downstream conversion data.