import React from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Home, Download, Share2, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export function TestReport() {
  const location = useLocation();
  const navigate = useNavigate();
  const stats = location.state || { wpm: 0, accuracy: 0, time: 0, completeness: 0 };
  
  const [expandedSection, setExpandedSection] = useState<string | null>('overall');

  const calculateBandScore = () => {
    if (stats.isMockTest) {
      // Mock scoring for essay
      const wordCount = stats.wordCount || 0;
      if (wordCount >= 300) return 7.5;
      if (wordCount >= 250) return 7.0;
      if (wordCount >= 200) return 6.5;
      return 6.0;
    } else {
      // Typing test scoring
      const avgScore = (stats.accuracy + Math.min(stats.wpm / 10, 100) + stats.completeness) / 3;
      if (avgScore >= 90) return 9.0;
      if (avgScore >= 80) return 8.0;
      if (avgScore >= 70) return 7.0;
      if (avgScore >= 60) return 6.5;
      if (avgScore >= 50) return 6.0;
      return 5.5;
    }
  };

  const bandScore = calculateBandScore();

  const criteriaScores = [
    { subject: 'Task Response', score: 75, fullMark: 100 },
    { subject: 'Coherence', score: 80, fullMark: 100 },
    { subject: 'Lexical Resource', score: 70, fullMark: 100 },
    { subject: 'Grammar', score: 78, fullMark: 100 },
  ];

  const barData = [
    { name: 'Task Response', score: 7.5 },
    { name: 'Coherence', score: 8.0 },
    { name: 'Lexical', score: 7.0 },
    { name: 'Grammar', score: 7.5 },
  ];

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const AccordionSection: React.FC<{ id: string; title: string; children: React.ReactNode }> = ({ id, title, children }) => (
    <div className="border border-slate-700 rounded-lg overflow-hidden">
      <button
        onClick={() => toggleSection(id)}
        className="w-full flex items-center justify-between p-6 bg-slate-800/50 hover:bg-slate-800 transition-colors"
      >
        <h3 className="text-xl text-teal-400">{title}</h3>
        {expandedSection === id ? (
          <ChevronUp className="w-5 h-5 text-slate-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400" />
        )}
      </button>
      {expandedSection === id && (
        <div className="p-6 bg-slate-900/50 border-t border-slate-700">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 px-8 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-teal-400 hover:text-teal-300 transition-colors"
          >
            <Home className="w-5 h-5" />
            <span>Home</span>
          </button>
          
          <h1 className="text-2xl">Test Report</h1>
          
          <div className="flex gap-3">
            <Button variant="outline" className="border-slate-700 text-slate-400 hover:bg-slate-800">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" className="border-slate-700 text-slate-400 hover:bg-slate-800">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </header>

      <div className="px-8 py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Band Score Display */}
          <div className="bg-gradient-to-r from-teal-900/50 to-teal-800/50 border border-teal-700/50 rounded-lg p-12 text-center">
            <div className="inline-flex items-center justify-center w-40 h-40 rounded-full bg-teal-600/20 border-4 border-teal-500 mb-6">
              <div>
                <div className="text-6xl text-teal-400">{bandScore.toFixed(1)}</div>
                <div className="text-sm text-teal-300 mt-1">BAND SCORE</div>
              </div>
            </div>
            <h2 className="text-2xl text-teal-300">
              {bandScore >= 7.0 ? 'Excellent Performance' : bandScore >= 6.0 ? 'Good Performance' : 'Fair Performance'}
            </h2>
          </div>

          {/* Performance Charts */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Radar Chart */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg text-teal-400 mb-6">IELTS Criteria Analysis</h3>
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={criteriaScores}>
                  <PolarGrid stroke="#475569" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#94a3b8' }} />
                  <Radar name="Score" dataKey="score" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.5} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Bar Chart */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg text-teal-400 mb-6">Band Scores by Criteria</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis domain={[0, 9]} tick={{ fill: '#94a3b8' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                    labelStyle={{ color: '#e2e8f0' }}
                  />
                  <Bar dataKey="score" fill="#14b8a6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Stats Overview */}
          {!stats.isMockTest && (
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 text-center">
                <div className="text-3xl text-teal-400 mb-2">{stats.wpm}</div>
                <div className="text-sm text-slate-400">Words Per Minute</div>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 text-center">
                <div className="text-3xl text-teal-400 mb-2">{stats.accuracy}%</div>
                <div className="text-sm text-slate-400">Accuracy</div>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 text-center">
                <div className="text-3xl text-teal-400 mb-2">{Math.floor(stats.time / 1000)}s</div>
                <div className="text-sm text-slate-400">Total Time</div>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 text-center">
                <div className="text-3xl text-teal-400 mb-2">{stats.completeness}%</div>
                <div className="text-sm text-slate-400">Completion</div>
              </div>
            </div>
          )}

          {/* Accordion Feedback Sections */}
          <div className="space-y-4">
            <AccordionSection id="overall" title="Overall Feedback">
              <p className="text-slate-300 leading-relaxed">
                Your performance demonstrates a {bandScore >= 7.0 ? 'strong' : 'good'} command of English writing. 
                You have effectively addressed the task requirements and maintained coherence throughout your response. 
                Continue to focus on expanding your vocabulary range and ensuring grammatical accuracy to achieve higher band scores.
              </p>
            </AccordionSection>

            <AccordionSection id="task-response" title="Task Response (7.5)">
              <p className="text-slate-300 leading-relaxed mb-4">
                You have successfully addressed all parts of the task and presented a well-developed response with relevant, 
                extended ideas. Your position is clear throughout the essay.
              </p>
              <div className="bg-teal-950/30 border-l-4 border-teal-500 p-4 rounded-r">
                <p className="text-sm text-teal-300">
                  <strong>Strength:</strong> Clear thesis statement and consistent argument development.
                </p>
              </div>
            </AccordionSection>

            <AccordionSection id="coherence" title="Coherence & Cohesion (8.0)">
              <p className="text-slate-300 leading-relaxed mb-4">
                Your essay demonstrates excellent organization with clear progression throughout. 
                Cohesive devices are used effectively without being mechanical.
              </p>
              <div className="bg-teal-950/30 border-l-4 border-teal-500 p-4 rounded-r">
                <p className="text-sm text-teal-300">
                  <strong>Strength:</strong> Smooth transitions between paragraphs and well-structured arguments.
                </p>
              </div>
            </AccordionSection>

            <AccordionSection id="lexical" title="Lexical Resource (7.0)">
              <p className="text-slate-300 leading-relaxed mb-4">
                You demonstrate a good range of vocabulary with some flexibility and precision. 
                There are occasional errors in word choice and collocation.
              </p>
              <div className="bg-orange-950/30 border-l-4 border-orange-500 p-4 rounded-r">
                <p className="text-sm text-orange-300">
                  <strong>Area for improvement:</strong> Expand your use of less common vocabulary and idiomatic expressions.
                </p>
              </div>
            </AccordionSection>

            <AccordionSection id="grammar" title="Grammatical Range & Accuracy (7.5)">
              <p className="text-slate-300 leading-relaxed mb-4">
                You use a variety of complex structures with good control. 
                Most sentences are error-free with only occasional minor mistakes.
              </p>
              <div className="bg-teal-950/30 border-l-4 border-teal-500 p-4 rounded-r">
                <p className="text-sm text-teal-300">
                  <strong>Strength:</strong> Effective use of complex sentence structures and accurate punctuation.
                </p>
              </div>
            </AccordionSection>
          </div>

          {/* Essay Comparison */}
          {stats.isMockTest && (
            <>
              {/* Uploaded Image */}
              {stats.uploadedImage && (
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8">
                  <h3 className="text-2xl text-teal-400 mb-6">Ảnh Bài Làm Gốc</h3>
                  <img
                    src={stats.uploadedImage}
                    alt="Original essay"
                    className="max-h-96 mx-auto rounded border border-slate-700"
                  />
                </div>
              )}

              {/* Prompt Display */}
              {stats.prompt && (
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8">
                  <h3 className="text-2xl text-teal-400 mb-6">Đề Bài {stats.taskType === 'task1' ? 'Task 1' : 'Task 2'}</h3>
                  <div className="bg-slate-900/70 border border-slate-700 p-6 rounded-lg">
                    <p className="text-slate-300 leading-relaxed">{stats.prompt}</p>
                  </div>
                </div>
              )}

              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8">
                <h3 className="text-2xl text-teal-400 mb-6">Essay Analysis</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg text-slate-300 mb-3 flex items-center gap-2">
                      <div className="w-3 h-3 bg-slate-500 rounded-full"></div>
                      Original Essay
                    </h4>
                    <div className="bg-slate-900/70 border border-slate-700 p-6 rounded-lg h-80 overflow-y-auto">
                      <p className="text-slate-400 leading-relaxed whitespace-pre-wrap">
                        {stats.essay || "No essay submitted."}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg text-slate-300 mb-3 flex items-center gap-2">
                      <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
                      Corrected Version
                    </h4>
                    <div className="bg-slate-900/70 border border-slate-700 p-6 rounded-lg h-80 overflow-y-auto">
                      <p className="text-slate-400 leading-relaxed">
                        <span className="text-teal-300">Some people believe</span> that technology has made our lives more complicated, 
                        <span className="bg-teal-500/20 px-1 rounded"> while others argue</span> that it has made things easier...
                        <span className="text-xs text-slate-500 ml-2 italic">(improved structure)</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Areas for Improvement */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8">
            <h3 className="text-2xl text-teal-400 mb-6">Areas for Improvement</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-teal-400 rounded-full mt-2"></div>
                <p className="text-slate-300">Practice using more sophisticated vocabulary and less common idiomatic expressions</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-teal-400 rounded-full mt-2"></div>
                <p className="text-slate-300">Work on varying sentence structures to include more complex grammatical forms</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-teal-400 rounded-full mt-2"></div>
                <p className="text-slate-300">Ensure all examples are fully developed and clearly linked to your main arguments</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-teal-400 rounded-full mt-2"></div>
                <p className="text-slate-300">Review punctuation rules, particularly for complex sentences</p>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center pt-8">
            <Button
              onClick={() => navigate('/practice')}
              className="bg-teal-600 hover:bg-teal-500 text-white px-8 py-6 text-lg"
            >
              Practice Again
            </Button>
            <Button
              onClick={() => navigate('/mock-test')}
              className="bg-slate-700 hover:bg-slate-600 text-white px-8 py-6 text-lg"
            >
              New Mock Test
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
