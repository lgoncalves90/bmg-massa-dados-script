**Descricao**

Script criado para a demanda de geracao de massas do BMG Varejo / Digital

O script faz uso de alguns dos endpoints da API do PIER para criar pessoas, contas e eventos de compra.

Alem disso o script esta prepara para interagir com a base de dados permitindo chamadas de API e execucao de procedures ou Selects na base de dados.


**Pre-requisitos**:

Ter o arquivo `.env` configurado com os dados da api do PIER e base dados com as seguintes properties:

```
PIER_API_URL=''
PIER_ACCESS_TOKEN=''

DB_USERNAME = ''
DB_PASSWORD = '
DB_HOSTNAME = '10.75.30.132'
DB_NAME = 'BMG'

```

**Utilizacao**:

*Requisitos*: ter o `Node js` instalado

Execute `npm install` para baixar as dependencias.

em seguida, revise o arquivo `index.js`, certifique-se que a funcao executar...(...) esta sendo chamada, e execute o comando `node index.js` para executar o codigo.


**Dependencias**

    *chance*: biblioteca de dados randomicos de teste
    "dotenv": necessario para o uso do arquivo de configuracao `.env`
    "sequelize": Utilizado para interagir com a base de dados,
    "tedious": Utilizado para interagir com a base de dados,
