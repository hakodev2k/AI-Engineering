# Multimodal Attack Testing

## Purpose
Evaluate security failures caused by interactions among text, image, audio, video, and document inputs.

## Scope
Supported modalities, preprocessors, OCR or transcription stages, metadata, encoders, and downstream tools.

## MUST
- Test instructions and payloads hidden or transformed across supported modalities.
- Trace whether preprocessing changes security-relevant meaning or bypasses controls.
- Evaluate cross-modal conflicts and downstream side effects.

## MUST NOT
- Assume text-only safeguards cover non-text channels.
- Use harmful real-world media when synthetic equivalents can establish the finding.

## SHOULD
Include perturbation, metadata, steganographic, transcription, and rendering-edge cases when technically relevant.

## Exceptions
Omitted modalities require evidence they cannot reach the evaluated system path.

## Verification
Retain safe reproductions, preprocessing outputs, model traces, and side-effect evidence for confirmed findings.