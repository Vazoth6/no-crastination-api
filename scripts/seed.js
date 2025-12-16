const { faker } = require('@faker-js/faker/locale/pt_PT');
const bcrypt = require('bcryptjs');

module.exports = async ({ strapi }) => {
  console.log('🌱 Seeding database with realistic data...');

  // Create users
  const users = [];
  for (let i = 1; i <= 5; i++) {
    const email = `user${i}@nocrastination.com`;
    const username = `user${i}`;
    const password = await bcrypt.hash('Password123!', 10);
    
    const user = await strapi.plugins['users-permissions'].services.user.add({
      username,
      email,
      password,
      confirmed: true,
      blocked: false,
      role: 1, // Authenticated role
    });

    // Create user profile
    await strapi.entityService.create('api::user-profile.user-profile', {
      data: {
        fullName: faker.person.fullName(),
        bio: faker.lorem.paragraph(),
        timezone: 'Europe/Lisbon',
        dailyGoalMinutes: faker.number.int({ min: 180, max: 480 }),
        pomodoroWorkDuration: faker.helpers.arrayElement([25, 30, 45]),
        pomodoroShortBreak: faker.helpers.arrayElement([5, 10]),
        pomodoroLongBreak: faker.helpers.arrayElement([15, 20, 30]),
        user: user.id,
      },
    });

    users.push(user);
    console.log(`✅ Created user: ${email}`);
  }

  // Create tasks for each user
  for (const user of users) {
    const taskCount = faker.number.int({ min: 5, max: 15 });
    
    for (let i = 0; i < taskCount; i++) {
      const dueDate = faker.date.between({
        from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        to: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      });

      const status = faker.helpers.arrayElement(['TODO', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']);
      const completedAt = status === 'COMPLETED' 
        ? faker.date.between({
            from: new Date(dueDate.getTime() - 2 * 24 * 60 * 60 * 1000),
            to: new Date(),
          })
        : null;

      const task = await strapi.entityService.create('api::task.task', {
        data: {
          title: faker.lorem.sentence({ min: 3, max: 8 }),
          description: faker.lorem.paragraphs({ min: 1, max: 3 }),
          dueDate: dueDate.toISOString(),
          priority: faker.helpers.arrayElement(['HIGH', 'MEDIUM', 'LOW']),
          status,
          category: faker.helpers.arrayElement(['Trabalho', 'Estudo', 'Pessoal', 'Saúde', 'Casa']),
          estimatedMinutes: faker.number.int({ min: 15, max: 240 }),
          actualMinutes: status === 'COMPLETED' ? faker.number.int({ min: 15, max: 300 }) : 0,
          completedAt: completedAt ? completedAt.toISOString() : null,
          user: user.id,
        },
      });

      // Create pomodoro sessions for completed tasks
      if (status === 'COMPLETED') {
        const sessionCount = faker.number.int({ min: 1, max: 4 });
        
        for (let j = 0; j < sessionCount; j++) {
          const startTime = faker.date.between({
            from: new Date(completedAt.getTime() - 24 * 60 * 60 * 1000),
            to: completedAt,
          });

          await strapi.entityService.create('api::pomodoro-session.pomodoro-session', {
            data: {
              sessionType: 'WORK',
              startTime: startTime.toISOString(),
              endTime: new Date(startTime.getTime() + 25 * 60 * 1000).toISOString(),
              durationMinutes: 25,
              interruptions: faker.number.int({ min: 0, max: 3 }),
              completed: true,
              notes: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.3 }),
              user: user.id,
              task: task.id,
            },
          });
        }
      }
    }
    console.log(`✅ Created ${taskCount} tasks for ${user.email}`);
  }

  // Generate daily stats
  for (const user of users) {
    for (let daysAgo = 0; daysAgo < 30; daysAgo++) {
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);

      const stats = await strapi.service('api::daily-stat.daily-stat').calculateProductivity(
        user.id,
        new Date(date)
      );

      if (stats.tasksCompleted > 0 || stats.totalWorkMinutes > 0) {
        await strapi.entityService.create('api::daily-stat.daily-stat', {
          data: {
            ...stats,
            date: date.toISOString().split('T')[0],
            user: user.id,
            tasksCreated: faker.number.int({ min: 0, max: 5 }),
            totalPomodoroSessions: faker.number.int({ min: 0, max: 8 }),
            totalBreakMinutes: faker.number.int({ min: 0, max: 60 }),
          },
        });
      }
    }
    console.log(`✅ Generated 30 days of stats for ${user.email}`);
  }

  console.log('🎉 Database seeding complete!');
  console.log('\n📊 Created:');
  console.log(`   👥 ${users.length} users`);
  console.log(`   📝 ${users.length * 10} tasks (approx)`);
  console.log(`   ⏰ ${users.length * 20} pomodoro sessions (approx)`);
  console.log(`   📈 ${users.length * 15} daily stats (approx)`);
  console.log('\n🔑 Login credentials:');
  console.log('   Email: user1@nocrastination.com');
  console.log('   Password: Password123!');
};