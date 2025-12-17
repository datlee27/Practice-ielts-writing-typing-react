-- MySQL Database Setup for IELTS Writing Practice
-- Run this script to create tables and populate sample data

-- Create database (if not exists)
CREATE DATABASE IF NOT EXISTS ielts_writing_practice;
USE ielts_writing_practice;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  uuid VARCHAR(36) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  firstName VARCHAR(100),
  lastName VARCHAR(100),
  avatar VARCHAR(500),
  googleId VARCHAR(50),
  provider ENUM('local', 'google') DEFAULT 'local',
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
);

-- Prompts table
CREATE TABLE IF NOT EXISTS prompts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  sampleEssay TEXT,
  taskType ENUM('task1', 'task2') NOT NULL,
  difficulty ENUM('easy', 'medium', 'hard') NOT NULL,
  category VARCHAR(100),
  wordCount INT DEFAULT 0,
  timeLimit INT DEFAULT 0,
  isActive TINYINT(1) DEFAULT 1,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
);

-- Tests table
CREATE TABLE IF NOT EXISTS tests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT,
  promptId INT,
  testType VARCHAR(50) DEFAULT 'practice',
  mode VARCHAR(50) DEFAULT 'preset',
  sampleText TEXT,
  userInput TEXT NOT NULL,
  wpm DECIMAL(5,2) DEFAULT 0,
  accuracy DECIMAL(5,2) DEFAULT 0,
  timeSpent INT DEFAULT 0,
  wordCount INT DEFAULT 0,
  completedAt DATETIME NOT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (promptId) REFERENCES prompts(id) ON DELETE SET NULL
);

-- Essays table
CREATE TABLE IF NOT EXISTS essays (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT,
  testId INT,
  prompt TEXT NOT NULL,
  taskType VARCHAR(20) NOT NULL,
  essayText TEXT NOT NULL,
  uploadedImage VARCHAR(500),
  wordCount INT DEFAULT 0,
  overallBand DECIMAL(3,1) DEFAULT 0,
  taskResponseScore DECIMAL(3,1) DEFAULT 0,
  coherenceScore DECIMAL(3,1) DEFAULT 0,
  lexicalResourceScore DECIMAL(3,1) DEFAULT 0,
  grammarScore DECIMAL(3,1) DEFAULT 0,
  feedback TEXT,
  isScored TINYINT(1) DEFAULT 0,
  scoredAt DATETIME,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL
);

-- Insert sample prompts
INSERT IGNORE INTO prompts (title, content, sampleEssay, taskType, difficulty, category, wordCount, timeLimit, isActive, createdAt, updatedAt) VALUES
('Technology and Communication', 'Some people believe that technology has made our lives more complicated while others argue that it has made things easier. In my opinion although technology can be challenging to adapt to initially it ultimately simplifies many aspects of daily life.', 'It is often argued that technological advancements have complicated our lives, whereas others contend that they have simplified them. In my opinion, although technology can be challenging to adapt to initially, it ultimately makes our lives easier in many ways. This essay will discuss both perspectives before presenting my viewpoint.

On the one hand, there are several reasons why some people believe technology has made life more complicated. Firstly, the rapid pace of technological change means that people constantly need to learn new skills and adapt to new devices. For example, older people often struggle with smartphones and computers, leading to frustration and feelings of inadequacy. Secondly, technology can create new problems such as privacy concerns and cyber security threats. People worry about their personal data being hacked or misused, which adds a layer of complexity to daily life.

On the other hand, technology has undoubtedly simplified many aspects of modern life. Communication is a prime example; video calls and instant messaging allow us to connect with anyone anywhere at virtually no cost. This has strengthened relationships and made international collaboration easier. Furthermore, technology has automated many tedious tasks. For instance, online banking and shopping apps save time and reduce the need for physical travel, making daily routines more efficient.

In conclusion, while technology does present some challenges, particularly for those less familiar with it, the benefits far outweigh the drawbacks. The key is to embrace technological change and use it to enhance rather than complicate our lives.', 'task2', 'medium', 'Technology', 250, 40, 1, NOW(), NOW()),

('Environmental Protection', 'The government should invest more money in environmental protection rather than in economic development. To what extent do you agree or disagree?', 'There is ongoing debate about whether governments should prioritize environmental protection over economic development. While some argue that economic growth should take precedence, I strongly believe that environmental protection is equally important and should be given equal consideration.

Those who favor economic development argue that it provides jobs, raises living standards, and reduces poverty. Developing countries need economic growth to improve infrastructure, healthcare, and education. Furthermore, economic development can fund environmental initiatives once countries become wealthier. For example, many developed nations began serious environmental protection only after achieving economic prosperity.

However, I believe environmental protection should not be sacrificed for economic growth. Firstly, environmental degradation has serious long-term consequences. Climate change, deforestation, and pollution threaten human health, agriculture, and biodiversity. The costs of environmental damage often outweigh the benefits of short-term economic gains. Moreover, sustainable development is possible through green technologies and renewable energy, which can create jobs while protecting the environment.

Furthermore, environmental problems do not respect national borders. Actions in one country can affect global climate patterns and ecosystems. International cooperation is essential, and wealthy nations have a responsibility to help developing countries adopt sustainable practices.

In conclusion, while economic development is important, it should not come at the expense of environmental protection. Governments should pursue sustainable development that balances economic growth with environmental stewardship.', 'task2', 'medium', 'Environment', 300, 45, 1, NOW(), NOW()),

('Education System', 'Some people think that schools should focus more on academic subjects while others believe that schools should also teach practical skills. Discuss both views and give your opinion.', 'There is considerable debate about whether computers and the internet are more important than traditional schooling for children''s education. While technology offers numerous advantages, I believe that school teachers remain essential for effective learning.

On one hand, computers and the internet provide access to vast amounts of information and learning resources. Children can learn at their own pace through interactive online courses and educational websites. Technology also offers personalized learning experiences that adapt to individual needs. Moreover, online education can be more cost-effective and flexible, allowing students to study from anywhere at any time.

However, traditional schooling with teachers offers irreplaceable benefits that technology cannot provide. Teachers offer guidance, motivation, and emotional support that are crucial for children''s development. They can identify when students are struggling and provide personalized attention. Furthermore, schools teach important social skills and foster interaction between students from diverse backgrounds.

In my view, the most effective education combines both approaches. Technology can enhance traditional learning by providing additional resources and interactive tools. Teachers can use computers to create engaging lessons and help students develop digital literacy skills. The ideal system integrates technology as a tool to support, rather than replace, traditional teaching methods.

To conclude, while computers and the internet offer valuable educational opportunities, school teachers play an irreplaceable role in children''s learning. The best approach combines the strengths of both traditional and digital education.', 'task2', 'hard', 'Education', 250, 40, 1, NOW(), NOW()),

('Work-Life Balance', 'Many people find it difficult to balance work and other parts of their lives. What are the reasons for this? What can be done to help people achieve a better work-life balance?', 'Achieving a healthy work-life balance has become increasingly challenging in modern society. There are several reasons why people struggle with this balance, and various solutions can be implemented to address these issues.

One primary reason for the difficulty in maintaining work-life balance is the demanding nature of modern work environments. Many jobs require long working hours, overtime, and constant connectivity through smartphones and emails. For instance, professionals in high-pressure industries often work beyond regular office hours and remain accessible during weekends and holidays. This constant availability blurs the boundaries between work and personal life, leaving little time for relaxation and family activities.

Another contributing factor is the competitive job market and economic pressures. In many countries, job security is not guaranteed, leading people to work harder to maintain their positions. Additionally, the rising cost of living forces many individuals to take on multiple jobs or work extended hours to meet financial obligations. This economic necessity often comes at the expense of personal well-being and family time.

Furthermore, the nature of work itself has changed with the advent of technology. Remote work and flexible schedules, while offering some benefits, can make it harder to disconnect from work responsibilities. The ability to check emails and respond to work-related messages from anywhere can lead to work encroaching on personal time.

To address these challenges, several measures can be taken. Firstly, employers should promote flexible working arrangements, such as part-time options, job sharing, and remote work policies that allow employees to better manage their time. Secondly, companies should implement strict policies regarding work hours and after-hours communications to prevent burnout and ensure employees have adequate rest time.

Additionally, governments can play a role by enacting legislation that protects workers'' rights to disconnect and maintain reasonable working hours. For example, some European countries have introduced "right to disconnect" laws that prohibit employers from contacting employees outside of agreed working hours.

On a personal level, individuals should learn to set boundaries and prioritize self-care. This might involve turning off work notifications during personal time, delegating tasks when possible, and making time for hobbies and family activities.

In conclusion, while modern work demands and economic pressures make work-life balance challenging, a combination of organizational policies, government regulations, and personal discipline can help individuals achieve a healthier balance between their professional and personal lives.', 'task2', 'easy', 'Work', 300, 45, 1, NOW(), NOW()),

('Internet Usage Statistics', 'The graphs below show the percentage of Internet users in different age groups in Australia from 1994 to 2009, and the percentage of people who purchased goods online in Australia between 1994 and 2009. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.', 'The line graph illustrates the percentage of Australians in various age groups who used the internet between 1994 and 2009, while the bar chart shows the proportion of people who bought goods online during the same period.

Regarding internet usage by age group, there was a clear trend of increasing adoption across all age categories over the 15-year period. The youngest age group (14-17 years old) consistently had the highest usage rates, starting at approximately 2% in 1994 and rising dramatically to about 90% by 2009. The 18-24 age group followed a similar pattern, beginning at around 2% and reaching nearly 80% by the end of the period.

The 25-34 and 35-44 age groups showed more moderate growth. The 25-34 group increased from about 1% to approximately 55%, while the 35-44 group rose from nearly 0% to around 45%. Older age groups had much lower adoption rates. The 45-54 group went from 0% to about 30%, and the 55-64 group increased from 0% to roughly 25%. Those aged 65 and over had the lowest usage, starting and ending at 0%.

The bar chart reveals that online shopping also grew significantly, though at a slower pace. In 1994, only about 2% of Australians purchased goods online. This figure rose gradually to 5% in 1997, then more steeply to 15% in 2000. By 2003, online shopping had reached 25%, and it continued to climb to 35% in 2006 and 45% in 2009.

Overall, both internet usage and online shopping increased substantially in Australia from 1994 to 2009, with younger people adopting the technology much faster than older generations, and online commerce growing more slowly but steadily.', 'task1', 'hard', 'Technology', 150, 20, 1, NOW(), NOW()),

('Urban Population Growth', 'The chart below shows the percentage of households in owned and rented accommodation in England and Wales between 1918 and 2011. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.', 'The chart illustrates the proportion of households living in owned and rented accommodation in England and Wales from 1918 to 2011. Overall, the percentage of owner-occupied homes increased significantly over the period, while rented accommodation declined considerably.

In 1918, approximately 23% of households owned their homes, compared to 77% who rented. This trend reversed dramatically over the next century. By 2001, owner occupation had risen to 69%, while private renting had fallen to 10%. Social renting (from local authorities or housing associations) peaked at around 29% in 1981 but declined to 17% by 2011.

The most striking change occurred in owner occupation, which grew steadily from 23% in 1918 to reach a peak of 70% in 2001, before slightly declining to 65% in 2011. This increase was largely at the expense of private renting, which fell from 77% in 1918 to 17% by 2011.

Social renting showed more fluctuation, starting at zero in 1918, rising to 29% by 1981, then declining to 17% by the end of the period. This pattern reflects changes in government housing policies and economic conditions over the decades.

In summary, the data shows a clear shift from renting to owner occupation in England and Wales over nearly a century, with owner occupation becoming the dominant form of housing tenure by the early 21st century.', 'task1', 'medium', 'Housing', 150, 20, 1, NOW(), NOW()),

('Global Warming Solutions', 'Climate change is one of the biggest threats facing humanity today. Discuss the causes of global warming and suggest some solutions.', 'Climate change represents one of the most pressing challenges of our time, with global warming threatening ecosystems, economies, and human livelihoods worldwide. This essay will examine the primary causes of global warming and propose practical solutions to mitigate its effects.

The main cause of global warming is the emission of greenhouse gases, particularly carbon dioxide (CO2), from human activities. The burning of fossil fuels for energy production, transportation, and industrial processes accounts for approximately 75% of global greenhouse gas emissions. Deforestation also contributes significantly, as trees that would normally absorb CO2 are removed, reducing the planet''s capacity to sequester carbon.

Another significant contributor is agricultural practices, including livestock farming which produces methane, a potent greenhouse gas. Land use changes, such as the conversion of forests to agricultural land, further exacerbate the problem by reducing natural carbon sinks.

To address these challenges, several solutions can be implemented at individual, national, and international levels. Governments should invest heavily in renewable energy sources such as solar, wind, and hydroelectric power. This requires not only technological development but also policy changes, including subsidies for renewable energy and carbon pricing mechanisms that make fossil fuels more expensive.

International cooperation is crucial, as climate change is a global problem requiring coordinated action. Agreements like the Paris Climate Accord provide frameworks for countries to commit to emission reductions, though stronger enforcement mechanisms are needed.

On an individual level, people can reduce their carbon footprint by conserving energy, using public transportation, eating less meat, and supporting sustainable products. Businesses should adopt sustainable practices, such as reducing waste and implementing energy-efficient technologies.

Technological innovations offer hope for the future. Carbon capture and storage technologies could remove CO2 from the atmosphere, while geoengineering solutions might provide temporary relief. However, these should be viewed as complementary to, rather than replacements for, emission reduction strategies.

In conclusion, while the causes of global warming are largely human-induced, the solutions lie in our ability to implement sustainable practices, embrace renewable technologies, and foster international cooperation. The time to act is now, before irreversible damage is done to our planet.', 'task2', 'medium', 'Environment', 300, 45, 1, NOW(), NOW());

-- Check results
SELECT COUNT(*) as total_prompts_with_essays FROM prompts WHERE sampleEssay IS NOT NULL;
