#!/usr/bin/env python3
import argparse,json,re
from pathlib import Path

def read_json(path):
    try:return json.loads(Path(path).read_text(encoding='utf-8'))
    except Exception as exc:
        print(json.dumps({'ok':False,'error':f'invalid json: {exc}'})); raise SystemExit(2)
def norm(text): return ' '.join(str(text).casefold().split())
def duplicate_ratio(summary):
    parts=[norm(p) for p in re.split(r'\n\s*\n',summary) if norm(p)]
    return 0.0 if not parts else (len(parts)-len(set(parts)))/len(parts)
def evaluate(event,budget):
    req=['task_id','before_input_tokens','after_input_tokens','output_tokens','summary','required_items','verified_retrieval_refs']
    missing=[k for k in req if k not in event]
    if missing:return {'ok':False,'decision':'block','reasons':['missing:'+k for k in missing]}
    reasons=[]
    for k in ('before_input_tokens','after_input_tokens','output_tokens'):
        v=event[k]
        if isinstance(v,bool) or not isinstance(v,int) or v<0: reasons.append('invalid:'+k)
    if not isinstance(event['summary'],str) or not isinstance(event['required_items'],list) or not isinstance(event['verified_retrieval_refs'],list): reasons.append('invalid:field_types')
    if reasons:return {'ok':False,'decision':'block','reasons':sorted(set(reasons))}
    before,after,output=event['before_input_tokens'],event['after_input_tokens'],event['output_tokens']
    reduction=0.0 if before==0 else (before-after)/before
    if after>int(budget['max_after_input_tokens']): reasons.append('post_compaction_input_budget_exceeded')
    if output>int(budget['max_output_tokens']): reasons.append('output_budget_exceeded')
    if before>=int(budget['enforce_reduction_when_before_tokens_gte']) and reduction<float(budget['min_reduction_ratio']): reasons.append('insufficient_token_reduction')
    dup=duplicate_ratio(event['summary'])
    if dup>float(budget['max_duplicate_paragraph_ratio']): reasons.append('duplicate_summary_ratio_exceeded')
    summary_norm=norm(event['summary']); verified=set(event['verified_retrieval_refs']); missing_required=[]
    for item in event['required_items']:
        if not isinstance(item,dict) or not item.get('id') or not item.get('text'):
            reasons.append('invalid_required_item'); continue
        inline=norm(item['text']) in summary_norm
        ref=item.get('retrieval_ref'); retrievable=bool(ref) and ref in verified
        if not (inline or retrievable): missing_required.append(item['id'])
    if missing_required: reasons.append('critical_context_not_retained')
    metrics={'before_input_tokens':before,'after_input_tokens':after,'output_tokens':output,'reduction_ratio':round(reduction,6),'duplicate_paragraph_ratio':round(dup,6),'required_item_count':len(event['required_items']),'missing_required_count':len(missing_required)}
    return {'ok':not reasons,'decision':'accept_compaction' if not reasons else 'block','reasons':sorted(set(reasons)),'missing_required_items':missing_required,'metrics':metrics}
def main():
    p=argparse.ArgumentParser(); p.add_argument('--event',required=True); p.add_argument('--budget',required=True); a=p.parse_args(); event=read_json(a.event); budget=read_json(a.budget)
    needed={'max_after_input_tokens','max_output_tokens','enforce_reduction_when_before_tokens_gte','min_reduction_ratio','max_duplicate_paragraph_ratio'}
    if not needed.issubset(budget): print(json.dumps({'ok':False,'error':'budget missing required keys'})); return 2
    r=evaluate(event,budget); print(json.dumps(r,indent=2,sort_keys=True)); return 0 if r['ok'] else 3
if __name__=='__main__': raise SystemExit(main())