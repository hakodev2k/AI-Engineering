# Font and Script Support Rules

## Purpose
Ensure typography supports required writing systems without missing glyphs, illegible shaping, or unsafe fallback behavior.

## Scope
Applies to font selection, fallback stacks, shaping, webfont loading, embedded fonts, and script coverage.

## MUST
- Font stacks MUST cover every supported script and the punctuation, symbols, and numerals required by product content.
- Complex-script rendering MUST rely on shaping-capable platform or library support appropriate to the target environment.
- Font fallback MUST preserve legibility and MUST be tested for mixed-script content.
- Font licensing and distribution rights MUST be verified before fonts are bundled or served.
- Critical text MUST remain readable when optional webfonts fail to load.

## MUST NOT
- A locale MUST NOT be declared supported when required glyphs render as missing-glyph boxes or corrupted shaping.
- Text MUST NOT be converted to images merely to avoid proper script support when accessible text is feasible.
- Font substitution MUST NOT be assumed visually equivalent for scripts with materially different metrics.

## SHOULD
- Font payloads SHOULD be subset only with evidence that required characters and dynamic content remain covered.
- Typography reviews SHOULD include native-script samples at realistic sizes and weights.

## Exceptions
Exceptions require documented platform limitations, affected scripts, fallback behavior, licensing status, and user-impact review.

## Verification
Test all supported scripts, mixed-script strings, bold/italic variants, dynamic characters, font-load failure, shaping sequences, accessibility zoom, and deployment font assets.