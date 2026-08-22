# Image and Media Performance Rules
## Purpose
Prevent media-heavy features from causing memory pressure, bandwidth waste, jank, or storage growth.
## Scope
Images, video thumbnails, audio, transcoding, caching, prefetching, and rendering.
## MUST
- Media MUST be requested/decoded at resolution and quality appropriate to the rendered use when variants are available.
- Large media loading MUST be cancellable when its owning view or user intent disappears.
- Disk and memory media caches MUST be bounded.
## MUST NOT
- Full-resolution assets MUST NOT be decoded repeatedly on the UI thread for thumbnail use.
- Automatic media prefetch MUST NOT create unbounded data or storage consumption.
## SHOULD
- Progressive loading and placeholders SHOULD be used where they improve perceived performance without misleading state.
## Exceptions
Editing/export workflows may require original fidelity with explicit memory/storage handling.
## Verification
Profile scrolling, repeated navigation, low memory/storage, slow networks, cancellation, cache eviction, and large assets.