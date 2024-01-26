const {Sequelize} = require('sequelize');
const sequelize = new Sequelize('shoe_nodejs','root','123456',
{
    host:'localhost',
    dialect:'mysql'
}
);
     sequelize.authenticate().then(()=>{
        console.log('Kết nối thành công.');
     });  
     module.exports ={sequelize};