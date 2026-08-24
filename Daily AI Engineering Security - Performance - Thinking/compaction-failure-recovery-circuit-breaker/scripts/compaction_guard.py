#!/usr/bin/env python3
"""Evaluate normalized compaction lifecycle events and open a bounded recovery circuit."""
import argparse, json, sys
from pathlib import Path


def load_json(path):
    with Path(path).open('r', encoding='utf-8') as f:
        return json.load(f)


def load_events(path):
    events = []
    with Path(path).open('r', encoding='utf-8') as f:
        for n, line in enumerate(f, 1):
            if not line.strip():
                continue
            obj = json.loads(line)
            if not isinstance(obj, dict) or not isinstance(obj.get('type'), str):
                raise ValueError(f'line {n}: event requires string type')
            events.append(obj)
    return events


def evaluate(events, policy):
    names = policy.get('events', {})
    required_names = ['start','success','failure','checkpoint','progress','session_end']
    if any(not isinstance(names.get(k), str) for k in required_names):
        raise ValueError('policy.events must define start/success/failure/checkpoint/progress/session_end')
    max_fail = int(policy.get('max_consecutive_failures', 2))
    max_debris = int(policy.get('max_retry_debris_growth_tokens', 4096))
    require_checkpoint = bool(policy.get('require_checkpoint_before_retry', True))
    if max_fail < 1 or max_debris < 0:
        raise ValueError('invalid retry/debris bounds')

    consecutive = 0
    checkpoint_since_last_failure = False
    started = False
    last_debris = None
    reasons = []
    stats = {'starts':0,'successes':0,'failures':0,'checkpoints':0,'progress_events':0,'session_ends':0,'max_consecutive_failures':0,'max_debris_growth_tokens':0}

    for ev in events:
        t = ev['type']
        if t == names['start']:
            started = True; stats['starts'] += 1
            if consecutive > 0 and require_checkpoint and not checkpoint_since_last_failure:
                reasons.append('retry-started-without-checkpoint')
            checkpoint_since_last_failure = False
        elif t == names['checkpoint']:
            checkpoint_since_last_failure = True; stats['checkpoints'] += 1
        elif t == names['failure']:
            stats['failures'] += 1; consecutive += 1
            stats['max_consecutive_failures'] = max(stats['max_consecutive_failures'], consecutive)
            debris = ev.get('retry_debris_tokens')
            if debris is not None:
                try: debris = int(debris)
                except (TypeError, ValueError): raise ValueError('retry_debris_tokens must be integer')
                if last_debris is not None:
                    growth = max(0, debris - last_debris)
                    stats['max_debris_growth_tokens'] = max(stats['max_debris_growth_tokens'], growth)
                    if growth > max_debris:
                        reasons.append(f'retry-debris-growth-exceeded:{growth}>{max_debris}')
                last_debris = debris
            if consecutive >= max_fail:
                reasons.append(f'consecutive-failures-exceeded:{consecutive}>={max_fail}')
            started = False
        elif t == names['success']:
            stats['successes'] += 1; consecutive = 0; started = False; last_debris = None; checkpoint_since_last_failure = False
        elif t == names['progress']:
            stats['progress_events'] += 1; consecutive = 0; last_debris = None
        elif t == names['session_end']:
            stats['session_ends'] += 1
            if started or consecutive > 0:
                reasons.append('session-ended-during-unresolved-compaction')

    # preserve first occurrence order while deduplicating exact reasons
    seen = set(); reasons = [r for r in reasons if not (r in seen or seen.add(r))]
    return {'decision':'recovery_required' if reasons else 'continue','reasons':reasons,'stats':stats,'unresolved_start':started,'consecutive_failures':consecutive}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--input', required=True)
    ap.add_argument('--policy', required=True)
    args = ap.parse_args()
    try:
        policy = load_json(args.policy)
        events = load_events(args.input)
        result = evaluate(events, policy)
        print(json.dumps(result, indent=2, sort_keys=True))
        return 2 if result['decision'] == 'recovery_required' else 0
    except (OSError, json.JSONDecodeError, ValueError, TypeError) as e:
        print(json.dumps({'decision':'invalid','reason':str(e)}))
        return 3

if __name__ == '__main__':
    sys.exit(main())
