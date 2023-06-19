require('dotenv').config()
Chance = require('chance');

class PierAPI {
    debug = true;
    chance = new Chance();
    
    headers(){
        var myHeaders = new Headers();
        myHeaders.append("access_token", process.env.PIER_ACCESS_TOKEN);
        myHeaders.append("Content-Type", "application/json");
        return myHeaders;
    }
    
    requestOptions(){
        return {
            method: 'GET',
            headers: {
                "access_token": process.env.PIER_ACCESS_TOKEN,
                "Content-Type": "application/json",
            },
            redirect: 'follow'
        };
    }

    requestOptions(body){
        return {
            method: 'POST',
            headers: {
                "access_token": process.env.PIER_ACCESS_TOKEN,
                "Content-Type": "application/json",
            },
            body: body,
            redirect: 'follow'
        };
    }
    
    async fetching(path, requestOptions){
        //console.log(`${process.env.PIER_API_URL}${path}`)
        //console.log(JSON.stringify(requestOptions));
        return await fetch(`${process.env.PIER_API_URL}${path}`, requestOptions)
        .then(r => {
            if(r.status !== 200){
                if(this.debug){
                    r.text().then(r => console.warn(r));
                }
                
                throw `a chamada ${path} nao retornou 2xx`
            }
            return r.json()
        })
        .catch(err => console.warn(`Erro ao chamar ${path} verifique os detalhes abaixo \n${err}`))
    }

    async getFaturas( payload = {idConta: id_conta, dataFatura: data_fatura }) {
        let params = new URLSearchParams({
            idconta: payload.idConta,
           
        })
        let path =  `/faturas/${payload.dataFatura}?${params}`
        return await this.fetching(path, this.requestOptions())
    }

    async postPessoas() {
              
        let params = new URLSearchParams({
            cpf: this.chance.cpf().replace(/\D/g,''),
            nome: this.chance.name(),
            dataNascimento: '1990-01-01',
            numeroIdentidade: Math.floor(Math.random() * 9999999),
            orgaoExpedidorIdentidade: 'SSP',
            unidadeFederativaIdentidade: 'SP',
            tipo: 'PF'
        })
        let path = `/pessoas?${params}`
        return await this.fetching(path, this.requestOptions(''))
    }

    async postPessoasDetalhes({IdPessoa: id_pessoa}) {
        
        let params = new URLSearchParams({
            idPessoa: id_pessoa,
            nomeMae: this.chance.name({ gender: 'female' }),
            idEstadoCivil: '',
            idProfissao: '',
            idNaturezaOcupacao: '',
            idNacionalidade: 1,
            numeroBanco: this.chance.integer({ min: 10000, max: 20000 }),
            numeroAgencia: this.chance.integer({ min: 1000, max: 9999 }),
            numeroContaCorrente: this.chance.integer({ min: 100000, max: 999999 }),
            email: this.chance.email({domain: "yopmail.com"}),
            salario: 10000,
            patrimonioTotal: 100000,
            impedidoFinanciamento: 'False',
            grauInstrucao: 0,
            numeroDependentes: 0,
            pessoaPoliticamenteExposta: 'False',
            flagNomePaiNaoInformado: 'False',
            flagSemEnderecoComercialFixo: 'False',
            nomeEmpresa: '',
            nomeReferencia1: '',
            enderecoReferencia1: '',
            nomeReferencia2: '',
            enderecoReferencia2: '',
            naturalidadeCidade: '',
            naturalidadeEstado: '',
            nomePai: '',
            chequeEspecial: '',
            numeroCnh: '',
            dataEmissaoCnh: '',
            nomeConjuge:'',
        })
        let path = `/pessoas-detalhes?${params}`
        return await this.fetching(path, this.requestOptions(''))
    }

    async postTelefones({IdPessoa: id_pessoa}) {
        
        let params = new URLSearchParams({
            idPessoa: id_pessoa,
            idTipoTelefone: 1,
            ddd: '21',
            telefone: this.chance.integer({ min: 981111111, max: 981119999 }),
            status: 1,
            ramal: 99,
            
        })
        let path = `/telefones?${params}`
        return await this.fetching(path, this.requestOptions(''))
    }

    async postEnderecos({IdPessoa: id_pessoa}) {
        
        let params = new URLSearchParams({
            idPessoa: id_pessoa,
            idTipoEndereco: 1,
            cep: this.chance.integer({ min: 19999999, max: 20000000 }),
            logradouro: this.chance.street(),
            numero: this.chance.integer({ min: 100, max: 2000 }),
            bairro: 'Jacarepagua',
            cidade: 'Rio de Janeiro',
            uf: 'RJ',
            pais: 'Brasil',
        })
        let path =  `/enderecos?${params}`
        return await this.fetching(path, this.requestOptions(''))

        
    }

    async postContas({ IdPessoa: id_pessoa, IdEndereco: id_endereco,  IdProduto: id_produto, IdOrigemComercial: id_origem_comercial=24}){
       
        let body = JSON.stringify({
            "idPessoa": `${id_pessoa}`,
            "idOrigemComercial": id_origem_comercial,
            "idProduto": id_produto,
            "diaVencimento": id_produto === 206 ? 25:19,
            "valorRenda": 10000,
            "idEnderecoCorrespondencia": `${id_endereco}`,
            "limiteGlobal": 10000,
            "limiteMaximo": 10000,
            "limiteParcelas": 10000,
            "limiteConsignado": 0,
            "flagFaturaPorEmail": 0,
            "idStatusConta": 0,
            "behaviorScore": 0,
            "valorPontuacao": 0,
            "funcaoAtiva": "DEBITOCREDITO"
        });

        let path =  '/contas'
        return await this.fetching(path, this.requestOptions(body))
    }

    async postDadosBancariosConta({ IdConta: id_conta}){
       

        let body = JSON.stringify({
            "idConta": id_conta,
            "numeroAgencia": '0017',
            "numeroContaCorrente": this.chance.integer({ min: 100000, max: 999999 }),
            "codigoBanco": 237,
            "idTipoContaBancaria": 1,
            "dvContaCorrente": "2",
            "dvAgencia": 2
          })
        

        let path =  '/dados-bancarios-conta'
        return await this.fetching(path, this.requestOptions(body))
    }

    async postGerarCartaoGrafica({IdConta: id_conta, IdPessoa: id_pessoa}){
        var body = JSON.stringify({
            "id_pessoa": id_pessoa
        });

        let path =  `/contas/${id_conta}/gerar-cartao-grafica`
        return await this.fetching(path, this.requestOptions(body))

    }

    async postAlterarSenhaCartao({IdCartao: id_cartao, senhaCartao: senha = 2233}){
        
        var body = JSON.stringify({
            "senha": senha
        })

        let path = `/cartoes/${id_cartao}/senhas`
        return await this.fetching(path, this.requestOptions(body))
    }

    async postAlterarEstagio({IdCartao: id_cartao, IdEstagio: id_estagio = 4}){
        var body = JSON.stringify({
            "id": id_estagio
        });
        let path =  `/cartoes/${id_cartao}/alterar-estagio`
        return await this.fetching(path, this.requestOptions(body))
    }

    async postDesbloquearCartao({IdCartao: id_cartao}){
        var body = '';
        let path =  `/cartoes/${id_cartao}/desbloquear`
        return await this.fetching(path, this.requestOptions(body))
    }

    async getConsultarDadosImpressao({IdCartao: id_cartao}){
        let path =  `/cartoes/${id_cartao}/consultar-dados-impressao`
        return await this.fetching(path, this.requestOptions())
    }

    async postEventosExternosCompras_Parceladas({IdConta: id_conta, IdCartao: id_cartao}){
        var body = JSON.stringify({
            "idEstabelecimento": 1,
            "idConta": id_conta,
            "idCartao": id_cartao,
            "dataCompra": new Date().addDays(-7).toISOString(),
            "idOperacao": 28, //parcelado sem juros
            "numeroParcelas": 10,
            "valorParcela": 100,
            "valorContrato": 1000,
            "valorCompra": 1000,
            "valorEncargosTotais": 0,
            "taxaJuros": 0,
            "valorIOF": 0,
            "valorTAC": 0,
            "origem": "TST",
            "carencia": 0,
            "nomeEstabelecimento": "TESTE",
            "valorPrimeiraParcela": 100
          })
        let path = '/eventos-externos-compras'
        return await this.fetching(path, this.requestOptions(body))
    }

    async postEventosExternosCompras_AVista({IdConta: id_conta, IdCartao: id_cartao}){
        
        var body = JSON.stringify({
            "idEstabelecimento": 1,
            "idConta": id_conta,
            "idCartao": id_cartao,
            "dataCompra": new Date().addDays(-7).toISOString(),
            "idOperacao": 270, //a vista sem juros
            "numeroParcelas": 1,
            "valorParcela": 1000.00,
            "valorContrato": 1000.00,
            "valorCompra": 1000.00,
            "valorEncargosTotais": 0,
            "taxaJuros": 0,
            "valorIOF": 0,
            "valorTAC": 0,
            "origem": "TST",
            "carencia": 0,
            "nomeEstabelecimento": "TESTE",
            "valorPrimeiraParcela": 0
          });
        
        let path = '/eventos-externos-compras';

        return await this.fetching(path, this.requestOptions(body))
    }
    
    
}
module.exports = PierAPI;