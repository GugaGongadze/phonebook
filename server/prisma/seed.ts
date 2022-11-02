import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

const contactData: Prisma.ContactCreateInput[] = [
  {
    firstName: 'Guga',
    lastName: 'Gongadze',
    phoneNumber: '+995555164612',
  },
]

async function main() {
  console.log(`Start seeding ...`)
  for (const u of contactData) {
    const user = await prisma.contact.create({
      data: u,
    })
    console.log(`Created user with id: ${user.id}`)
  }
  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
