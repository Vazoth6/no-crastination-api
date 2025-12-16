const fs = require('fs-extra');
const path = require('path');

const contentTypes = {
  'task': {
    kind: 'collectionType',
    collectionName: 'tasks',
    info: {
      singularName: 'task',
      pluralName: 'tasks',
      displayName: 'Task',
      description: 'User tasks for productivity tracking',
    },
    options: {
      draftAndPublish: false,
    },
    pluginOptions: {
      'content-manager': {
        visible: true,
      },
      'content-type-builder': {
        visible: true,
      },
    },
    attributes: {
      title: {
        type: 'string',
        required: true,
        minLength: 3,
        maxLength: 255,
      },
      description: {
        type: 'text',
      },
      dueDate: {
        type: 'datetime',
      },
      priority: {
        type: 'enumeration',
        enum: ['HIGH', 'MEDIUM', 'LOW'],
        default: 'MEDIUM',
      },
      status: {
        type: 'enumeration',
        enum: ['TODO', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
        default: 'TODO',
      },
      category: {
        type: 'string',
        maxLength: 50,
      },
      estimatedMinutes: {
        type: 'integer',
        min: 0,
        default: 0,
      },
      actualMinutes: {
        type: 'integer',
        min: 0,
        default: 0,
      },
      completedAt: {
        type: 'datetime',
      },
      // SIMPLIFIED: Remove the relation for now, add later
      // user: {
      //   type: 'relation',
      //   relation: 'manyToOne',
      //   target: 'plugin::users-permissions.user',
      // },
    },
  },
  'pomodoro-session': {
    kind: 'collectionType',
    collectionName: 'pomodoro_sessions',
    info: {
      singularName: 'pomodoro-session',
      pluralName: 'pomodoro-sessions',
      displayName: 'Pomodoro Session',
      description: 'Pomodoro timer sessions',
    },
    attributes: {
      sessionType: {
        type: 'enumeration',
        enum: ['WORK', 'SHORT_BREAK', 'LONG_BREAK'],
        default: 'WORK',
      },
      startTime: {
        type: 'datetime',
        required: true,
      },
      endTime: {
        type: 'datetime',
      },
      durationMinutes: {
        type: 'integer',
        default: 25,
        min: 1,
        max: 60,
      },
      interruptions: {
        type: 'integer',
        default: 0,
        min: 0,
      },
      completed: {
        type: 'boolean',
        default: true,
      },
      notes: {
        type: 'text',
      },
      // SIMPLIFIED: Remove relations for now
      // user: {
      //   type: 'relation',
      //   relation: 'manyToOne',
      //   target: 'plugin::users-permissions.user',
      // },
      // task: {
      //   type: 'relation',
      //   relation: 'manyToOne',
      //   target: 'api::task.task',
      // },
    },
  },
  'daily-stat': {
    kind: 'collectionType',
    collectionName: 'daily_stats',
    info: {
      singularName: 'daily-stat',
      pluralName: 'daily-stats',
      displayName: 'Daily Stat',
      description: 'Daily productivity statistics',
    },
    attributes: {
      date: {
        type: 'date',
        required: true,
      },
      tasksCompleted: {
        type: 'integer',
        default: 0,
        min: 0,
      },
      tasksCreated: {
        type: 'integer',
        default: 0,
        min: 0,
      },
      totalPomodoroSessions: {
        type: 'integer',
        default: 0,
        min: 0,
      },
      totalWorkMinutes: {
        type: 'integer',
        default: 0,
        min: 0,
      },
      totalBreakMinutes: {
        type: 'integer',
        default: 0,
        min: 0,
      },
      productivityScore: {
        type: 'decimal',
        default: 0.0,
        min: 0.0,
        max: 100.0,
      },
      // SIMPLIFIED: Remove relation for now
      // user: {
      //   type: 'relation',
      //   relation: 'manyToOne',
      //   target: 'plugin::users-permissions.user',
      // },
    },
  },
  'user-profile': {
    kind: 'collectionType',
    collectionName: 'user_profiles',
    info: {
      singularName: 'user-profile',
      pluralName: 'user-profiles',
      displayName: 'User Profile',
      description: 'Extended user profile information',
    },
    attributes: {
      fullName: {
        type: 'string',
        maxLength: 100,
      },
      bio: {
        type: 'text',
      },
      avatar: {
        type: 'media',
        allowedTypes: ['images'],
        multiple: false,
      },
      timezone: {
        type: 'string',
        default: 'Europe/Lisbon',
      },
      dailyGoalMinutes: {
        type: 'integer',
        default: 240,
        min: 30,
        max: 720,
      },
      pomodoroWorkDuration: {
        type: 'integer',
        default: 25,
        min: 5,
        max: 60,
      },
      pomodoroShortBreak: {
        type: 'integer',
        default: 5,
        min: 1,
        max: 15,
      },
      pomodoroLongBreak: {
        type: 'integer',
        default: 15,
        min: 10,
        max: 30,
      },
      // SIMPLIFIED: Remove relation for now
      // user: {
      //   type: 'relation',
      //   relation: 'oneToOne',
      //   target: 'plugin::users-permissions.user',
      // },
    },
  },
};

// Clear existing API directory
const apiPath = path.join(__dirname, '..', 'src', 'api');
if (fs.existsSync(apiPath)) {
  console.log('🗑️  Removing existing API directory...');
  fs.removeSync(apiPath);
}

// Create content type directories and files
Object.entries(contentTypes).forEach(([name, schema]) => {
  const apiPath = path.join(__dirname, '..', 'src', 'api', name);
  const schemaPath = path.join(apiPath, 'content-types', name, 'schema.json');
  
  // Create directories
  fs.ensureDirSync(path.dirname(schemaPath));
  
  // Write schema file
  fs.writeJsonSync(schemaPath, schema, { spaces: 2 });
  
  // Create minimal controller
  const controllerContent = `'use strict';

module.exports = {
  async find(ctx) {
    return await super.find(ctx);
  },

  async findOne(ctx) {
    return await super.findOne(ctx);
  },

  async create(ctx) {
    return await super.create(ctx);
  },

  async update(ctx) {
    return await super.update(ctx);
  },

  async delete(ctx) {
    return await super.delete(ctx);
  }
};`;
  
  const controllerPath = path.join(apiPath, 'controllers', `${name}.js`);
  fs.ensureDirSync(path.dirname(controllerPath));
  fs.writeFileSync(controllerPath, controllerContent);
  
  // Create service file
  const serviceContent = `'use strict';

module.exports = ({ strapi }) => ({});`;
  
  const servicePath = path.join(apiPath, 'services', `${name}.js`);
  fs.ensureDirSync(path.dirname(servicePath));
  fs.writeFileSync(servicePath, serviceContent);
  
  // Create routes file
  const routesContent = `'use strict';

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/${name}',
      handler: '${name}.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/${name}/:id',
      handler: '${name}.findOne',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/${name}',
      handler: '${name}.create',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/${name}/:id',
      handler: '${name}.update',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'DELETE',
      path: '/${name}/:id',
      handler: '${name}.delete',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};`;
  
  const routesPath = path.join(apiPath, 'routes', `${name}.js`);
  fs.ensureDirSync(path.dirname(routesPath));
  fs.writeFileSync(routesPath, routesContent);
  
  console.log(`✅ Created ${name} content type`);
});

console.log('🎉 All content types created!');
console.log('\n📋 Next steps:');
console.log('   1. Run: npm run develop');
console.log('   2. Visit http://localhost:1337/admin');
console.log('   3. Create admin user');
console.log('   4. In Content-Type Builder, manually add the user relations');
console.log('   5. Then run: node scripts/seed.js');