import unittest
from scripts.compaction_guard import evaluate
B={'max_after_input_tokens':8000,'max_output_tokens':1200,'enforce_reduction_when_before_tokens_gte':8000,'min_reduction_ratio':0.20,'max_duplicate_paragraph_ratio':0.10}
def evt(): return {'task_id':'t1','before_input_tokens':10000,'after_input_tokens':6000,'output_tokens':300,'summary':'Never deploy without human approval.\n\nCompleted parser migration.','required_items':[{'id':'approval','text':'Never deploy without human approval.','retrieval_ref':None},{'id':'migration','text':'Parser migration details','retrieval_ref':'memory://parser-migration'}],'verified_retrieval_refs':['memory://parser-migration']}
class T(unittest.TestCase):
 def test_valid(self): self.assertTrue(evaluate(evt(),B)['ok'])
 def test_missing_critical(self):
  e=evt(); e['verified_retrieval_refs']=[]; self.assertIn('critical_context_not_retained',evaluate(e,B)['reasons'])
 def test_after_budget(self):
  e=evt(); e['after_input_tokens']=8500; self.assertFalse(evaluate(e,B)['ok'])
 def test_insufficient_reduction(self):
  e=evt(); e['after_input_tokens']=9000; self.assertIn('insufficient_token_reduction',evaluate(e,B)['reasons'])
 def test_duplicate(self):
  e=evt(); e['summary']='Never deploy without human approval.\n\nNever deploy without human approval.\n\nNever deploy without human approval.'; e['required_items']=[e['required_items'][0]]; self.assertIn('duplicate_summary_ratio_exceeded',evaluate(e,B)['reasons'])
 def test_small_context(self):
  e=evt(); e['before_input_tokens']=4000; e['after_input_tokens']=4000; self.assertTrue(evaluate(e,B)['ok'])
 def test_output_budget(self):
  e=evt(); e['output_tokens']=1300; self.assertFalse(evaluate(e,B)['ok'])
 def test_invalid(self):
  e=evt(); e['before_input_tokens']=-1; self.assertFalse(evaluate(e,B)['ok'])
if __name__=='__main__': unittest.main()