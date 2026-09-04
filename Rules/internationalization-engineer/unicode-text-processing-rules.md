# Unicode and Text Processing Rules

## Purpose
Prevent corruption, security defects, and language-specific failures caused by incorrect assumptions about characters and strings.

## Scope
Applies to text storage, normalization, comparison, slicing, length limits, searching, identifiers, and encoding boundaries.

## MUST
- Text interfaces MUST use a documented Unicode encoding and MUST reject or repair invalid byte sequences according to an explicit policy.
- User-perceived character operations MUST use grapheme-aware logic when truncation, cursor movement, or visible length is involved.
- Unicode normalization MUST be applied only where the domain requires canonical equivalence and the chosen normalization form MUST be documented.
- Identifier comparison MUST define case, normalization, confusable, and locale semantics independently from display formatting.
- Database and transport layers MUST preserve the full supported Unicode repertoire.

## MUST NOT
- Code MUST NOT assume one code unit equals one character.
- Arbitrary byte or code-unit slicing MUST NOT be used for visible-text truncation.
- Locale-sensitive case conversion MUST NOT be used for security identifiers unless explicitly required and verified.

## SHOULD
- Security-sensitive identifiers SHOULD be evaluated for homoglyph and mixed-script spoofing risk.
- Search normalization SHOULD preserve enough source information to explain matching behavior.

## Exceptions
Exceptions require documented text semantics, supported scripts, compatibility impact, and deterministic tests.

## Verification
Test combining marks, emoji sequences, supplementary characters, composed/decomposed forms, locale-sensitive casing, malformed encoding, mixed scripts, and database round trips.