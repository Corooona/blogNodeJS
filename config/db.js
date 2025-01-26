const {MongoClient} = require('mongodb');

// Uri de conexion a mongodb
const uri = 'mongodb://localhost:27017';

// Creacion de cliente usando el uri
const client = new MongoClient(uri);

let db;

async function connect() {
    try{
        await client.connect();
        db=client.db('blogPersonal');
        console.log('Conexion exitosa a MongoDB');
    }catch(err){
        console.log('Error de conexion', err);
    }
}

let getDb=()=>{
    if(!db){
        throw new Error('No se establecido la conexion a la base de datos');
    }
    return db;
}

module.exports={
    connect,
    getDb
}