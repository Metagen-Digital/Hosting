export default defineEventHandler(async (event) => {
  const id     = getRouterParam(event, 'id')
  const config = useRuntimeConfig()

  if (!id || !/^MGD-[A-Z0-9]{6}$/i.test(id)) {
    throw createError({ statusCode: 400, message: 'Invalid order ID format' })
  }

  const url = `${config.backendUrl}/api/hosting-orders/${id.toUpperCase()}/status`

  try {
    const data = await $fetch(url)
    return data
  } catch (err: any) {
    const status = err?.response?.status ?? err?.statusCode ?? 500
    if (status === 404) {
      throw createError({ statusCode: 404, message: `Order ${id} not found` })
    }
    throw createError({ statusCode: 502, message: 'Unable to reach backend. Please try again.' })
  }
})
