import { getSchedule, upsertScheduleDay } from './dao'

export const fetchSchedule = async (stylistId: string) => {
  const { data, error } = await getSchedule(stylistId)
  if (error) throw new Error(error.message)
  return data
}

export const saveScheduleDay = async (
  stylistId: string, 
  day: number, 
  startTime: string, 
  endTime: string, 
  isAvailable: boolean
) => {
  const { data, error } = await upsertScheduleDay(stylistId, day, startTime, endTime, isAvailable)
  if (error) throw new Error(error.message)
  return data
}
