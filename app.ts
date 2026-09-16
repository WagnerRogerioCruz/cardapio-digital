// 1. Modelagem do Produto
class Produto { // Declara a classe 'Produto', aplicando o conceito de Orientação a Objetos
    constructor( // Método construtor executado ao instanciar um novo produto
        public id: number, // Atributo público que armazena um identificador único numérico
        public nome: string, // Atributo público que armazena o nome do prato
        public descricao: string, // Atributo público que armazena os detalhes/ingredientes
        public preco: number, // Atributo público que armazena o valor do prato
        public imagem: string // Atributo público que armazena o link da foto do prato
    ) {} // Fim do construtor (o TypeScript cria e atribui as propriedades automaticamente)

    gerarHTML(): string { // Método da classe responsável por retornar a estrutura visual em HTML do objeto
        return `
            <div class="card"> <!-- Inicia a estrutura visual de um card -->
                <img src="${this.imagem}" alt="${this.nome}" class="card-img"> <!-- Insere a imagem usando o atributo do objeto -->
                <div class="card-content"> <!-- Container interno para os textos do card -->
                    <h3 class="card-title">${this.nome}</h3> <!-- Exibe o nome do produto -->
                    <p class="card-description">${this.descricao}</p> <!-- Exibe a descrição do produto -->
                    <div class="card-footer"> <!-- Rodapé interno do card -->
                        <span class="card-price">R$ ${this.preco.toFixed(2)}</span> <!-- Formata o preço com 2 casas decimais -->
                        <button class="card-btn" style="width: auto; padding: 8px 12px;">Pedir</button> <!-- Botão de ação de pedido -->
                    </div>
                </div>
            </div>
        `; // Retorna o bloco HTML completo preenchido com os dados deste objeto específico
    }
}

// 2. Gerenciamento do Cardápio e Persistência
class Cardapio { // Declara a classe 'Cardapio' para gerenciar a lista de produtos
    private produtos: Produto[] = []; // Array privado que armazena todos os objetos do tipo Produto na memória
    private storageKey = "cardapio_produtos"; // Chave de identificação usada para salvar os dados no LocalStorage do navegador

    constructor(private containerId: string) { // Construtor que recebe o ID do elemento HTML onde o cardápio será renderizado
        this.carregarDoStorage(); // Assim que o cardápio é criado, ele tenta carregar os produtos salvos anteriormente
    }

    adicionarProduto(produto: Produto): void { // Método para incluir um novo produto na lista
        this.produtos.push(produto); // Adiciona o novo produto ao final do array
        this.salvarNoStorage(); // Salva a lista atualizada no LocalStorage
        this.renderizar(); // Atualiza a tela exibindo o novo produto imediatamente
    }

    private salvarNoStorage(): void { // Método privado para persistir os dados no navegador
        localStorage.setItem(this.storageKey, JSON.stringify(this.produtos)); // Converte o array de objetos em texto JSON e salva no LocalStorage
    }

    private carregarDoStorage(): void { // Método privado para recuperar os dados salvos do navegador
        const dadosSalvos = localStorage.getItem(this.storageKey); // Busca o texto JSON salvo na chave correspondente

        if (dadosSalvos) { // Verifica se existem dados salvos anteriormente
            const objetosBrutos = JSON.parse(dadosSalvos); // Converte o texto JSON de volta para um formato de array comum
            this.produtos = objetosBrutos.map( // Mapeia os dados crus para recriar instâncias reais da classe Produto
                (p: any) => new Produto(p.id, p.nome, p.descricao, p.preco, p.imagem) // Instancia cada item como objeto Produto para manter os métodos ativos
            );
        } else { // Caso não haja nada salvo, cria produtos iniciais padrão
            this.produtos.push(new Produto(
                1,
                "Hambúrguer Artesanal",
                "Pão brioche, carne 180g, queijo cheddar derretido e molho especial.",
                35.90,
                "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80"
            ));
            this.produtos.push(new Produto(
                2,
                "Pizza Margherita",
                "Molho de tomate artesanal, muçarela de búfala, manjericão fresco e azeite.",
                48.00,
                "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=500&q=80"
            ));
            this.salvarNoStorage(); // Salva esses produtos iniciais no LocalStorage
        }
    }

    renderizar(): void { // Método responsável por desenhar os produtos na tela
        const container = document.getElementById(this.containerId); // Busca o elemento HTML container pelo ID informado no construtor
        if (!container) return; // Se o container não for encontrado, interrompe a execução

        container.innerHTML = ""; // Limpa todo o conteúdo anterior do container para evitar duplicações
        this.produtos.forEach(produto => { // Percorre cada produto armazenado no array
            container.innerHTML += produto.gerarHTML(); // Chama o método de cada produto e injeta seu HTML gerado dentro do container
        });
    }
}

// 3. Inicialização e Interação com o Formulário
window.addEventListener("DOMContentLoaded", () => { // Aguarda o documento HTML carregar totalmente antes de executar o script
    const meuCardapio = new Cardapio("menu-container"); // Instancia a classe Cardapio passando o ID do container HTML
    meuCardapio.renderizar(); // Renderiza os produtos iniciais na tela

    // Capturando o envio do formulário
    const form = document.getElementById("product-form") as HTMLFormElement; // Seleciona o elemento do formulário no HTML fazendo type casting
    
    form.addEventListener("submit", (event) => { // Adiciona um ouvinte para o evento de submit (quando o botão salvar é clicado)
        event.preventDefault(); // Evita que a página seja recarregada automaticamente pelo navegador

        // Obtendo valores dos inputs preenchidos pelo usuário
        const nomeInput = (document.getElementById("nome") as HTMLInputElement).value; // Pega o texto digitado no campo nome
        const precoInput = parseFloat((document.getElementById("preco") as HTMLInputElement).value); // Pega o valor do preço e converte para número decimal (float)
        const descInput = (document.getElementById("descricao") as HTMLTextAreaElement).value; // Pega o texto digitado na descrição
        const imgInput = (document.getElementById("imagem") as HTMLInputElement).value; // Pega o link digitado no campo de imagem

        // Gerando um ID único baseado no tempo atual em milissegundos
        const novoId = Date.now();

        // Criando a nova instância da classe Produto com os dados capturados
        const novoPrato = new Produto(novoId, nomeInput, descInput, precoInput, imgInput);

        // Adicionando ao cardápio (método que já salva no storage e atualiza a tela automaticamente)
        meuCardapio.adicionarProduto(novoPrato);

        // Limpando o formulário após o cadastro bem-sucedido
        form.reset();
    });
});