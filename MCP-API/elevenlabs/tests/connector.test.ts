import { describe, expect, it } from 'vitest';
import { mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { readFileSync } from 'node:fs';
import { assertApproved, assertInputPathAllowed, loadConfig } from '../src/config.js';
import { ALLOWED_UPSTREAM_TOOLS, ElevenLabsUpstream } from '../src/upstream.js';

const baseEnv = {
  ELEVENLABS_API_KEY: 'test-key',
  ELEVENLABS_APPROVAL_MODE: 'required',
  ELEVENLABS_APPROVED_ACTIONS: 'elevenlabs.speech.generate'
};

describe('configuration and approvals', () => {
  it('requires an API key', () => expect(() => loadConfig({})).toThrow());
  it('permits an explicitly approved billable action', () => {
    const config = loadConfig(baseEnv);
    expect(() => assertApproved(config, 'elevenlabs.speech.generate')).not.toThrow();
  });
  it('rejects an unapproved billable action', () => {
    const config = loadConfig(baseEnv);
    expect(() => assertApproved(config, 'elevenlabs.speech.transcribe')).toThrow(/APPROVAL_REQUIRED/);
  });
});

describe('input path isolation', () => {
  it('allows files inside configured root and denies traversal outside it', () => {
    const root = path.join(tmpdir(), `elevenlabs-test-${process.pid}`);
    mkdirSync(root, { recursive: true });
    const inside = path.join(root, 'audio.mp3');
    writeFileSync(inside, 'fake');
    const config = loadConfig({ ...baseEnv, ELEVENLABS_ALLOWED_INPUT_ROOT: root });
    expect(() => assertInputPathAllowed(config, inside)).not.toThrow();
    expect(() => assertInputPathAllowed(config, path.resolve(root, '..', 'secret.wav'))).toThrow(/INPUT_PATH_DENIED/);
  });
});

describe('upstream allowlist', () => {
  it('contains only reviewed official MCP tools', () => {
    expect([...ALLOWED_UPSTREAM_TOOLS].sort()).toEqual([
      'check_subscription', 'get_agent', 'get_conversation', 'get_voice', 'list_agents', 'list_conversations',
      'list_models', 'search_voices', 'speech_to_text', 'text_to_sound_effects', 'text_to_speech'
    ]);
  });

  it('denies arbitrary upstream tool names before connecting', async () => {
    const upstream = new ElevenLabsUpstream(loadConfig(baseEnv));
    await expect(upstream.call('delete_everything', {})).rejects.toThrow(/UPSTREAM_TOOL_DENIED/);
  });
});

describe('MCP tool surface', () => {
  it('registers the intended provider-scoped tools and no generic escape hatch', () => {
    const source = readFileSync(new URL('../src/server.ts', import.meta.url), 'utf8');
    const names = [...source.matchAll(/server\.tool\('([^']+)'/g)].map(match => match[1]);
    expect(names).toEqual(expect.arrayContaining([
      'elevenlabs.voice.search', 'elevenlabs.voice.get', 'elevenlabs.model.list', 'elevenlabs.subscription.get',
      'elevenlabs.agent.list', 'elevenlabs.agent.get', 'elevenlabs.conversation.list', 'elevenlabs.conversation.get',
      'elevenlabs.speech.generate', 'elevenlabs.speech.transcribe', 'elevenlabs.sound_effect.generate'
    ]));
    expect(source).not.toContain('execute_any');
    expect(source).not.toContain('raw_request');
  });
});
