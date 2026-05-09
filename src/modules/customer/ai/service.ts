import { getAiAnalysis, updateAiAnalysis } from './dao'

export const fetchAiAnalysis = async (customerId: string) => {
  const { data, error } = await getAiAnalysis(customerId)
  if (error) throw new Error(error.message)
  return data?.ai_hairstyle_analysis
}

export const saveAiAnalysis = async (customerId: string, analysis: any) => {
  const { data, error } = await updateAiAnalysis(customerId, analysis)
  if (error) throw new Error(error.message)
  return data?.ai_hairstyle_analysis
}
