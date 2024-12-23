"use strict";
const { Model, Op } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Todo.belongsTo(models.User, {
        foreignKey: "userId",
      });
      // define association here
    }
    static addTodo({ title, dueDate, userId }) {
      return this.create({ title: title, dueDate: dueDate, completed: false, userId });
    }
    static async dueLaterList(userId) {
      const today = new Date().toISOString().split('T')[0];
      return this.findAll({
          where: {
              dueDate: { [Op.gt]: today 

              },
              userId,
              completed: false,
          },
      });
  }
  //
  static async dueTodayList(userId) {
      const today = new Date().toISOString().split('T')[0];
      return this.findAll({
          where: {
              dueDate: {
                [Op.eq]: today 

              },
              userId,
              completed: false,
           },  
      });
  }
  
  static async overdueList(userId) { // Adjusted capitalization
      const today = new Date().toISOString().split('T')[0];
      return this.findAll({
          where: {
              dueDate: { 
                [Op.lt]: today 
              },
              userId,
              completed: false,
          },
      });
  }
  
  
    static async completedList(userId){
      return this.findAll({
        where:{
          completed:true,
          userId, 
        },
      });
    }
    markAsCompleted(userId) {
      // Check if the todo belongs to the logged-in user
      if (this.userId !== userId) {
        throw new Error("You are not authorized to mark this todo as completed");
      }
      return this.update({ completed: true });
    }

    markAsUncompleted(userId) {
      // Check if the todo belongs to the logged-in user
      if (this.userId !== userId) {
        throw new Error("You are not authorized to mark this todo as completed");
      }
      console.log("Authorization successful, updating todo");
      return this.update({ completed: false });
    }
    
    static async remove(id,userId) {
      return this.destroy({
        where: {
          id,
          userId
        },
      });
    }

    static async getAllTodos(userId) {
      return await this.findAll({
        where: {
          userId,
        },
      });
    }
    
    
    async DeleteTodoById() {
      // Use this instance to delete
      await this.destroy();
      return { id: this.id, message: "Todo deleted successfully" };
    }
  }
  Todo.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false, 
        validate: {
            notNull: true,
            len:5,
        }
      },
      dueDate: DataTypes.DATEONLY,
      completed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Todo",
    }
  );
  return Todo;
};
