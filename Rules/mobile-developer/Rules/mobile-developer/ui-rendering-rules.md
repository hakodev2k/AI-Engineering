# UI Rendering Rules
## Purpose
Keep mobile interfaces deterministic, responsive, and maintainable under frequent state changes.
## Scope
View composition, rendering, list virtualization, state binding, animations, and expensive layout.
## MUST
- Render output MUST derive from authoritative state without hidden side effects.
- Large collections MUST use virtualization/lazy rendering appropriate to the framework.
- Repeated rendering work MUST avoid unnecessary expensive computation on the UI thread.
## MUST NOT
- Rendering callbacks MUST NOT trigger uncontrolled network or persistence side effects.
- Animation MUST NOT obscure required state or block essential interaction.
## SHOULD
- Stable identity SHOULD be used for collection items to avoid incorrect reuse and excessive redraw.
## Exceptions
Small static screens may use simpler rendering strategies when measured impact is negligible.
## Verification
Profile frame drops, list scrolling, state churn, orientation changes, dynamic content, and repeated navigation.