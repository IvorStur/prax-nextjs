import { createDB } from '../../src/lib/db'

const fs = require('fs/promises')
const { faker } = require('@faker-js/faker')

async function f2() {
  console.log('Data gen')

  const data = []
  for (let i = 0; i <= 10; i++) {
    const name = faker.commerce.productName()
    const description = faker.commerce.productDescription()
    const price = faker.number.int({ min: 10, max: 10000 }) // 57

    data.push({ name: name, description: description, price: price })
  }
  var json = JSON.stringify(data, null, 4)

  await fs.writeFile('data2.json', json, 'utf8')
}

// f2()

async function seedDB() {
  console.log('Seeding database...')

  const data = []
  for (let i = 0; i <= 10; i++) {
    const name = faker.commerce.productName()
    const description = faker.commerce.productDescription()
    const price = faker.number.int({ min: 10, max: 10000 })

    data.push({ name: name, description: description, price: price })
  }
  // var json = JSON.stringify(data, null, 4)

  const db = createDB()

  await db.deleteFrom('products').execute()
  await db.deleteFrom('productsReviews').execute()

  const generatedProducts = await db.insertInto('products').values(data).returning('id').execute()

  const dataReview = []
  for (let product of generatedProducts) {
    const productId = product.id
    const rating = faker.number.int({ min: 1, max: 5 })
    const content = faker.lorem.lines()

    dataReview.push({ productId: productId, rating: rating, content: content })
  }

  await db.insertInto('productsReviews').values(dataReview).execute()

  console.log('Done')
}

seedDB()
