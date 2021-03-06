$(document).ready(function() {
    var id = localStorage.getItem("fornecedorId");
    
    //função q colocar os valores nos campos
    function valueInput(value,id) {
        $("#"+id).val(value)
    }
    
    $.ajax({
      url: "https://haskalpha-romefeller.c9users.io/fornecedor/"+id,
      method: "GET",
      success: function(json){
         var forn = json["Fornecedor"];
        valueInput(id,"cd");
        valueInput(forn["nome"],"razao");
        valueInput(forn["contato"],"nomeContato");
        valueInput(forn["telefone"],"tell");
        valueInput(forn["email"],"email");
        valueInput(forn["cnpj"],"cnpj");
        valueInput(forn["cep"],"cep");
        valueInput(forn["logradouro"],"logradouro");
        valueInput(forn["complemento"],"complemento");
        valueInput(forn["bairro"],"bairro");
        
        $.ajax({
          url: "https://haskalpha-romefeller.c9users.io/estado/",
          method: "GET",
          success: function(estados){
            estados["estados"].forEach(function(Element){
                var estado = new Option(Element["nome"], Element["id"], true, true);
                $("#estado").append(estado);
            });
            var int = parseInt(forn["estadoId"]);
            $("#estado").val(int);
        }});
        
        $.ajax({
          url: "https://haskalpha-romefeller.c9users.io/cidade/estado/"+forn["estadoId"],
          method: "GET",
          success: function(cidades){
            localStorage.setItem("cidades",JSON.stringify(cidades));
            cidades["cidade"].forEach(function(Element){
                var cidade = new Option(Element["nome"], Element["id"], true, true);
                $("#cidade").append(cidade);
            });
            var int = parseInt(forn["cidadeId"]);
            $("#cidade").val(int);
        }});
    }});
    
    function salvar(){
      var nome = $("#razao").val();
      var logradouro = $("#logradouro").val();
      var cep = $("#cep").val();
      var cnpj = $("#cnpj").val();
      var contato = $("#nomeContato").val();
      var telefone = $("#tell").val();
      var email = $("#email").val();
      var bairro = $("#bairro").val();
      var excluido = "false";
      var complemento = $("#complemento").val();
      var cidadeId = parseInt($("#cidade").val());
      var estadoId = parseInt($("#estado").val());
      
      var json = '{"nome":"'+nome+'",'
               + '"logradouro":"'+logradouro+'",'
               + '"cep":"'+cep+'",'
               + '"cnpj":"'+cnpj+'",'
               + '"contato":"'+contato+'",'
               + '"telefone":"'+telefone+'",'
               + '"email":"'+email+'",'
               + '"bairro":"'+bairro+'",'
               + '"excluido": false,'
               + '"complemento":"'+complemento+'",'
               + '"cidadeId":'+cidadeId+','
               + '"estadoId":'+estadoId+''
               + '}';
      console.log(json);
    
      $.ajax({
          url: "https://haskalpha-romefeller.c9users.io/fornecedor/"+$("#cd").val(),
          method: "PUT",
          data: json,
          success: function(result){
            $('#success').modal({show: 'true'}); 
          },
          error: function(result){
            $('#error').modal({show: 'false'})
          }
      });
    }
    
    $("#salvar").click(function() {
      salvar();
    });
    
    
    $("#estado").change(function(){
      $('#cidade').empty();
      $.ajax({
        url: "https://haskalpha-romefeller.c9users.io/cidade/estado/"+$("#estado").val(),
        method: "GET",
        success: function(cidades){
          cidades["cidade"].forEach(function(Element){
              var cidade = new Option(Element["nome"], Element["id"], true, true);
              $("#cidade").append(cidade);
          });
          var int = parseInt(cidades["cidade"][0]["id"]);
          $("#cidade").val(int);
      }});
    });
});