'use strict';

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/user-profile',
      handler: 'user-profile.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/user-profile/:id',
      handler: 'user-profile.findOne',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/user-profile',
      handler: 'user-profile.create',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/user-profile/:id',
      handler: 'user-profile.update',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'DELETE',
      path: '/user-profile/:id',
      handler: 'user-profile.delete',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};