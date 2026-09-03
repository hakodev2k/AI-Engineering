# Image and Media Rules

## Purpose
Deliver visual media with appropriate quality while controlling transfer, decode, layout, and rendering cost.

## Scope
Applies to images, video, posters, responsive sources, codecs, lazy loading, dimensions, and media delivery.

## MUST
- Serve dimensions and formats appropriate to rendered size and supported clients.
- Reserve layout space for media that can affect visual stability.
- Prioritize hero or LCP media based on measured criticality and defer below-the-fold media when safe.
- Validate that compression or transcoding preserves required visual quality.

## MUST NOT
- Ship oversized source assets when materially smaller responsive variants can satisfy the display requirement.
- Lazy-load media proven to be critical to initial rendering.
- Autoplay expensive media without product justification and resource impact review.

## SHOULD
- Use responsive image selection and modern codecs where compatibility permits.
- Apply CDN transformation or preprocessing when it is deterministic and observable.

## Exceptions
Exceptions require documented quality, compatibility, or product constraints plus measured performance impact.

## Verification
Inspect network waterfalls, intrinsic and rendered dimensions, decode timing, LCP attribution, layout shifts, and media quality samples.