// Definición del modelo de la tabla Quiz
module.exports = function(sequelize, DataTypes){
  return sequelize.define('Quiz',{
    pregunta: {
      type: DataTypes.STRING,
      validate: {notEmpty: {msg: "-> Falta pregunta"}}
    },
    respuesta: {
      type: DataTypes.STRING,
      validate: {notEmpty: {msg: "-> Falta respuesta"}}
    },
    tema: DataTypes.ENUM(
      'Humanidades',
      'Ocio',
      'Ciencia',
      'Tecnología',
      'Otro')
  });
}
