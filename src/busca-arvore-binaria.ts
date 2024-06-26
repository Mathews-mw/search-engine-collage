/* eslint-disable no-use-before-define */

import { Product } from '@prisma/client';
import chalk from 'chalk';
import { prisma } from './libs/prisma';

class No {
	valor: number;
	esquerdo: No | null;
	direito: No | null;

	constructor(valor: number) {
		this.valor = valor;
		this.esquerdo = null;
		this.direito = null;
	}
}

export class ArvoreBinaria {
	private raiz: No | null;

	constructor() {
		this.raiz = null;
	}

	inserir(valor: number): void {
		const novoNo = new No(valor);
		this.raiz = this.inserirRecursivo(this.raiz, novoNo);
	}

	private inserirRecursivo(raizAtual: No | null, novoNo: No): No {
		if (raizAtual === null) {
			return novoNo;
		} else if (novoNo.valor < raizAtual.valor) {
			raizAtual.esquerdo = this.inserirRecursivo(raizAtual.esquerdo, novoNo);
			return raizAtual;
		} else {
			raizAtual.direito = this.inserirRecursivo(raizAtual.direito, novoNo);
			return raizAtual;
		}
	}

	buscar(valor: number): No | null {
		return this.buscarRecursivo(this.raiz, valor);
	}

	private buscarRecursivo(raizAtual: No | null, valor: number): No | null {
		if (raizAtual === null) {
			return null;
		} else if (raizAtual.valor === valor) {
			return raizAtual;
		} else if (valor < raizAtual.valor) {
			return this.buscarRecursivo(raizAtual.esquerdo, valor);
		} else {
			return this.buscarRecursivo(raizAtual.direito, valor);
		}
	}
}

export async function buscaArvoreBinariaExecute(indice: number, produtos: Product[]): Promise<number> {
	console.log(chalk.gray(`Produto de índice ${indice} a ser procurado: \n`));

	const tempoInicioExecucao = Date.now();

	const produtoIndex = await prisma.product.findUnique({
		where: {
			id: indice,
		},
	});

	const nomeProduto = produtoIndex ? produtoIndex.id : 0;

	const arvoreBinaria = new ArvoreBinaria();

	// Insere todos os produtos na árvore binária
	for (const produto of produtos) {
		arvoreBinaria.inserir(produto.id);
	}

	const produtoEncontrado = arvoreBinaria.buscar(nomeProduto);

	if (produtoEncontrado) {
		console.log('node: ', produtoEncontrado);
		console.log('Produto encontrado:', produtoIndex?.name);
		console.log('Posição:', produtoIndex?.id, '\n');
	} else {
		console.log(chalk.red('Produto não encontrado \n'));
		return 1;
	}

	const tempoFinalExecucao = Date.now();
	const tempoTotalExecucao = (tempoFinalExecucao - tempoInicioExecucao) / 1000;

	console.log(chalk.green(`Tempo de execução: ${tempoTotalExecucao} s \n`));

	console.log('==================================================================== \n');
	return 0;
}
