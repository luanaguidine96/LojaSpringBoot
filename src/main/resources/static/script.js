const criarprod = document.getElementById("formProduto");
if(criarprod){
    
criarprod.addEventListener("submit", function(event){
    
    const nome = document.getElementById("nome").value;
    const preco = Number(document.getElementById("preco").value);
    const estoque = Number(document.getElementById("estoque").value);
    

    const produto = {
        nome: nome,
        preco: preco,
        unidade: estoque
        };
        
fetch("/cafe", { 
    method: "POST", 
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(produto) 
        });
});
}




const divProdutos = document.getElementById("produtos");
if (divProdutos) {
fetch("/cafe")
    .then(response => response.json()) //servidor transforma json em uma resposta
    //response é a resposta
    //o segundo .then recebe a resposta do primeiro 
    //response.json é assincrono, nao pode receber diretamente as respostas
    .then(produtos => {
        

divProdutos.innerHTML = "<h2>Produtos</h2>";
//propiedade para alterar o conteúdo HTML
//aqui estou pondo esse h2 na div

produtos.forEach(produto => { //para cada produto aplique
//+= representa acrescente na div isso do proximo produto
    divProdutos.innerHTML += ` 
        <div class="produto">
            <h3>${produto.nome}</h3>
            <p>Preço: R$ ${produto.preco}</p>
            <p class="estoque">Estoque: ${produto.unidade}</p>
        <button type="button" class="comprar">Comprar</button>
        </div>
    `;

});
    const clienteLogado = JSON.parse(localStorage.getItem("clienteLogado"));

    const saldoCliente = document.getElementById("saldoCliente");

    if (clienteLogado && saldoCliente) {
        saldoCliente.textContent = `Saldo: R$ ${clienteLogado.saldo}`;
    }

const botoesComprar = document.querySelectorAll(".comprar");
//pega td botao com classe comprar
const estoques = document.querySelectorAll(".estoque");

//pega tds os estoques
botoesComprar.forEach((botao, index) => {

botao.addEventListener("click", function() {

    const produto = produtos[index];

    if (!clienteLogado) {
        alert("Faça login antes de comprar.");
        return;
    }

    // manda o servidor validar e descontar de verdade no banco
    fetch("/cafe/comprar", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            clienteId: clienteLogado.id,
            produtoId: produto.id
        })
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(mensagem => {
                throw new Error(mensagem || "Não foi possível concluir a compra.");
            });
        }
        return response.json();
    })
    .then(resultado => {
        // usa os valores atualizados que vieram do banco, não cálculo local
        produto.unidade = resultado.produto.unidade;
        estoques[index].textContent = `Estoque: ${produto.unidade}`;

        localStorage.setItem("clienteLogado", JSON.stringify(resultado.cliente));
        if (saldoCliente) {
            saldoCliente.textContent = `Saldo: R$ ${resultado.cliente.saldo}`;
        }

        alert("Compra realizada com sucesso!");
    })
    .catch(erro => {
        console.error("Erro ao comprar:", erro);
        alert(erro.message);
    });
});
});
});

}