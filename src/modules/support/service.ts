export interface SupportQuery {
  id: string
  user_id: string
  subject: string
  message: string
  status: 'pending' | 'in-progress' | 'resolved' | 'closed'
  admin_notes?: string
  created_at: string
  updated_at: string
  user?: {
    full_name: string
    email: string
    role: string
  }
}

export const createQuery = async (userId: string, subject: string, message: string) => {
  const res = await fetch('/api/support/queries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, subject, message })
  });
  
  if (!res.ok) {
    const errorData = await res.json();
    return { data: null, error: new Error(errorData.error || 'Failed to create query') };
  }
  
  const data = await res.json();
  return { data, error: null };
}

export const getMyQueries = async (userId: string) => {
  const res = await fetch(`/api/support/queries?userId=${userId}`);
  if (!res.ok) {
    const errorData = await res.json();
    return { data: null, error: new Error(errorData.error || 'Failed to fetch queries') };
  }
  const data = await res.json();
  return { data, error: null };
}

export const getAllQueries = async () => {
  const res = await fetch('/api/support/queries?all=true');
  if (!res.ok) {
    const errorData = await res.json();
    return { data: null, error: new Error(errorData.error || 'Failed to fetch all queries') };
  }
  const data = await res.json();
  return { data, error: null };
}

export const updateQueryStatus = async (id: string, status: string, notes?: string) => {
  const res = await fetch('/api/support/queries', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, status, admin_notes: notes })
  });
  
  if (!res.ok) {
    const errorData = await res.json();
    return { data: null, error: new Error(errorData.error || 'Failed to update query') };
  }
  
  const data = await res.json();
  return { data, error: null };
}
