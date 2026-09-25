import { Cardapio } from "./services/Cardapio.js";
import { Venda } from "./models/Venda.js";
import { Prato, Bebida, Lanche } from "./models/Especializacoes.js";
// --- 6. INTEGRAÇÃO E EVENTOS DA TELA ---
window.addEventListener("DOMContentLoaded", () => {
    var _a, _b, _c;
    const cardapio = new Cardapio();
    cardapio.renderizar();
    let vendaAtual = new Venda();
    const atualizarTelaVendas = () => {
        const totalVendaEl = document.getElementById("total-venda");
        const faturamentoEl = document.getElementById("faturamento-total");
        const itensVendaEl = document.getElementById("itens-venda");
        if (totalVendaEl)
            totalVendaEl.innerText = vendaAtual.total.toFixed(2);
        if (faturamentoEl)
            faturamentoEl.innerText = Venda.faturamentoTotal.toFixed(2);
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
    (_a = document.getElementById("menu-container")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", (e) => {
        const target = e.target;
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
    (_b = document.getElementById("itens-venda")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", (e) => {
        const target = e.target;
        if (target.classList.contains("remove-item-comanda-btn")) {
            const index = Number(target.getAttribute("data-index"));
            vendaAtual.removerItem(index);
            atualizarTelaVendas();
        }
    });
    // Finalizar Venda
    (_c = document.getElementById("btn-finalizar-venda")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", () => {
        vendaAtual.finalizar();
        vendaAtual = new Venda();
        atualizarTelaVendas();
    });
    // Form de Cadastro pelo Dono
    const form = document.getElementById("product-form");
    form === null || form === void 0 ? void 0 : form.addEventListener("submit", (e) => {
        e.preventDefault();
        const nome = document.getElementById("nome").value;
        const preco = parseFloat(document.getElementById("preco").value);
        const desc = document.getElementById("descricao").value;
        const img = document.getElementById("imagem").value;
        const tipo = document.getElementById("tipo-produto").value;
        const novoId = Date.now();
        let novoProduto;
        if (tipo === "prato") {
            novoProduto = new Prato(novoId, nome, preco, desc, img);
        }
        else if (tipo === "bebida") {
            novoProduto = new Bebida(novoId, nome, preco, desc, img);
        }
        else {
            novoProduto = new Lanche(novoId, nome, preco, desc, img);
        }
        cardapio.adicionarProduto(novoProduto);
        form.reset();
    });
});
