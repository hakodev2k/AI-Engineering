#!/usr/bin/env python3
"""Deterministic guard for bounded evidence-gain loops."""
import argparse, json, pathlib, sys

def load(path):
    try: return json.loads(pathlib.Path(path).read_text(encoding='utf-8'))
    except Exception as exc:
        print(f'cannot read ledger: {exc}', file=sys.stderr); raise SystemExit(2)

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument('ledger')
    args=ap.parse_args()
    data=load(args.ledger)
    required=['terminal_objective','acceptance_criteria','phase','actions']
    if not isinstance(data,dict) or any(k not in data for k in required):
        print('ledger missing required fields', file=sys.stderr); return 2
    actions=data['actions']
    if not isinstance(actions,list):
        print('actions must be an array', file=sys.stderr); return 2
    recent=actions[-3:]
    gains=[a.get('evidence_gain') for a in recent if isinstance(a,dict)]
    no_gain_streak=0
    for a in reversed(actions):
        if isinstance(a,dict) and a.get('evidence_gain')=='none': no_gain_streak+=1
        else: break
    low_gain_three=len(gains)==3 and all(g in ('none','partial') for g in gains) and 'decisive' not in gains
    unsupported=[c for c in data.get('progress_claims',[]) if not isinstance(c,dict) or not c.get('evidence')]
    result={
        'phase':data['phase'],
        'no_gain_streak':no_gain_streak,
        'low_gain_last_three':low_gain_three,
        'unsupported_progress_claims':len(unsupported),
        'strategy_reset_required':no_gain_streak>=2,
        'autonomous_stop_required':low_gain_three or no_gain_streak>=3,
        'pass':not unsupported and no_gain_streak<2 and not low_gain_three
    }
    print(json.dumps(result,indent=2))
    return 0 if result['pass'] else 3

if __name__=='__main__': raise SystemExit(main())
