export async function verifyEmail(email: string, mode: number): Promise<boolean> {
  const response = await fetch('/api/auth/verify-email?email=' + encodeURIComponent(email) + '&mode=' + mode)
  if (!response.ok) return false
  const data = await response.json()
  return data.valid
}

export async function signIn(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', email, password }),
      credentials: 'include',
    })

    const data = await response.json()

    if (!response.ok) {
      return { success: false, error: data.error || 'Invalid email or password' }
    }

    return { success: true }
  } catch {
    return { success: false, error: 'An error occurred during sign in' }
  }
}

export async function signUp(email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'register', email, password, name }),
      credentials: 'include',
    })

    const data = await response.json()

    if (!response.ok) {
      return { success: false, error: data.error || 'Registration failed' }
    }

    return { success: true }
  } catch {
    return { success: false, error: 'An error occurred during registration' }
  }
}
