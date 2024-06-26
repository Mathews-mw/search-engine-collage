import { Product } from '@prisma/client';

export function dividirLista(produtos: Product[]) {
	const arrayGrande: Product[] = produtos;
	const tamanhoArrayMenor: number = 10000; // Tamanho de cada array menor
	const arraysMenores: Product[][] = [];

	for (let i = 0; i < arrayGrande.length; i += tamanhoArrayMenor) {
		arraysMenores.push(arrayGrande.slice(i, i + tamanhoArrayMenor));
	}

	return arraysMenores;
}
