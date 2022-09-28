import { ormGetRandomQuestion as _getRandomQuestion } from "../model/question-orm.js";

export async function getRandomQuestion(req, res) {
  try {
    const { difficulty } = req.query;
    console.log(req.query);
    let type = req.query.type ? req.query.type : null;

    if (difficulty) {
      console.log(typeof difficulty);
      const resp = await _getRandomQuestion(parseInt(difficulty), type);
      console.log(resp);
      if (resp.err) {
        return res.status(400).json({ message: "Could not get question!" });
      } else {
        return res.status(201).json({ resp });
      }
    } else {
      return res.status(400).json({ message: "Difficulty is missing!" });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Database failure when getting question!" });
  }
}
