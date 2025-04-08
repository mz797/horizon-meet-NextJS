const {PrismaClient} = require("@prisma/client");
import {faker} from "@faker-js/faker/locale/en";


const prisma = new PrismaClient();

async function main() {
    console.log("Seeding database....");
    await prisma.user.create({
        data: {
            name: "Admin",
            email: "admin@admin.com",
            password: 'haslo123'
        }
    })

    const user = await prisma.user.findFirst();
    if (!user) return;

    const events = Array.from({length: 100}).map(() => ({
        title: faker.lorem.words(5),
        description: faker.lorem.paragraph(),
        date: faker.date.future(),
        image: '/images/event.jpg',
        organizerId: user.id,
    }));

    await prisma.event.createMany({data: events});
}

main()
    .catch((e) => {
        console.error("Error seeding database:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
