import { ormGetRandomQuestion as _getRandomQuestion } from "../model/question-orm.js";

export async function getRandomQuestion(req, res) {
  try {
    const { difficulty } = req.query;
    let type = req.query.type ? req.query.type : null;

    if (!difficulty) {
      return res.status(400).json({ message: "Difficulty is missing!" });
    }
    const resp = await _getRandomQuestion(parseInt(difficulty), type);
    if (resp.err) {
      return res.status(400).json({ message: "Could not get question!" });
    } 
      
    return res.status(201).json({ resp });
    
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Database failure when getting question!" });
  }
}
