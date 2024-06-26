import { prisma } from '../libs/prisma';

export async function listarProdutos(take?: number, skip?: number) {
	const produtos = await prisma.product.findMany({
		take,
		skip,
		orderBy: {
			id: 'asc',
		},
	});

	return produtos;
}
