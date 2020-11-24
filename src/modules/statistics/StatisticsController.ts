import { DTOController } from './../../common/dto/DTOController'
import { IController } from './../../interfaces/IControllers'
import { AbstractController } from './../../modules/abstract.controller'
import { Request, Response, Router } from 'express'
import { getRepository } from 'typeorm'
import { Client } from '../client/Client'
import { Clothes } from '../clothes/Clothes'
import { ClothesStatus } from '../clothes_status/ClothesStatus'
import { ClothesStatusEnum } from '../clothes_status/ClothesStatusEnum'
import { EnumEmployeeClientStatus } from '../employee_client_status/IEmployeeClientStatus'
import { ShoppingCart } from '../shopping-cart/ShoppingCart'
import {
  ClothesAvailabilityMetrics,
  ShoppingCartValuable,
  ClientAvailabilityMetrics
} from './StatisticsInterface'
import path from 'path'
import Excel from 'exceljs'

enum MonthEnum {
  JAN = 'Jan',
  FEV = 'Fev',
  MAR = 'Mar',
  APR = 'Apr',
  MAY = 'May',
  JUN = 'Jun',
  JUL = 'Jul',
  AUG = 'Aug',
  SEP = 'Sep',
  OCT = 'Oct',
  NOV = 'Nov',
  DEC = 'Dec'
}

function getMonthEnumByMonthName(monthName: string) {
  switch (monthName) {
    case 'Jan':
      return MonthEnum.JAN
    case 'Fev':
      return MonthEnum.FEV
    case 'Mar':
      return MonthEnum.MAR
    case 'Apr':
      return MonthEnum.APR
    case 'May':
      return MonthEnum.MAY
    case 'Jun':
      return MonthEnum.JUN
    case 'Jul':
      return MonthEnum.JUL
    case 'Aug':
      return MonthEnum.AUG
    case 'Sep':
      return MonthEnum.SEP
    case 'Oct':
      return MonthEnum.OCT
    case 'Nov':
      return MonthEnum.NOV
    case 'Dec':
      return MonthEnum.DEC
  }
}

const getMonthNameByNumber = [
  'Jan',
  'Fev',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
]

interface Month {
  name: MonthEnum
  value: number
}

interface IStatisticsController {
  getQuantityOfClientRegisteredByMonth(): Promise<{ label: string; data: Month[] }>
  getQuantityInStockAndOutOfStockClothes(): Promise<ClothesAvailabilityMetrics[]>
  getQuantityActivatedDeactivatedClients(): Promise<ClientAvailabilityMetrics[]>
  getHowManyShoppingCartWhereCreatedInCurrentMonth(): Promise<number>
  getShoppingCartRanking(): Promise<ShoppingCartValuable[]>
  getQuantityOfClientsRegisteredInCurrentMonth(): Promise<number>
}

interface StatisticsResponse {
  data: {
    client_registered_current_year_by_month: { label: string; data: Month[] }
    clothes_availability_quantity: ClothesAvailabilityMetrics[]
    client_availability_quantity: ClientAvailabilityMetrics[]
    number_of_shopping_carts_created_current_month: number
    shopping_cart_rank: ShoppingCartValuable[]
    quantity_of_clients_registered_in_current_month: number
  }
}

async function worksheetFactory(
  worksheetName: string,
  data: any[],
  fileName: string
): Promise<string> {
  const workbook = new Excel.Workbook()
  const worksheet = workbook.addWorksheet(worksheetName)

  const capitalize = (s: string): string => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
  }

  const keys = Object.keys(data[0])
  worksheet.columns = keys.map((k) => ({
    header: capitalize(k),
    key: k,
    width: k.length * 2
  }))

  data.forEach((d) => worksheet.addRow(d))
  const fullFileName = fileName + `${new Date().getMonth()}${new Date().getFullYear()}` + '.xlsx'

  // save under export.xlsx
  const dest = path.resolve(__dirname, '..', '..', 'public', 'files', 'excel', fullFileName)
  await workbook.xlsx.writeFile(dest)

  console.log('File is written.')
  return dest
}

/**
 * Metrics:
 *  [ ok ] - Quantity of clients registered in current year sorted by month.
 *  [ ok ] - Quantity of clothes in stock and out of stock
 *  [ ok ] - Quantity of clients activated and deactivated
 *  [ ok ] - Quantity of shopping cart created in current month?
 *  [    ] - Which are the customers who buy the most?
 */

export class StatisticsController extends AbstractController
  implements IController, IStatisticsController {
  route: Router
  factory: any

  constructor({ route }: DTOController) {
    super()
    this.route = route
  }

  async init(): Promise<void> {
    this.route.get('/statistics', this.getStatistics)
    this.route.get('/statistics/clients-as-excel', this.getClientListAsExcel)
  }

  getClientListAsExcel = async (_: Request, res: Response): Promise<any> => {
    try {
      const clientRepo = getRepository(Client)
      const clientList = await clientRepo.find()
      const filePath = await worksheetFactory('Client list', clientList, 'clientList')
      return res.sendFile(filePath)
    } catch (error) {
      console.error(error.message)
      return res.status(401).json({ error_message: error.message })
    }
  }

  getStatistics = async (_: Request, res: Response): Promise<Response<StatisticsResponse>> => {
    const clothes_availability_quantity = await this.getQuantityInStockAndOutOfStockClothes()
    const number_of_shopping_carts_created_current_month = await this.getHowManyShoppingCartWhereCreatedInCurrentMonth()
    const quantity_of_clients_registered_in_current_month = await this.getQuantityOfClientsRegisteredInCurrentMonth()
    const shopping_cart_rank = await this.getShoppingCartRanking()
    const client_registered_current_year_by_month = await this.getQuantityOfClientRegisteredByMonth()
    const client_availability_quantity = await this.getQuantityActivatedDeactivatedClients()

    const response: StatisticsResponse = {
      data: {
        number_of_shopping_carts_created_current_month,
        clothes_availability_quantity,
        quantity_of_clients_registered_in_current_month,
        shopping_cart_rank,
        client_registered_current_year_by_month,
        client_availability_quantity
      }
    }

    return res.json(response)
  }

  async getShoppingCartRanking(): Promise<ShoppingCartValuable[]> {
    return [
      {
        shoppingCartId: 1,
        value: 18
      },
      {
        shoppingCartId: 2,
        value: 17
      },
      {
        shoppingCartId: 3,
        value: 16
      }
    ]
  }

  async getQuantityOfClientsRegisteredInCurrentMonth(): Promise<number> {
    const clientRepo = getRepository(Client)
    const clientList = await clientRepo.find()
    const currentDate = new Date()
    const currentMonthName = getMonthNameByNumber[currentDate.getMonth()]
    const currentYear = currentDate.getFullYear()

    let clientRegisteredCurrentMonth = 0
    clientList.forEach((o) => {
      const monthName = getMonthNameByNumber[o.createdAt.getMonth()]
      if (monthName === currentMonthName && o.createdAt.getFullYear() === currentYear) {
        ++clientRegisteredCurrentMonth
      }
    })
    return clientRegisteredCurrentMonth
  }

  async getQuantityInStockAndOutOfStockClothes(): Promise<ClothesAvailabilityMetrics[]> {
    const clothesRepo = getRepository(Clothes)
    const clothesStatusRepo = getRepository(ClothesStatus)

    const inStockStatus = await clothesStatusRepo.findOne({
      where: { name: ClothesStatusEnum.IN_STOCK }
    })
    const outOfStockStatus = await clothesStatusRepo.findOne({
      where: { name: ClothesStatusEnum.OUT_OF_STOCK }
    })

    const inStockCount = await clothesRepo.findAndCount({
      where: { status: inStockStatus },
      relations: ['status']
    })
    const outOfStockCount = await clothesRepo.findAndCount({
      where: { status: outOfStockStatus },
      relations: ['status']
    })

    return [
      {
        status: ClothesStatusEnum.IN_STOCK,
        quantity: inStockCount[1]
      },
      {
        status: ClothesStatusEnum.OUT_OF_STOCK,
        quantity: outOfStockCount[1]
      }
    ]
  }

  async getHowManyShoppingCartWhereCreatedInCurrentMonth(): Promise<number> {
    const shoppingCartRepo = getRepository(ShoppingCart)
    const shoppingCartList = await shoppingCartRepo.find()
    const currentDate = new Date()
    const currentMonthName = getMonthNameByNumber[currentDate.getMonth()]
    const currentYear = currentDate.getFullYear()

    let shoppingCartCreatedCurrentMonth = 0
    shoppingCartList.forEach((o) => {
      const monthName = getMonthNameByNumber[o.createdAt.getMonth()]
      if (monthName === currentMonthName && o.createdAt.getFullYear() === currentYear) {
        ++shoppingCartCreatedCurrentMonth
      }
    })
    return shoppingCartCreatedCurrentMonth
  }

  async getQuantityOfClientRegisteredByMonth(): Promise<{ label: string; data: Month[] }> {
    const QuantityClientsByMonth = [
      { name: MonthEnum.JAN, value: 0 },
      { name: MonthEnum.FEV, value: 0 },
      { name: MonthEnum.MAR, value: 0 },
      { name: MonthEnum.APR, value: 0 },
      { name: MonthEnum.MAY, value: 0 },
      { name: MonthEnum.JUN, value: 0 },
      { name: MonthEnum.JUL, value: 0 },
      { name: MonthEnum.AUG, value: 0 },
      { name: MonthEnum.SEP, value: 0 },
      { name: MonthEnum.OCT, value: 0 },
      { name: MonthEnum.NOV, value: 0 },
      { name: MonthEnum.DEC, value: 0 }
    ]
    const clientRepo = getRepository(Client)
    const currentYear = new Date().getFullYear()
    const currentYearClientList = (await clientRepo.find()).filter(
      (i) => i.createdAt.getFullYear() === currentYear
    )

    currentYearClientList.map((client) => {
      const monthName = getMonthNameByNumber[client.createdAt.getMonth()]
      this.increaseClientNumberInMonth(QuantityClientsByMonth, monthName)
    })

    return {
      label: 'Quantity of clients',
      data: QuantityClientsByMonth
    }
  }

  async getQuantityActivatedDeactivatedClients(): Promise<ClientAvailabilityMetrics[]> {
    const clientAvailabilityQuantity = [
      { status: EnumEmployeeClientStatus.ACTIVATED, quantity: 0 },
      { status: EnumEmployeeClientStatus.DEACTIVATED, quantity: 0 }
    ]

    const clientRepo = getRepository(Client)
    const currentYearClientList = (await clientRepo.find({ relations: ['status'] })).filter(
      this.filterCurrentYearClients
    )

    currentYearClientList.forEach((client) =>
      this.increaseClientAvailabilityNumber(clientAvailabilityQuantity, client)
    )
    return clientAvailabilityQuantity
  }

  private filterCurrentYearClients = (client: Client) => {
    const currentYear = new Date().getFullYear()
    return client.createdAt.getFullYear() === currentYear
  }

  private increaseClientAvailabilityNumber(
    quantityClientAvailability: ClientAvailabilityMetrics[],
    client: Client
  ): void {
    quantityClientAvailability.forEach((metrics) => {
      if (client.status.name === metrics.status.valueOf()) {
        ++metrics.quantity
      }
    })
  }

  private increaseClientNumberInMonth(QuantityClientsByMonth: Month[], month: string): void {
    const monthEnum = getMonthEnumByMonthName(month) as MonthEnum
    QuantityClientsByMonth.forEach((o) => {
      if (o.name === monthEnum) ++o.value
    })
  }
}
