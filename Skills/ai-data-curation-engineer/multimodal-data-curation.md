# Multimodal Data Curation

## Purpose
Curate aligned image, audio, video, document, sensor, and text data so each modality is usable, correctly paired, legally governed, and informative for the target multimodal task.

## When to use
Use for vision-language, speech-language, video understanding, document AI, embodied AI, multimodal retrieval, and any dataset where meaning depends on relationships across two or more modalities.

## Inputs
- Raw media and associated text or labels
- Modality requirements and target task
- Pairing or synchronization metadata
- Source provenance and rights
- Preprocessing constraints
- Quality and privacy policies

## Context to inspect
Inspect codecs and file integrity, frame/sample rates, timestamps, document layout, captions, OCR, transcripts, sensor synchronization, EXIF or embedded metadata, perceptual duplicates, modality-specific PII, storage costs, and downstream model preprocessing.

## Core knowledge
Multimodal quality is relational as well as per-modality. A high-quality image with the wrong caption is a bad pair. Temporal tasks require synchronization; documents require layout preservation; speech requires transcript alignment; media may contain personal information invisible to text-only scanners. Derived representations should remain traceable to raw sources.

## Procedure
1. Define the multimodal example contract and required alignment granularity.
2. Validate that every media object is decodable and within supported limits.
3. Score modality-specific quality such as resolution, clipping, silence, blur, corruption, or legibility.
4. Validate timestamps, page/region references, frame spans, or other pairing keys.
5. Test caption, transcript, OCR, or label grounding against the source modality.
6. Detect orphaned, mismatched, truncated, or weakly aligned pairs.
7. Run exact and perceptual deduplication within and across sources.
8. Apply privacy, safety, and rights controls to every modality, not only text metadata.
9. Measure coverage by modality, domain, language, duration, resolution, and difficulty.
10. Review stratified samples of both accepted and rejected examples.
11. Validate downstream loaders and preprocessing on representative records.
12. Preserve raw-to-derived lineage and version all transformations.

## Decision points
Keep weakly aligned data only when the target objective can benefit from weak supervision. Drop an entire pair when one modality is essential but unusable. Preserve raw media when future preprocessing is likely and rights permit retention; otherwise retain only approved derived artifacts with lineage.

## Common failure patterns
- Correct captions attached to the wrong media
- Timestamp drift between audio, video, and sensors
- Text-only privacy scanning of visual or audio content
- Destructive resizing or compression before quality review
- Treating OCR output as authoritative ground truth
- Deduplicating captions without detecting duplicate media
- Losing page, region, or temporal alignment during shuffling

## Verification
Implemented means multimodal records satisfy schema, decode, pairing, and policy checks. Verified means sampled alignment is accurate, modality-specific quality thresholds hold, downstream preprocessing succeeds, and slice-level model or retrieval tests confirm that retained pairs provide useful signal.

## Expected output
A versioned multimodal dataset with media-quality metrics, alignment metadata, provenance, privacy and rights status, duplicate clusters, rejection reasons, and downstream compatibility evidence.

## Stop conditions
Stop when media rights are unresolved, synchronization cannot be recovered for a task that requires it, required codecs or raw assets are unavailable, privacy review cannot cover all modalities, or alignment quality cannot be measured reliably.