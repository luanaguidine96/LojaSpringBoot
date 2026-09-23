
    fetch("/cafe/cliente")
            .then (response => response.json())
            .then(clientes => {
                
const divClientes = document.getElementById("Cliente");
   divClientes.innerHTML = "<h2>Clientes Ativos</h2>";             
        clientes.forEach(cliente => {
            
           divClientes.innerHTML += `
  <div class="Cliente">
            <h3>Nome: ${cliente.nome}</h3>
            <p >Saldo: R$ ${cliente.saldo}</p>
        </div>
`;
            
            
        });            
    });
