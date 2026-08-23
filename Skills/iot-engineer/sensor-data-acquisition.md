# Sensor Data Acquisition

## Purpose
Acquire trustworthy sensor data with correct sampling, calibration, timestamping, filtering, and error handling.

## When to use
Use when integrating sensors or diagnosing noisy, drifting, missing, or implausible measurements.

## Inputs
Sensor datasheets, accuracy requirements, sampling needs, buses, environment, calibration process.

## Context to inspect
Drivers, ADC settings, I2C/SPI/UART behavior, timing, units, calibration coefficients, and physical installation.

## Core knowledge
Sensor quality depends on the entire measurement chain. Resolution is not accuracy; sampling rate, aliasing, noise, calibration, temperature, mounting, and clock quality affect results.

## Procedure
1. Define measurement range, accuracy, precision, and timing requirements.
2. Verify electrical and protocol integration.
3. Select sampling rate from signal characteristics.
4. Apply calibration and unit conversion explicitly.
5. Detect saturation, disconnection, impossible values, and stale samples.
6. Filter only with understood latency and signal impact.
7. Preserve timestamps and quality metadata.
8. Compare against reference instruments.

## Decision points
Filter at the edge when bandwidth or control loops require it; retain raw data when later analysis or audit value justifies storage.

## Common failure patterns
Confusing precision with accuracy, hidden unit conversions, over-filtering, aliasing, and silently replacing invalid samples.

## Verification
Use controlled inputs, reference measurements, boundary tests, drift tests, and timing measurements.

## Expected output
A characterized acquisition pipeline with known uncertainty and failure behavior.

## Stop conditions
Stop when calibration references or sensor operating conditions are unavailable.