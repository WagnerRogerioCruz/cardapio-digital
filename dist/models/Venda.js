// --- CLASSE VENDA ---
export class Venda {
    constructor() {
        this.produtos = [];
        this.fechada = false;
    }
    // Getter estático para obter o faturamento
    static get faturamentoTotal() {
        return Venda.faturamentoTotalAcumulado;
    }
    // Lê o faturamento acumulado do localStorage
    static carregarFaturamento() {
        const salvos = localStorage.getItem("faturamento_total");
        return salvos ? parseFloat(salvos) : 0;
    }
    // Salva o faturamento acumulado no localStorage
    static salvarFaturamento() {
        localStorage.setItem("faturamento_total", Venda.faturamentoTotalAcumulado.toString());
    }
    adicionar(produto) {
        if (!this.fechada) {
            this.produtos.push(produto);
        }
    }
    removerItem(index) {
        if (!this.fechada && index >= 0 && index < this.produtos.length) {
            this.produtos.splice(index, 1);
        }
    }
    get total() {
        return this.produtos.reduce((soma, prod) => soma + prod.calcularPrecoFinal(), 0);
    }
    get listaProdutos() {
        return this.produtos;
    }
    finalizar() {
        if (!this.fechada && this.produtos.length > 0) {
            Venda.faturamentoTotalAcumulado += this.total;
            Venda.salvarFaturamento(); // <-- Salva no localStorage ao finalizar a venda
            this.fechada = true;
        }
    }
}
// Inicializa carregando o valor salvo do localStorage (ou 0 se não houver nada)
Venda.faturamentoTotalAcumulado = Venda.carregarFaturamento();
