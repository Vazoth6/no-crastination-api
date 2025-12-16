'use strict';

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/pomodoro-session',
      handler: 'pomodoro-session.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/pomodoro-session/:id',
      handler: 'pomodoro-session.findOne',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/pomodoro-session',
      handler: 'pomodoro-session.create',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/pomodoro-session/:id',
      handler: 'pomodoro-session.update',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'DELETE',
      path: '/pomodoro-session/:id',
      handler: 'pomodoro-session.delete',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};