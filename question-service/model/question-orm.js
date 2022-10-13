import { getRandomQuestion } from "./repository.js";

export async function ormGetRandomQuestion(
  question_difficulty,
  question_type = null
) {
  try {
    const question = await getRandomQuestion({
      question_type,
      question_difficulty,
    });
    return question;
  } catch (err) {
    console.log(
      `ERROR: Could not get question from DB. Wrong type/difficulty.`
    );
    console.log(err);
    return { err };
  }
}
