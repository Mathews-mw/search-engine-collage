import chalk from 'chalk';

import { prisma } from './libs/prisma';
import { buscaHashExecute } from './busca-hashing';
import { buscaBinariaExecute } from './busca-binaria';
import { listarProdutos } from './utils/listar-produtos';
import { buscaArvoreBinariaExecute } from './busca-arvore-binaria';
import { ordenarListaDeProdutos } from './utils/ordernar-lista-produtos';

async function mainBinaria() {
	const produtos = await listarProdutos();

	const tempoInicioOrdenacao = Date.now();
	const listaProdutosOrdenados = ordenarListaDeProdutos(produtos);
	const tempoFinalOrdenacao = Date.now();

	const tempoTotalOrdenacao = (tempoFinalOrdenacao - tempoInicioOrdenacao) / 1000;

	console.log(chalk.green(`Tempo de ordenação: ${tempoTotalOrdenacao} s \n`));

	await buscaBinariaExecute(100, listaProdutosOrdenados);
	await buscaBinariaExecute(1000, listaProdutosOrdenados);
	await buscaBinariaExecute(10000, listaProdutosOrdenados);
	await buscaBinariaExecute(100000, listaProdutosOrdenados);
	await buscaBinariaExecute(1000000, listaProdutosOrdenados);
	await buscaBinariaExecute(2500000, listaProdutosOrdenados);
	await buscaBinariaExecute(4000000, listaProdutosOrdenados);
	await buscaBinariaExecute(5000000, listaProdutosOrdenados);
}

async function mainHash() {
	const produtos = await listarProdutos();

	await buscaHashExecute(100, produtos);
	await buscaHashExecute(1000, produtos);
	await buscaHashExecute(10000, produtos);
	await buscaHashExecute(100000, produtos);
	await buscaHashExecute(1000000, produtos);
	await buscaHashExecute(2500000, produtos);
	await buscaHashExecute(4000000, produtos);
	await buscaHashExecute(5000000, produtos);

	console.log(chalk.yellow('\n fim do processo de buscas'));
}

async function mainArvoreBinaria() {
	const listaProdutosA = await listarProdutos(9500);
	const listaProdutosB = await listarProdutos(9500, 9500);
	const listaProdutosC = await listarProdutos(9500, 99999);
	const listaProdutosD = await listarProdutos(9500, 999999);
	const listaProdutosE = await listarProdutos(9500, 2499999);
	const listaProdutosF = await listarProdutos(9500, 3999999);
	const listaProdutosG = await listarProdutos(9500, 4990500);

	await buscaArvoreBinariaExecute(100, listaProdutosA);
	await buscaArvoreBinariaExecute(1000, listaProdutosA);
	await buscaArvoreBinariaExecute(10000, listaProdutosB);
	await buscaArvoreBinariaExecute(100000, listaProdutosC);
	await buscaArvoreBinariaExecute(1000000, listaProdutosD);
	await buscaArvoreBinariaExecute(2500000, listaProdutosE);
	await buscaArvoreBinariaExecute(4000000, listaProdutosF);
	await buscaArvoreBinariaExecute(5000000, listaProdutosG);

	console.log(chalk.yellow('\n fim do processo de buscas'));
}

// mainBinaria()
// 	.then(async () => {
// 		await prisma.$disconnect();
// 	})
// 	.catch(async (error) => {
// 		console.log('error: ', error);
// 		await prisma.$disconnect;
// 		process.exit(1);
// 	});

// mainHash()
// 	.then(async () => {
// 		await prisma.$disconnect();
// 	})
// 	.catch(async (error) => {
// 		console.log('error: ', error);
// 		await prisma.$disconnect;
// 		process.exit(1);
// 	});

// mainArvoreBinaria()
// 	.then(async () => {
// 		await prisma.$disconnect();
// 	})
// 	.catch(async (error) => {
// 		console.log('error: ', error);
// 		await prisma.$disconnect;
// 		process.exit(1);
// 	});
