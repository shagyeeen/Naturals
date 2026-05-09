import { supabase } from '@/lib/supabase'

// GET — fetch AI analysis results
export const getAiAnalysis = (customerId: string) =>
  supabase
    .from('customers')
    .select('ai_hairstyle_analysis')
    .eq('id', customerId)
    .single()

// PUT — update AI analysis results
export const updateAiAnalysis = (customerId: string, analysis: any) =>
  supabase
    .from('customers')
    .update({ ai_hairstyle_analysis: analysis })
    .eq('id', customerId)
    .select()
    .single()
