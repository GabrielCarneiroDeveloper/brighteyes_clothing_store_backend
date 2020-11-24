import { Client } from '../client/Client'
import { ClothesStatusEnum } from '../clothes_status/ClothesStatusEnum'
import { EnumEmployeeClientStatus } from '../employee_client_status/IEmployeeClientStatus'

interface ShoppingCartValuable {
  shoppingCartId: number
  value: number
}

interface ClientValuable {
  client: Pick<Client, 'id' | 'name'>
  value: number
}

interface ClientAvailability {
  name: number
  status: EnumEmployeeClientStatus
}

interface ClothesAvailabilityMetrics {
  status: ClothesStatusEnum
  quantity: number
}

interface ClientAvailabilityMetrics {
  status: EnumEmployeeClientStatus
  quantity: number
}

export {
  ShoppingCartValuable,
  ClientValuable,
  ClothesAvailabilityMetrics,
  ClientAvailability,
  ClientAvailabilityMetrics
}
