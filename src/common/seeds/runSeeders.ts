import { SeedRunner } from './SeedRunner'
import { ClothesStatusSeeder } from './ClothesStatusSeeder'
import { EmployeeClientStatusSeeder } from './EmployeeClientStatusSeeder'
import { ShoppingCartStatusSeeder } from './ShoppingCartStatusSeeder'
import { EmployeeTitleSeeder } from './EmployeeTitleSeeder'
import { ClientSeeder } from './ClientSeeder'
import { EmployeeSeeder } from './EmployeeSeeder'
import { ClothesSeeder } from './ClothesSeeder'
import { ShoppingCartSeeder } from './ShoppingCartSeeder'

export async function runSeeders(): Promise<void> {
  const seedRunner = new SeedRunner()

  const clothesStatusSeeder = new ClothesStatusSeeder()
  const employeeClientStatusSeeder = new EmployeeClientStatusSeeder()
  const shoppingCartStatusSeeder = new ShoppingCartStatusSeeder()
  const employeeTitleSeeder = new EmployeeTitleSeeder()
  const clientSeeder = new ClientSeeder()
  const employeeSeeder = new EmployeeSeeder()
  const clothesSeeder = new ClothesSeeder()
  const shoppingCartSeeder = new ShoppingCartSeeder()

  seedRunner.addSedder(clothesStatusSeeder)
  seedRunner.addSedder(employeeClientStatusSeeder)
  seedRunner.addSedder(shoppingCartStatusSeeder)
  seedRunner.addSedder(employeeTitleSeeder)
  seedRunner.addSedder(clientSeeder)
  seedRunner.addSedder(employeeSeeder)
  seedRunner.addSedder(clothesSeeder)
  seedRunner.addSedder(shoppingCartSeeder)

  let count = 0
  while (count < 5) {
    const p = new Promise((resolve) => {
      setTimeout(() => {
        resolve(seedRunner.start())
      }, 2000)
    })
    await p

    count++
  }
}
