import { faker } from '@faker-js/faker';
import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function makeProducts(): Prisma.ProductCreateInput {
	return {
		name: `${faker.commerce.product()} ${faker.commerce.productAdjective()} ${faker.commerce.productMaterial()} ${faker.string.hexadecimal({ length: 10, casing: 'upper' })}`,
		price: Number(faker.commerce.price({ max: 9999 })),
	};
}

const productsList = Array.from({ length: 5000000 }).map(() => {
	return makeProducts();
});

async function main() {
	console.log('Delete db registers...');

	await prisma.product.deleteMany();

	console.log('Start seeding...');

	await prisma.product.createMany({
		data: productsList,
	});

	console.log('Seeding Finished');
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (error) => {
		console.log('Db seede error: ', error);
		await prisma.$disconnect;
		process.exit(1);
	});
