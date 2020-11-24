import cors from 'cors'
import express, { Response, Router, Request } from 'express'
import helmet from 'helmet'

import { ClientController } from './modules/client/ClientController'
import { DTOController } from './common/dto/DTOController'
import { IDb } from './common/database/IDb'
import { Db } from './common/database/Db'
import { EmployeeClientStatusController } from './modules/employee_client_status/EmployeeClientStatusController'
import { EmployeeController } from './modules/employee/EmployeeController'
import { EmployeeTitleController } from './modules/employee_title/EmployeeTitleController'
import { ShoppingCartStatusController } from './modules/shopping_cart_status/ShoppingCartStatusController'
import { ClothesStatusController } from './modules/clothes_status/ClothesStatusController'
import { ClothesController } from './modules/clothes/ClothesController'
import { ShoppingCartController } from './modules/shopping-cart/ShoppingCartController'
import { runSeeders } from './common/seeds/runSeeders'
import { AuthController } from './modules/auth/AuthController'
import logger from './common/logger/logger'
import APP_CONFIG from './config/app.config'
import { load } from 'yamljs'
import path from 'path'

import swaggerUi from 'swagger-ui-express'
import { StatisticsController } from './modules/statistics/StatisticsController'

export interface IApp {
  init(): Promise<void>
  start(): void
  initDatabase(): Promise<void>
  initMiddlewares(): void
}

export class App implements IApp {
  application: express.Application

  constructor() {
    this.application = express()
  }

  async init(): Promise<void> {
    this.initMiddlewares()
    await this.initDatabase()
    const route = Router()

    await this.initApiSummarize(route)
    await this.initSeeders(route)

    await this.initModule(ClientController, route)
    await this.initModule(ClothesController, route)
    await this.initModule(ClothesStatusController, route)
    await this.initModule(EmployeeController, route)
    await this.initModule(EmployeeClientStatusController, route)
    await this.initModule(EmployeeTitleController, route)
    await this.initModule(ShoppingCartStatusController, route)
    await this.initModule(ShoppingCartController, route)
    await this.initModule(AuthController, route)
    await this.initModule(StatisticsController, route)
  }

  async initSeeders(route: Router): Promise<void> {
    route.get('/run-seeders', async (_: Request, response: Response) => {
      try {
        runSeeders()
        return response.json({ message: 'Database seeded successfully' })
      } catch (error) {
        console.error(error.message)
        return response.json({ message: error.message })
      }
    })
  }

  async initApiSummarize(route: Router): Promise<void> {
    const swaggerDoc = load(path.resolve(__dirname, 'doc', 'swagger.yml'))
    swaggerDoc.servers = swaggerDoc.servers.map((host: { url: string; description: string }) => {
      host.url = host.url.replace(
        'HOST_ADDRESS_AND_PORT', // this should be in swagger.yml to be replaced
        `${APP_CONFIG.serve.host}:${APP_CONFIG.serve.port}`
      )
      return host
    })

    route.use('/apidoc', swaggerUi.serve, swaggerUi.setup(swaggerDoc))

    route.get('/', (_, response: Response) => {
      response.json({
        message: `Server is running on port ${APP_CONFIG.serve.port}`
      })
    })
  }

  async initModule(ControllerClassName: any, route: Router): Promise<void> {
    const controller = new ControllerClassName({
      route
    } as DTOController)
    await controller.init()
    this.application.use(route)
    logger.debug('Successfully loaded module ' + controller.constructor.name)
  }

  async initDatabase(): Promise<void> {
    const db: IDb = new Db()
    await db.init()
    logger.info('Successfully loaded Database')
  }

  initMiddlewares(): void {
    this.application.use(express.json())
    this.application.use(express.static(path.join(__dirname, 'public')))
    this.application.use(cors())
    this.application.use(helmet())
    logger.info('Successfully loaded Middlewares')
  }

  start(): void {
    this.application.listen(APP_CONFIG.serve.port, () => {
      logger.info(`-- Server running on port ${APP_CONFIG.serve.port} --`)
    })
  }
}
