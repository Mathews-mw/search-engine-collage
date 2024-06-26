import { Product } from '@prisma/client';
import { prisma } from './libs/prisma';
import chalk from 'chalk';

class TabelaHash {
	private tabela: Map<number, Product>;
	private tamanhoTabela: number;

	constructor(tamanhoTabela: number) {
		this.tabela = new Map<number, Product>();
		this.tamanhoTabela = tamanhoTabela;
	}

	private funcaoHash(nomeProduto: string): number {
		let hash = 0;
		for (let i = 0; i < nomeProduto.length; i++) {
			hash = hash * 31 + nomeProduto.charCodeAt(i);
		}
		return hash % this.tamanhoTabela;
	}

	public inserir(produto: Product): void {
		const indice = this.funcaoHash(produto.name);
		this.tabela.set(produto.id, produto);
	}

	public buscar(nomeProduto: string): Product | null {
		const indice = this.funcaoHash(nomeProduto);

		const produto = this.tabela.get(indice);

		if (!produto) {
			return null;
		}

		return produto;
	}
}

// Funções gerarNomeAleatorio e gerarPrecoAleatorio iguais ao código anterior

export async function buscaHashExecute(indice: number, produtos: Product[]) {
	console.log(chalk.gray(`Produto de índice ${indice} a ser procurado: \n`));
	const tempoInicioExecucao = Date.now();

	const produtoIndex = await prisma.product.findUnique({
		where: {
			id: indice,
		},
	});

	const nomeProduto = produtoIndex ? produtoIndex.name : '';

	const tamanhoTabela = 1000000; // Tamanho da tabela hash (aproximadamente a raiz quadrada da quantidade de produtos)
	const tabelaHash = new TabelaHash(tamanhoTabela);

	// Insere todos os produtos na tabela hash
	for (const produto of produtos) {
		tabelaHash.inserir(produto);
	}

	const produtoEncontrado = tabelaHash.buscar(nomeProduto);

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
