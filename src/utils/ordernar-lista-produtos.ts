import { Product } from '@prisma/client';

export function ordenarListaDeProdutos(produtos: Product[]): Product[] {
	produtos.sort((a, b) => a.name.localeCompare(b.name));

	return produtos;
}
