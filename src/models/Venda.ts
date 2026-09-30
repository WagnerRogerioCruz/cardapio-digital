import { Produto } from "./Produto.js";

// --- CLASSE VENDA ---

export class Venda {
    private readonly produtos: Produto[] = [];
    private fechada: boolean = false;
    
    // Inicializa carregando o valor salvo do localStorage (ou 0 se não houver nada)
    private static faturamentoTotalAcumulado: number = Venda.carregarFaturamento();

    // Getter estático para obter o faturamento
    static get faturamentoTotal(): number {
        return Venda.faturamentoTotalAcumulado;
    }

    // Lê o faturamento acumulado do localStorage
    private static carregarFaturamento(): number {
        const salvos = localStorage.getItem("faturamento_total");
        return salvos ? parseFloat(salvos) : 0;
    }

    // Salva o faturamento acumulado no localStorage
    private static salvarFaturamento(): void {
        localStorage.setItem("faturamento_total", Venda.faturamentoTotalAcumulado.toString());
    }

    adicionar(produto: Produto): void {
        if (!this.fechada) {
            this.produtos.push(produto);
        }
    }

    removerItem(index: number): void {
        if (!this.fechada && index >= 0 && index < this.produtos.length) {
            this.produtos.splice(index, 1);
        }
    }

    get total(): number {
        return this.produtos.reduce((soma, prod) => soma + prod.calcularPrecoFinal(), 0);
    }

    get listaProdutos(): readonly Produto[] {
        return this.produtos;
    }

    finalizar(): void {
        if (!this.fechada && this.produtos.length > 0) {
            Venda.faturamentoTotalAcumulado += this.total;
            Venda.salvarFaturamento(); // <-- Salva no localStorage ao finalizar a venda
            this.fechada = true;
        }
    }
}