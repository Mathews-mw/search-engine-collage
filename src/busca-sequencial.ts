import chalk from 'chalk';
import cliProgress from 'cli-progress';
import { PrismaClient, Product } from '@prisma/client';

const prisma = new PrismaClient();

const progress = new cliProgress.SingleBar(
	{
		format: 'progress [{bar}] {percentage}% | {value}/{total} | {duration}s',
		clearOnComplete: false,
	},
	cliProgress.Presets.shades_classic
);

async function listarProdutos() {
	const produtos = await prisma.product.findMany();

	return produtos;
}

function buscarProdutoSequencial(nomeProduto: string, produtos: Product[]): Product | null {
	progress.start(produtos.length, 0);

	for (const produto of produtos) {
		progress.increment();

		if (produto.name === nomeProduto) {
			progress.stop();
			return produto;
		}
	}

	progress.stop();

	return null;
}

async function main() {
	const listaTodosProdutos = await listarProdutos();

	const produtoIndex100 = await prisma.product.findUnique({
		where: {
			id: 1000000,
		},
	}); // O produto que será buscar se encontra no índice 100 da tabela no banco de dados

	const nomeProduto = produtoIndex100 ? produtoIndex100.name : ''; // Nome do produto a ser buscado

	console.log(chalk.yellow('Tamanho da lista a ser percorrida: ', listaTodosProdutos.length, '\n'));

	const tempoInicioExecucao = Date.now();
	const produtoEncontrado = buscarProdutoSequencial(nomeProduto, listaTodosProdutos);
	const tempoFinalExecucao = Date.now();

	if (produtoEncontrado) {
		console.log('Produto encontrado:', produtoEncontrado, '\n');
	} else {
		console.log(chalk.red('Produto não encontrado \n'));
	}

	const tempoTotalExecucao = (tempoFinalExecucao - tempoInicioExecucao) / 1000;

	console.log(chalk.green(`Tempo de execução: ${tempoTotalExecucao} s`));
	progress.stop();
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (error) => {
		console.log('error: ', error);
		await prisma.$disconnect;
		process.exit(1);
	});
