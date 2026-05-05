export interface OrderData {
  orderId: string
  fullName: string
  email: string
  phone: string
  companyName: string
  address: string
  domainName: string
  plan: string
  billing: string
  price: number
  payMethod: string
  txId: string
  sendFrom: string
  orderedAt: string
}

export const useOrderStore = () =>
  useState<OrderData | null>('hosting-order-data', () => null)
