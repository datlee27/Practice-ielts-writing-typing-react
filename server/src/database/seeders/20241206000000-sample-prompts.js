'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('prompts', [
      {
        title: 'Technology and Communication',
        content: 'Some people believe that technology has made our lives more complicated while others argue that it has made things easier. In my opinion although technology can be challenging to adapt to initially it ultimately simplifies many aspects of daily life.',
        taskType: 'task2',
        difficulty: 'medium',
        category: 'Technology',
        wordCount: 250,
        timeLimit: 40,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Environmental Protection',
        content: 'The government should invest more money in environmental protection rather than in economic development. To what extent do you agree or disagree?',
        taskType: 'task2',
        difficulty: 'medium',
        category: 'Environment',
        wordCount: 250,
        timeLimit: 40,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Education System',
        content: 'Some people think that schools should focus more on academic subjects while others believe that schools should also teach practical skills. Discuss both views and give your opinion.',
        taskType: 'task2',
        difficulty: 'hard',
        category: 'Education',
        wordCount: 250,
        timeLimit: 40,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Urban Population Growth',
        content: 'The chart below shows the percentage of households in owned and rented accommodation in England and Wales between 1918 and 2011. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
        taskType: 'task1',
        difficulty: 'medium',
        category: 'Housing',
        wordCount: 150,
        timeLimit: 20,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Internet Usage Statistics',
        content: 'The graphs below show the percentage of Internet users in different age groups in Australia from 1994 to 2009, and the percentage of people who purchased goods online in Australia between 1994 and 2009. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
        taskType: 'task1',
        difficulty: 'hard',
        category: 'Technology',
        wordCount: 150,
        timeLimit: 20,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Work-Life Balance',
        content: 'Many people find it difficult to balance work and other parts of their lives. What are the reasons for this? What can be done to help people achieve a better work-life balance?',
        taskType: 'task2',
        difficulty: 'easy',
        category: 'Work',
        wordCount: 250,
        timeLimit: 40,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('prompts', null, {});
  }
};