#!/usr/bin/env python3
import argparse, json, sys

def main():
    p=argparse.ArgumentParser(description='Check observable convergence ledger')
    p.add_argument('ledger'); p.add_argument('--soft-ratio',type=float,default=2.0); p.add_argument('--hard-ratio',type=float,default=5.0)
    a=p.parse_args()
    try: d=json.load(open(a.ledger,encoding='utf-8'))
    except Exception as e: print(f'input error: {e}',file=sys.stderr); return 2
    actions=d.get('actions',[])
    if not isinstance(actions,list) or not d.get('terminal_objective'):
        print('invalid ledger',file=sys.stderr); return 2
    no_gain=0; max_consecutive=0; duplicate_no_gain=0; seen={}
    for x in actions:
        gain=x.get('evidence_gain','none'); sig=x.get('signature')
        if gain in ('none','low'):
            no_gain+=1; max_consecutive=max(max_consecutive,no_gain)
            if sig and sig in seen: duplicate_no_gain+=1
        else: no_gain=0
        if sig: seen[sig]=seen.get(sig,0)+1
    baseline=max(float(d.get('baseline_minutes',1) or 1),0.01)
    elapsed=float(d.get('elapsed_minutes',0) or 0); ratio=elapsed/baseline
    errors=[]; warnings=[]
    if max_consecutive>=3: errors.append('three-or-more consecutive no-gain actions')
    if duplicate_no_gain>0: warnings.append(f'{duplicate_no_gain} repeated no-gain signatures')
    if ratio>=a.hard_ratio: errors.append(f'elapsed/baseline ratio {ratio:.2f} exceeds hard ratio')
    elif ratio>=a.soft_ratio: warnings.append(f'elapsed/baseline ratio {ratio:.2f} exceeds soft ratio')
    if int(d.get('reopened_settled_decisions',0) or 0)>0: warnings.append('settled decisions reopened')
    out={'pass':not errors,'errors':errors,'warnings':warnings,'max_consecutive_no_gain':max_consecutive,'duplicate_no_gain':duplicate_no_gain,'elapsed_baseline_ratio':round(ratio,2),'verdict':'BLOCK' if errors else ('REPLAN' if warnings else 'CONTINUE')}
    print(json.dumps(out,indent=2)); return 0 if not errors else 3

if __name__=='__main__': raise SystemExit(main())
