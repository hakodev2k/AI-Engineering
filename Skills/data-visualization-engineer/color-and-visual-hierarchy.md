# Color and Visual Hierarchy

## Purpose
Use color, contrast, typography, spacing, and emphasis to communicate hierarchy without distorting data.

## When to use
During visual design, redesign, accessibility review, or when dashboards feel noisy or ambiguous.

## Inputs
Semantic categories, ordered values, brand constraints, background theme, accessibility requirements.

## Core knowledge
Color should carry deliberate semantics. Sequential palettes represent magnitude, diverging palettes represent meaningful deviation around a center, and categorical palettes distinguish unordered groups. Contrast and redundant cues are essential for accessibility.

## Procedure
1. Identify what deserves primary, secondary, and contextual attention.
2. Reserve saturated emphasis for important states or selections.
3. Choose palette type from data semantics.
4. Keep semantic colors consistent across views.
5. Verify foreground/background and text contrast.
6. Add shape, labels, patterns, or position when color alone would encode critical meaning.
7. Test grayscale and common color-vision deficiencies.
8. Reduce borders, gridlines, and decoration that compete with data.
9. Standardize typography and spacing tokens.

## Decision points
Use direct labels instead of legends when space and density permit. Use brand colors only when they remain perceptually appropriate for the encoded data.

## Common failure patterns
Too many categorical colors; red/green as the only distinction; arbitrary gradients; low-contrast labels; emphasizing every KPI; using color decoratively and semantically at once.

## Verification
Check contrast with accessibility tooling, inspect grayscale, test representative states, and confirm users correctly identify emphasized information.

## Expected output
A visual hierarchy and palette specification with semantic mappings and accessibility evidence.

## Stop conditions
Escalate when mandated branding prevents minimum accessibility or creates misleading semantic associations.