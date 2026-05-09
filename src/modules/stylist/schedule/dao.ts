import { supabase } from '@/lib/supabase'

// GET — fetch stylist schedule
export const getSchedule = (stylistId: string) =>
  supabase
    .from('stylist_schedule')
    .select('*')
    .eq('stylist_id', stylistId)
    .order('day_of_week', { ascending: true })

// PUT — upsert schedule day
export const upsertScheduleDay = (stylistId: string, day: number, startTime: string, endTime: string, isAvailable: boolean) =>
  supabase
    .from('stylist_schedule')
    .upsert({
      stylist_id: stylistId,
      day_of_week: day,
      start_time: startTime,
      end_time: endTime,
      is_available: isAvailable
    }, { onConflict: 'stylist_id, day_of_week' })
    .select()
    .single()
