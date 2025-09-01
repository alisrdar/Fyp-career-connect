import PersonalityQuestion from '@/models/PersonalityQuestion';
import { DbCon } from '@/lib/dbCon';

// Map Likert text answers to numeric values
const likertMap = {
  'Strongly Disagree': 1,
  'Disagree': 2,
  'Neutral': 3,
  'Agree': 4,
  'Strongly Agree': 5,
};

export async function scorePersonalityFromDoc(responseItems) {
  await DbCon();

  // Fetch all IPIP questions from DB
  const ipipQuestions = await PersonalityQuestion.find({ type: 'ipip' }).lean();

  // Create a map: id string -> {trait, reverse}
  const questionMetaMap = {};
  ipipQuestions.forEach(q => {
    questionMetaMap[q._id.toString()] = {
      trait: q.trait,
      reverse: q.reverse_scored,
    };
  });

  // Initialize accumulators
  const traitScores = {
    Openness: 0,
    Conscientiousness: 0,
    Extraversion: 0,
    Agreeableness: 0,
    Neuroticism: 0,
  };
  const traitCounts = { ...traitScores };

  // Process each response
  for (const item of responseItems) {
    const { questionId, answer } = item;
    const meta = questionMetaMap[questionId];
    if (!meta) {
      console.warn(`Unknown questionId skipped: ${questionId}`);
      continue;
    }

    // Convert answer to numeric
    let ansNum = typeof answer === 'number'
      ? answer
      : typeof answer === 'string' && !isNaN(Number(answer))
      ? Number(answer)
      : likertMap[answer] || null;

    if (ansNum == null) {
      console.warn(`Invalid answer skipped for ${questionId}:`, answer);
      continue;
    }

    // Apply reverse scoring if needed
    const scored = meta.reverse ? 6 - ansNum : ansNum;
    traitScores[meta.trait] += scored;
    traitCounts[meta.trait] += 1;
  }

  // Compute average (normalized) trait scores
  for (const trait in traitScores) {
    const count = traitCounts[trait] || 0;
    traitScores[trait] = count > 0
      ? +(traitScores[trait] / count).toFixed(2)
      : 0;
  }

  return traitScores;
}
