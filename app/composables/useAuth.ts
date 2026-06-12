export interface AuthUser {
  id: number
  name: string
  email: string
  phone: string | null
  roles: string[]
  permissions: string[]
}

export const useAuth = () => {
  const config = useRuntimeConfig()
  const apiBase = (config.public.apiBase as string) || `${config.public.backendUrl}/api`
  const cookieDomain = (config.public.cookieDomain as string) || undefined

  const authToken = useCookie<string | null>('mgd_auth_token', {
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax',
    secure: import.meta.env.PROD,
    domain: cookieDomain || undefined,
    default: () => null,
  })

  const user = useState<AuthUser | null>('auth.user', () => null)
  const loading = useState<boolean>('auth.loading', () => false)

  const isLoggedIn = computed(() => !!authToken.value)
  const isAdmin = computed(() => user.value?.roles?.includes('super_admin') ?? false)
  const userInitials = computed(() => {
    if (!user.value?.name) return '?'
    return user.value.name
      .split(' ')
      .map((n: string) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
  })

  async function fetchUser() {
    if (!authToken.value) return
    try {
      const data = await $fetch<any>(`${apiBase}/auth/user`, {
        headers: {
          Authorization: `Bearer ${authToken.value}`,
          Accept: 'application/json',
        },
      })
      user.value = data.data
    } catch (e: any) {
      if (e?.response?.status === 401) {
        authToken.value = null
        user.value = null
      }
    }
  }

  async function login(email: string, password: string) {
    loading.value = true
    try {
      const data = await $fetch<any>(`${apiBase}/auth/login`, {
        method: 'POST',
        body: { email, password },
        headers: { Accept: 'application/json' },
      })
      authToken.value = data.data.token
      user.value = data.data.user
      return { success: true }
    } catch (e: any) {
      return {
        success: false,
        errors: e?.data?.errors || { email: [e?.data?.message || 'Login failed'] },
      }
    } finally {
      loading.value = false
    }
  }

  async function register(
    name: string,
    email: string,
    password: string,
    password_confirmation: string,
  ) {
    loading.value = true
    try {
      const data = await $fetch<any>(`${apiBase}/auth/register`, {
        method: 'POST',
        body: { name, email, password, password_confirmation },
        headers: { Accept: 'application/json' },
      })
      authToken.value = data.data.token
      user.value = data.data.user
      return { success: true }
    } catch (e: any) {
      return {
        success: false,
        errors: e?.data?.errors || { name: [e?.data?.message || 'Registration failed'] },
      }
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    loading.value = true
    try {
      if (authToken.value) {
        await $fetch(`${apiBase}/auth/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${authToken.value}`,
            Accept: 'application/json',
          },
        }).catch(() => {})
      }
    } finally {
      authToken.value = null
      user.value = null
      loading.value = false
      await navigateTo('/auth/login')
    }
  }

  async function updateProfile(name: string, phone: string) {
    loading.value = true
    try {
      const data = await $fetch<any>(`${apiBase}/auth/profile`, {
        method: 'PUT',
        body: { name, phone },
        headers: { Authorization: `Bearer ${authToken.value}`, Accept: 'application/json' },
      })
      user.value = data.data
      return { success: true }
    } catch (e: any) {
      return { success: false, errors: e?.data?.errors || { name: [e?.data?.message || 'Update failed'] } }
    } finally {
      loading.value = false
    }
  }

  async function changePassword(current_password: string, password: string, password_confirmation: string) {
    loading.value = true
    try {
      await $fetch<any>(`${apiBase}/auth/password`, {
        method: 'PUT',
        body: { current_password, password, password_confirmation },
        headers: { Authorization: `Bearer ${authToken.value}`, Accept: 'application/json' },
      })
      return { success: true }
    } catch (e: any) {
      return { success: false, errors: e?.data?.errors || { current_password: [e?.data?.message || 'Password change failed'] } }
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    isLoggedIn,
    isAdmin,
    loading,
    userInitials,
    authToken,
    fetchUser,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
  }
}
