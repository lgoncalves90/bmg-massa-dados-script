require('dotenv').config()
const { Sequelize, QueryTypes } = require('sequelize');

class DatabaseService {

    async baseBMG() {
        return new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
            dialect: 'mssql',
            host: process.env.DB_HOSTNAME,
            port: 1433, 
            logging: false, 
            dialectOptions: {
                requestTimeout: 30000
            }
        })
    };
    
    async select(query){
        let baseBMG = await this.baseBMG()
        await baseBMG.authenticate()
        // .then(() => 
        //     console.log('conectado'))
        .catch(err => {
            console.log(`falha ao conectar, erro: ${err}`)
        });
    
        return await baseBMG.query(query, { type: QueryTypes.SELECT });
    }

    async query(query){
        let baseBMG = await this.baseBMG()
        await baseBMG.authenticate()
        // .then(() => 
        //     console.log('conectado'))
        .catch(err => {
            console.log(`falha ao conectar, erro: ${err}`)
        });
    
        return await baseBMG.query(query);
    }
    
}

module.exports = DatabaseService;
