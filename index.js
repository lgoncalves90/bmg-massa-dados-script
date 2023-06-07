var PierAPI = require('./lib/pier_api');
var DatabaseService = require('./lib/database');

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}



async function criacaoDeContasSemLancamentos(idProduto=526){
    //console.log(`iniciando para idProduto ${idProduto}`)
    let pierApi = new PierAPI()
 
    let pessoa = await pierApi.postPessoas();  //PESSOA
    await  pierApi.postPessoasDetalhes({IdPessoa: pessoa.id});
    let pessoaEndereco = await pierApi.postEnderecos({IdPessoa: pessoa.id});
    let payloads = {IdPessoa: pessoa.id, IdEndereco: pessoaEndereco.id, IdProduto: idProduto};

    let conta = await pierApi.postContas(payloads);
    payloads = Object.assign(payloads, {IdConta: conta.id});
    await pierApi.postDadosBancariosConta(payloads);
    let cartao = await pierApi.postGerarCartaoGrafica(payloads);
    //console.log(JSON.stringify(cartao))
    payloads = Object.assign(payloads, {IdCartao: cartao.idCartao});

    await pierApi.postAlterarSenhaCartao(payloads);
    await pierApi.postAlterarEstagio(payloads)
    await pierApi.postDesbloquearCartao(payloads)
    return payloads;
}

async function criacaoDeContasComLancamentoParcelado(idProduto=526){
    let pierApi = new PierAPI();
    let database = new DatabaseService()
    
    let fullPayload = await criacaoDeContasSemLancamentos(idProduto);
    await pierApi.postEventosExternosCompras_Parceladas(fullPayload);
    //melhor comentar a linha abaixo e executar as procs manualmente, uma vez so, para todo o range de contas criadas ao final
    // await database.query(`exec SPR_PROCESSACOMPRAS2 '${new Date().addDays(-1).toISOString()}', null, ${fullPayload.IdConta}, ${fullPayload.IdConta};
    // exec SPR_PROCESSACOMPRAS_INSERETRANSACOES '${new Date().addDays(-1).toISOString()}', null, ${fullPayload.IdConta}, ${fullPayload.IdConta};`);

    return fullPayload;
}

async function criacaoDeContasComLancamentoAVista(idProduto=526){
    let pierApi = new PierAPI();
    let database = new DatabaseService()
    
    let fullPayload = await criacaoDeContasSemLancamentos(idProduto);
    await pierApi.postEventosExternosCompras_AVista(fullPayload);
    //melhor comentar a linha abaixo e executar as procs manualmente, uma vez so, para todo o range de contas criadas ao final
    // await database.query(`exec SPR_PROCESSACOMPRAS2 '${new Date().addDays(-1).toISOString()}', null, ${fullPayload.IdConta}, ${fullPayload.IdConta};
    // exec SPR_PROCESSACOMPRAS_INSERETRANSACOES '${new Date().addDays(-1).toISOString()}', null, ${fullPayload.IdConta}, ${fullPayload.IdConta};`);

    return fullPayload;
}

//Funcao que Cria 3 contas para cada produto; Conta sem lancamento, Conta com Lancamento Parcelado, Conta com lancamento a Vista
//para criar mais de uma, basta repetir as chamadas dentro do try
async function executarCriacaoDeContas(){
    let idsProduto = [
        526,200,574,206,534,563,548,527

    // 537,206,527,528,535,538,541, 565,205,
    // 534,537,540,
    // 548,558,559 ,
    // 526,536,539,542,549,561,552,553,554,
    // 557,556,565,
    // 560, 562, 563, 564, 566,
    // 569,570,621,622,623,624,625,626
]

    for(let idProduto of idsProduto){
        try{
            //await criacaoDeContasSemLancamentos(idProduto).then(r => console.log(JSON.stringify(r))).catch(err => console.log(err));

            //await criacaoDeContasComLancamentoParcelado(idProduto).then(r => console.log(`${r.IdConta}`));
           
            await criacaoDeContasComLancamentoAVista(idProduto).then(r => console.log(`${r.IdConta}`));
            //await criacaoDeContasComLancamentoAVista(idProduto).then(r => console.log(JSON.stringify(r)));
           
        }catch(err){
            console.log(err)
        }
    }
}


executarCriacaoDeContas().then(()=> console.log('ACABOU'));


