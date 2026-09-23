/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.example.demo;

import com.example.demo.Entity.Cliente;
import com.example.demo.Entity.Produto;
import com.example.demo.Repository.ClienteRepository;
import com.example.demo.Repository.ProdutoRepository;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/cafe")
public class DemoController {
   private final ProdutoRepository prepository;
   private final ClienteRepository crepository;
   
   public DemoController(ProdutoRepository prepository,ClienteRepository crepository){
       this.prepository = prepository;
       this.crepository = crepository;
   }
   @PostMapping
   public ResponseEntity<Produto> criarP(@RequestBody Produto produto){
       Produto produtoSalvo = prepository.save(produto);
       return ResponseEntity.ok(produtoSalvo);
   }
   @PostMapping("/cliente")
   public ResponseEntity<Cliente> criarC(@RequestBody Cliente cliente){
       Cliente clienteSalvo = crepository.save(cliente);
       return ResponseEntity.ok(clienteSalvo);
   }
   
   
   @GetMapping
   public ResponseEntity <List<Produto>> listarP(){
      return ResponseEntity.ok(prepository.findAll());
   }
      @GetMapping("/cliente")
   public ResponseEntity <List<Cliente>> listarC(){
      return ResponseEntity.ok(crepository.findAll());
   }

   // Classe simples para receber o corpo da requisição de compra
   public static class CompraRequest {
       private Long clienteId;
       private Long produtoId;

       public Long getClienteId() {
           return clienteId;
       }

       public void setClienteId(Long clienteId) {
           this.clienteId = clienteId;
       }

       public Long getProdutoId() {
           return produtoId;
       }

       public void setProdutoId(Long produtoId) {
           this.produtoId = produtoId;
       }
   }

   @PostMapping("/comprar")
   public ResponseEntity<?> comprar(@RequestBody CompraRequest requisicao) {

       Optional<Cliente> clienteOpt = crepository.findById(requisicao.getClienteId());
       Optional<Produto> produtoOpt = prepository.findById(requisicao.getProdutoId());

       if (clienteOpt.isEmpty()) {
           return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Cliente não encontrado.");
       }
       if (produtoOpt.isEmpty()) {
           return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Produto não encontrado.");
       }

       Cliente cliente = clienteOpt.get();
       Produto produto = produtoOpt.get();

       if (produto.getUnidade() <= 0) {
           return ResponseEntity.status(HttpStatus.CONFLICT).body("Produto sem estoque.");
       }
       if (cliente.getSaldo() == null || cliente.getSaldo() < produto.getPreco()) {
           return ResponseEntity.status(HttpStatus.CONFLICT).body("Saldo insuficiente.");
       }

       // desconta de verdade e persiste no banco
       produto.setUnidade(produto.getUnidade() - 1);
       cliente.setSaldo(cliente.getSaldo() - produto.getPreco());

       Produto produtoAtualizado = prepository.save(produto);
       Cliente clienteAtualizado = crepository.save(cliente);

       Map<String, Object> resultado = new HashMap<>();
       resultado.put("cliente", clienteAtualizado);
       resultado.put("produto", produtoAtualizado);

       return ResponseEntity.ok(resultado);
   }
}