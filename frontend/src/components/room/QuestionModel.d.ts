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
  question_title: 'Question Title',
  discussion_urls: [],
  question_difficulty: 0,
  question_text:
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia voluptatibus officia cupiditate voluptatem nisi consectetur. Assumenda optio quis non, ad distinctio sed porro similique ipsam tempora ducimus deleniti atque. Deleniti? Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam incidunt sunt quod ad velit debitis a, quis, adipisci explicabo eveniet nostrum molestiae recusandae nesciunt veniam consectetur nihil tenetur mollitia beatae. Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut aliquam unde veniam quam eum accusantium facilis maiores, laborum, voluptates magnam non atque, laudantium officia! Voluptatibus dolor harum delectus voluptates ex. Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis eos cum optio nemo officia ullam eaque quisquam beatae unde ut, sint esse tempora incidunt laborum, voluptatum id possimus ipsam excepturi. Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse excepturi optio consequuntur numquam natus delectus laborum? Placeat omnis eos dignissimos quia ducimus. Eius beatae quod sunt sit dolorem! Corrupti, cupiditate.',
  question_title_slug: '',
};
