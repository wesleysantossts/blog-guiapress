const Sequelize = require("sequelize"), connection = require("../database/connection");

const Category = connection.define("categories", {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  slug: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

// Usado para sincronizar o banco de dados, recriando a tabela toda vez que a aplicação recarrega
// Article.sync({force: true})
Category.sync({force: false})

module.exports = Category;