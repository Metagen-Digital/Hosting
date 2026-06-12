export default defineNuxtPlugin(async () => {
  const { fetchUser, authToken } = useAuth()
  if (authToken.value) {
    await fetchUser()
  }
})
