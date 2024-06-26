import chalk from 'chalk';
import cliProgress from 'cli-progress';
import { Product } from '@prisma/client';

import { prisma } from './libs/prisma';

const progress = new cliProgress.SingleBar(
	{
		format: 'progress [{bar}] {percentage}% | {value}/{total}',
		clearOnComplete: false,
	},
	cliProgress.Presets.shades_classic
);

function buscarProdutoBinario(nomeProduto: string, produtos: Product[]): Product | null {
	let esquerda = 0;
	let direita = produtos.length - 1;

	while (esquerda <= direita) {
		progress.increment();

		const meio = Math.floor((esquerda + direita) / 2);
		const produtoMeio = produtos[meio];

		if (produtoMeio.name === nomeProduto) {
			progress.stop();
			return produtoMeio;
		} else if (produtoMeio.name < nomeProduto) {
			esquerda = meio + 1;
		} else {
			direita = meio - 1;
		}
	}

	progress.stop();
	return null;
}

export async function buscaBinariaExecute(indice: number, produtos: Product[]) {
	console.log(chalk.gray(`Produto de índice ${indice} a ser procurado: \n`));
	const tempoInicioExecucao = Date.now();

	const produtoIndex = await prisma.product.findUnique({
		where: {
			id: indice,
		},
	});

	const nomeProduto = produtoIndex ? produtoIndex.name : '';

	console.log(chalk.yellow('Tamanho da lista a ser percorrida: ', produtos.length, '\n'));

	const produtoEncontrado = buscarProdutoBinario(nomeProduto, produtos);

	if (produtoEncontrado) {
		console.log('Produto encontrado:', produtoEncontrado.name);
		console.log('Posição:', produtoEncontrado.id, '\n');
	} else {
		console.log(chalk.red('Produto não encontrado \n'));
	}

	const tempoFinalExecucao = Date.now();

	const tempoTotalExecucao = (tempoFinalExecucao - tempoInicioExecucao) / 1000;

	console.log(chalk.green(`Tempo de execução: ${tempoTotalExecucao} s \n`));

	console.log('==================================================================== \n');
}
