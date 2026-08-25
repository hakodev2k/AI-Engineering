# Chart Selection and Visual Encoding

## Purpose
Choose chart forms and visual channels that represent analytical relationships accurately and efficiently.

## When to use
When translating measures, categories, distributions, relationships, geographies, or time series into visuals.

## Inputs
Analytical task, field types, cardinality, audience, uncertainty, comparison requirements.

## Core knowledge
Position on a common scale generally supports more precise comparison than area, angle, or volume. Chart choice follows task: comparison, trend, distribution, relationship, composition, flow, or spatial pattern. Encoding must preserve semantic meaning and perceptual ordering.

## Procedure
1. State the comparison or inference the user must make.
2. Classify variables as quantitative, ordinal, nominal, temporal, or spatial.
3. Choose the simplest chart family that supports the task.
4. Map the most important variable to the strongest perceptual channel.
5. Set meaningful scales, baselines, ordering, and reference values.
6. Reduce redundant encodings and non-data decoration.
7. Handle dense categories with grouping, filtering, small multiples, or alternative views.
8. Represent uncertainty or missingness explicitly when material.
9. Test interpretation with representative values and edge cases.

## Decision points
Use bars for discrete magnitude comparison, lines for ordered temporal continuity, scatterplots for quantitative relationships, and distributions when averages hide variation. Use pies only for a small number of parts where approximate part-to-whole comparison is sufficient.

## Common failure patterns
Truncated axes that exaggerate bars; dual axes implying false relationships; 3D distortion; rainbow palettes for ordered data; area encoding for precise comparisons; connecting missing time points as observed continuity.

## Verification
Ask a reviewer to answer the intended analytical question without explanation. Check that the visual conclusion matches calculations from source data.

## Expected output
A defensible chart specification including mark type, channels, scales, ordering, references, annotations, and rationale.

## Stop conditions
Stop if the requested chart would materially misrepresent the data or if the analytical task is undefined.