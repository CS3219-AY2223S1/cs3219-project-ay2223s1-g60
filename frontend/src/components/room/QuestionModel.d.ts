export interface QuestionModel {
  _id: string;
  question_frontend_id: number;
  question_title: string;
  discussion_urls: string[];
  question_difficulty: number;
  question_text: string;
  question_title_slug: string;
}

export const defaultQuestion = {
  _id: '',
  question_frontend_id: 0,
  question_title: '',
  discussion_urls: [],
  question_difficulty: 0,
  question_text: '',
  question_title_slug: '',
};
