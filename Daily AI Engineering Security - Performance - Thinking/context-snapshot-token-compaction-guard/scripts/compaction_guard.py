#!/usr/bin/env python3
import json, sys
from pathlib import Path

REQUIRED_STATE={'goal','constraints','decisions','verification_status'}

def evaluate(event):
    required={'context_window_tokens','snapshot_tokens','snapshot_provenance','utilization_threshold','critical_state'}
    missing=sorted(required-set(event))
    if missing:
        return {'ok':False,'decision':'block','reasons':['missing:'+x for x in missing]}
    try:
        window=float(event['context_window_tokens']); snap=float(event['snapshot_tokens']); threshold=float(event['utilization_threshold'])
    except (TypeError,ValueError):
        return {'ok':False,'decision':'block','reasons':['invalid_numeric_input']}
    reasons=[]
    if window<=0 or snap<0 or not (0<threshold<1): reasons.append('invalid_range')
    prov=event['snapshot_provenance']
    if prov not in {'provider_current_context','tokenizer_current_prompt','last_call_context_snapshot'}:
        reasons.append('invalid_snapshot_provenance')
    utilization=(snap/window) if window>0 else 0
    if utilization<threshold: reasons.append('below_compaction_threshold')
    cumulative=event.get('cumulative_usage_tokens')
    if cumulative is not None and float(cumulative)==snap and prov=='cumulative_usage': reasons.append('cumulative_usage_not_snapshot')
    last_call=event.get('last_call_input_tokens')
    if last_call is not None and float(last_call)>0 and snap>float(last_call)*4:
        reasons.append('snapshot_inconsistent_with_last_call')
    state=event.get('critical_state') or {}
    missing_state=sorted(REQUIRED_STATE-set(state))
    reasons += ['missing_critical_state:'+x for x in missing_state]
    if reasons:
        return {'ok':False,'decision':'block','utilization':utilization,'reasons':reasons}
    return {'ok':True,'decision':'allow_compaction','utilization':utilization,'required_state_keys':sorted(REQUIRED_STATE)}

def main():
    if len(sys.argv)!=2:
        print('usage: compaction_guard.py event.json',file=sys.stderr); return 2
    try:
        event=json.loads(Path(sys.argv[1]).read_text(encoding='utf-8'))
        result=evaluate(event); print(json.dumps(result,indent=2,sort_keys=True)); return 0 if result['ok'] else 3
    except (OSError,json.JSONDecodeError) as e:
        print(json.dumps({'ok':False,'decision':'error','error':str(e)}),file=sys.stderr); return 2
if __name__=='__main__': raise SystemExit(main())
