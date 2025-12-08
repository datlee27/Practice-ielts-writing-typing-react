export interface ScoringCriteria {
  taskResponse: number;
  coherence: number;
  lexicalResource: number;
  grammar: number;
}

export interface ScoringResult {
  overallBand: number;
  criteria: ScoringCriteria;
  feedback: string;
}

export class AIScoringService {
  static async scoreEssay(
    essayText: string,
    prompt: string,
    taskType: 'task1' | 'task2',
    wordCount: number
  ): Promise<ScoringResult> {
    const criteria = this.analyzeCriteria(essayText, prompt, taskType, wordCount);
    const overallBand = this.calculateOverallBand(criteria, taskType, wordCount);
    const feedback = this.generateFeedback(criteria, taskType, wordCount);

    return {
      overallBand,
      criteria,
      feedback,
    };
  }

  private static analyzeCriteria(
    essayText: string,
    prompt: string,
    taskType: 'task1' | 'task2',
    wordCount: number
  ): ScoringCriteria {
    const words = essayText.split(/\s+/).filter(word => word.length > 0);
    const sentences = essayText.split(/[.!?]+/).filter(s => s.trim().length > 0);

    let taskResponse = 5.0;
    if (taskType === 'task2' && wordCount >= 250) taskResponse = 7.0;
    else if (taskType === 'task1' && wordCount >= 150) taskResponse = 7.0;

    let coherence = 5.0;
    const avgSentenceLength = words.length / sentences.length;
    if (avgSentenceLength > 15 && avgSentenceLength < 25) coherence = 7.0;

    let lexicalResource = 5.0;
    const uniqueWords = new Set(words.map(w => w.toLowerCase())).size;
    const vocabularyRichness = uniqueWords / words.length;
    if (vocabularyRichness > 0.6) lexicalResource = 7.0;

    let grammar = 5.0;
    const avgWordsPerSentence = words.length / sentences.length;
    if (avgWordsPerSentence >= 12 && avgWordsPerSentence <= 20) grammar = 7.0;

    return {
      taskResponse,
      coherence,
      lexicalResource,
      grammar,
    };
  }

  private static calculateOverallBand(
    criteria: ScoringCriteria,
    taskType: 'task1' | 'task2',
    wordCount: number
  ): number {
    const scores = [
      criteria.taskResponse,
      criteria.coherence,
      criteria.lexicalResource,
      criteria.grammar,
    ];

    const weightedAverage = (
      criteria.taskResponse * 0.3 +
      criteria.coherence * 0.25 +
      criteria.lexicalResource * 0.25 +
      criteria.grammar * 0.2
    );

    const minWords = taskType === 'task1' ? 150 : 250;
    const wordCountPenalty = wordCount < minWords * 0.8 ? 1.0 : 0;

    const finalScore = Math.max(1, Math.min(9, weightedAverage - wordCountPenalty));
    return Math.round(finalScore * 2) / 2;
  }

  private static generateFeedback(
    criteria: ScoringCriteria,
    taskType: 'task1' | 'task2',
    wordCount: number
  ): string {
    const feedback: string[] = [];

    const minWords = taskType === 'task1' ? 150 : 250;
    if (wordCount < minWords) {
      feedback.push(`Your essay is under the word limit. Aim for at least ${minWords} words.`);
    }

    if (criteria.taskResponse < 6) {
      feedback.push('Improve your task response by addressing all parts of the question more directly.');
    }

    if (criteria.coherence < 6) {
      feedback.push('Work on coherence by using better paragraphing and linking words.');
    }

    if (criteria.lexicalResource < 6) {
      feedback.push('Expand your lexical resource by using more varied and precise vocabulary.');
    }

    if (criteria.grammar < 6) {
      feedback.push('Focus on grammatical accuracy, especially complex sentence structures.');
    }

    if (feedback.length === 0) {
      feedback.push('Good work! Your essay demonstrates solid IELTS writing skills.');
    }

    return feedback.join(' ');
  }
}