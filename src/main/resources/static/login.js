const formLogin = document.getElementById("formLogin");

if (formLogin) {

    formLogin.addEventListener("submit", function(event) {

        event.preventDefault();

        const nome = document.getElementById("nomeLogin").value;
        const senha = document.getElementById("senhaLogin").value;

        fetch("/cafe/cliente")
            .then(response => response.json())
            .then(clientes => {
                const cliente = clientes.find(cliente =>
                    cliente.nome === nome && cliente.senha === senha
                );

                if (cliente) {
                    localStorage.setItem("clienteLogado", JSON.stringify(cliente));
                    alert(`Login realizado com sucesso! Bem-vindo(a), ${cliente.nome}.`);
                    window.location.href = "ProdutosPag.html"; // redireciona após o login
                } else {
                    alert("Nome ou senha incorretos. Tente novamente.");
                }
            })
            .catch(erro => {
                console.error("Erro ao fazer login:", erro);
                alert("Não foi possível conectar ao servidor. Tente novamente mais tarde.");
            });

    });

}