const criarclie = document.getElementById("formCliente");

criarclie.addEventListener("submit", function(event){

    event.preventDefault(); // impede que o formulário recarregue a página

    const nomi = document.getElementById("nomi").value;
    const senha = document.getElementById("senha").value;
    const saldo = Number(document.getElementById("saldo").value);


    const cliente = {
        nome: nomi,
        senha: senha,
        saldo: saldo
    };

    fetch("/cafe/cliente", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(cliente)
    })
    .then(response => {
        if (response.ok) {
            alert("Cadastro realizado com sucesso!");
            criarclie.reset();
            window.location.href = "login.html"; // leva o cliente para fazer login
        } else {
            alert("Não foi possível concluir o cadastro. Tente novamente.");
        }
    })
    .catch(erro => {
        console.error("Erro ao cadastrar cliente:", erro);
        alert("Não foi possível conectar ao servidor. Tente novamente mais tarde.");
    });
});