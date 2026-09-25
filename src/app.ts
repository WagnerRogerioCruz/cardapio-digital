import { Cardapio } from "./services/Cardapio.js";
import { Venda } from "./models/Venda.js";
import { Produto } from "./models/Produto.js";
import { Prato, Bebida, Lanche } from "./models/Especializacoes.js";

// --- 6. INTEGRAÇÃO E EVENTOS DA TELA ---
window.addEventListener("DOMContentLoaded", () => {
    const cardapio = new Cardapio();
    cardapio.renderizar();

    let vendaAtual = new Venda();

    const atualizarTelaVendas = () => {
        const totalVendaEl = document.getElementById("total-venda");
        const faturamentoEl = document.getElementById("faturamento-total");
        const itensVendaEl = document.getElementById("itens-venda");

        if (totalVendaEl) totalVendaEl.innerText = vendaAtual.total.toFixed(2);
        if (faturamentoEl) faturamentoEl.innerText = Venda.faturamentoTotal.toFixed(2);
        
        // Renderiza itens da comanda com botão para cancelar o item
        if (itensVendaEl) {
            itensVendaEl.innerHTML = vendaAtual.listaProdutos
                .map((p, index) => `
                    <li style="margin-bottom: 5px;">
                        ${p.nome} - R$ ${p.calcularPrecoFinal().toFixed(2)} 
                        <button class="remove-item-comanda-btn" data-index="${index}" style="margin-left: 10px; color: red; cursor: pointer;">[Remover]</button>
                    </li>
                `)
                .join("");
        }
    };

    // DELEGAÇÃO DE EVENTOS NO CARDÁPIO (Ações dos Cards)
    document.getElementById("menu-container")?.addEventListener("click", (e) => {
        const target = e.target as HTMLElement;

        // Ação 1: Adicionar à Venda/Comanda
        if (target.classList.contains("add-venda-btn")) {
            const id = Number(target.getAttribute("data-id"));
            const produtoEncontrado = cardapio.getLista().find(p => p.id === id);
            if (produtoEncontrado) {
                vendaAtual.adicionar(produtoEncontrado);
                atualizarTelaVendas();
            }
        }

        // Ação 2: Excluir do Cardápio (Visão do Dono)
        if (target.classList.contains("delete-cardapio-btn")) {
            const id = Number(target.getAttribute("data-id"));
            cardapio.removerProduto(id);
        }
    });

    // Remover item individual da Comanda Atual
    document.getElementById("itens-venda")?.addEventListener("click", (e) => {
        const target = e.target as HTMLElement;
        if (target.classList.contains("remove-item-comanda-btn")) {
            const index = Number(target.getAttribute("data-index"));
            vendaAtual.removerItem(index);
            atualizarTelaVendas();
        }
    });

    // Finalizar Venda
    document.getElementById("btn-finalizar-venda")?.addEventListener("click", () => {
        vendaAtual.finalizar();
        vendaAtual = new Venda();
        atualizarTelaVendas();
    });

    // Form de Cadastro pelo Dono
    const form = document.getElementById("product-form") as HTMLFormElement;
    form?.addEventListener("submit", (e) => {
        e.preventDefault();
        const nome = (document.getElementById("nome") as HTMLInputElement).value;
        const preco = parseFloat((document.getElementById("preco") as HTMLInputElement).value);
        const desc = (document.getElementById("descricao") as HTMLTextAreaElement).value;
        const img = (document.getElementById("imagem") as HTMLInputElement).value;
        const tipo = (document.getElementById("tipo-produto") as HTMLSelectElement).value;

        const novoId = Date.now();
        let novoProduto: Produto;

        if (tipo === "prato") {
            novoProduto = new Prato(novoId, nome, preco, desc, img);
        } else if (tipo === "bebida") {
            novoProduto = new Bebida(novoId, nome, preco, desc, img);
        } else {
            novoProduto = new Lanche(novoId, nome, preco, desc, img);
        }

        cardapio.adicionarProduto(novoProduto);
        form.reset();
    });
});