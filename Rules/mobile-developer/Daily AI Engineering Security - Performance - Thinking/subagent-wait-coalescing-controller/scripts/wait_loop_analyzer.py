#!/usr/bin/env python3
import argparse, json, sys
from collections import Counter

def main() -> int:
    p = argparse.ArgumentParser(description='Analyze orchestration wait loops from JSONL events.')
    p.add_argument('file')
    p.add_argument('--max-no-change-ratio', type=float, default=0.80)
    args = p.parse_args()
    if not (0 <= args.max_no_change_ratio <= 1):
        print('invalid ratio', file=sys.stderr); return 2
    total=waits=no_change=model_turns=tokens=invalid=critical=0
    states=Counter()
    try:
        fh=open(args.file, encoding='utf-8')
    except Exception as exc:
        print(f'cannot open log: {exc}', file=sys.stderr); return 2
    try:
        for line_no,line in enumerate(fh,1):
            if not line.strip(): continue
            try: e=json.loads(line)
            except Exception as exc:
                print(f'bad JSONL line {line_no}: {exc}', file=sys.stderr); return 2
            total += 1
            typ=e.get('event_type','')
            if typ in {'wait','wait_agent','list_agents','status'}:
                waits += 1
                if not e.get('material_change', False): no_change += 1
                if e.get('model_turn', False): model_turns += 1
                tokens += int(e.get('input_tokens',0) or 0)
                if e.get('target_valid') is False: invalid += 1
            if typ in {'terminal','error','approval','cancelled','security'}: critical += 1
            if e.get('state_fingerprint'): states[e['state_fingerprint']] += 1
    finally:
        fh.close()
    ratio = (no_change / waits) if waits else 0.0
    out={'events':total,'wait_events':waits,'no_change_waits':no_change,'no_change_ratio':round(ratio,4),'model_visible_wait_turns':model_turns,'wait_input_tokens':tokens,'invalid_wait_targets':invalid,'critical_events':critical,'repeated_state_fingerprints':sum(v-1 for v in states.values() if v>1),'status':'pass' if ratio <= args.max_no_change_ratio and invalid == 0 else 'block'}
    print(json.dumps(out, indent=2))
    return 0 if out['status']=='pass' else 3

if __name__ == '__main__':
    raise SystemExit(main())
