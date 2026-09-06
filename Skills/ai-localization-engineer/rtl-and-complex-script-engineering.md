# RTL and Complex Script Engineering

## Purpose
Ensure AI interfaces and generated content behave correctly with right-to-left and complex writing systems.

## When to use
Use when supporting Arabic, Hebrew, Persian, Urdu, Indic scripts, Southeast Asian scripts, or any locale with shaping, combining, or bidirectional behavior.

## Inputs
Target scripts, UI stack, generated-content surfaces, typography constraints, rendering engines, and test devices.

## Preconditions
Relevant fonts and platform support exist for target scripts.

## Context to inspect
Inspect CSS/layout direction, Unicode bidi handling, text editors, markdown/renderers, tokenization, truncation, selection, copy/paste, logs, and notification channels.

## Core knowledge
Script support involves shaping, grapheme clusters, bidirectional ordering, punctuation, numerals, cursor movement, and mixed-script content. Visual order and logical string order differ.

## Procedure
1. Identify all surfaces that render, edit, or transform user/model text.
2. Set direction semantically rather than manually reversing text.
3. Test mixed LTR/RTL content, code, URLs, numbers, and punctuation.
4. Validate shaping and grapheme-safe truncation.
5. Check form controls, tables, chat bubbles, markdown, and notifications.
6. Inspect serialization and logs for logical-order preservation.
7. Test assistive technology where applicable.
8. Add regression cases for discovered rendering defects.

## Decision points
Mirror layout only when interface semantics warrant it; do not automatically mirror icons or data visualizations whose meaning is directional.

## Common failure patterns
Manual string reversal, broken punctuation, clipping combining marks, truncating code points mid-grapheme, and assuming CSS direction alone solves mixed-content problems.

## Verification
Verify representative scripts on supported browsers/devices, including mixed-language conversations and copy/paste round trips.

## Expected output
A tested script-support implementation and regression matrix.

## Stop conditions
Stop when the rendering platform lacks required script support or a font/licensing dependency blocks correct production rendering.