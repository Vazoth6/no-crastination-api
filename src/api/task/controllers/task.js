'use strict';

module.exports = {
  async find(ctx) {
    try {
      console.log('📡 GET /api/task chamado');
      
      // Para teste, ignore a autenticação temporariamente
      const tasks = await strapi.entityService.findMany('api::task.task', {
        sort: { createdAt: 'desc' }
      });
      
      console.log(`✅ ${tasks.length} tarefas encontradas`);
      
      const data = tasks.map(task => ({
        id: task.id,
        attributes: {
          title: task.title || '',
          description: task.description || '',
          dueDate: task.dueDate,
          priority: task.priority || 'MEDIUM',
          completed: task.completed || false,
          completedAt: task.completedAt,
          createdAt: task.createdAt,
          updatedAt: task.updatedAt
        }
      }));
      
      return { data };
    } catch (error) {
      console.error('❌ Erro em find:', error.message, error.stack);
      return ctx.internalServerError(`Error: ${error.message}`);
    }
  },

  async findOne(ctx) {
    try {
      const { id } = ctx.params;
      console.log(`📡 GET /api/task/${id} chamado`);
      
      const task = await strapi.entityService.findOne('api::task.task', id);
      
      if (!task) {
        return ctx.notFound('Task not found');
      }
      
      return {
        data: {
          id: task.id,
          attributes: {
            title: task.title,
            description: task.description,
            dueDate: task.dueDate,
            priority: task.priority,
            completed: task.completed,
            completedAt: task.completedAt,
            createdAt: task.createdAt,
            updatedAt: task.updatedAt
          }
        }
      };
    } catch (error) {
      console.error('❌ Erro em findOne:', error);
      return ctx.internalServerError('Error fetching task');
    }
  },

  async create(ctx) {
    try {
      console.log('📡 POST /api/task chamado');
      const { data } = ctx.request.body;
      
      if (!data || !data.attributes) {
        return ctx.badRequest('Missing data.attributes');
      }
      
      const task = await strapi.entityService.create('api::task.task', {
        data: data.attributes
      });
      
      console.log(`✅ Tarefa criada: ${task.id} - ${task.title}`);
      
      return {
        data: {
          id: task.id,
          attributes: {
            title: task.title,
            description: task.description,
            dueDate: task.dueDate,
            priority: task.priority,
            completed: task.completed,
            completedAt: task.completedAt,
            createdAt: task.createdAt,
            updatedAt: task.updatedAt
          }
        }
      };
    } catch (error) {
      console.error('❌ Erro em create:', error);
      return ctx.internalServerError('Error creating task');
    }
  },

  async update(ctx) {
    try {
      const { id } = ctx.params;
      console.log(`📡 PUT /api/task/${id} chamado`);
      
      const { data } = ctx.request.body;
      
      if (!data || !data.attributes) {
        return ctx.badRequest('Missing data.attributes');
      }
      
      const updatedTask = await strapi.entityService.update('api::task.task', id, {
        data: data.attributes
      });
      
      return {
        data: {
          id: updatedTask.id,
          attributes: {
            title: updatedTask.title,
            description: updatedTask.description,
            dueDate: updatedTask.dueDate,
            priority: updatedTask.priority,
            completed: updatedTask.completed,
            completedAt: updatedTask.completedAt,
            createdAt: updatedTask.createdAt,
            updatedAt: updatedTask.updatedAt
          }
        }
      };
    } catch (error) {
      console.error('❌ Erro em update:', error);
      return ctx.internalServerError('Error updating task');
    }
  },

  async delete(ctx) {
    try {
      const { id } = ctx.params;
      console.log(`📡 DELETE /api/task/${id} chamado`);
      
      await strapi.entityService.delete('api::task.task', id);
      
      console.log(`✅ Tarefa ${id} deletada`);
      
      return { data: null };
    } catch (error) {
      console.error('❌ Erro em delete:', error);
      return ctx.internalServerError('Error deleting task');
    }
  }
};