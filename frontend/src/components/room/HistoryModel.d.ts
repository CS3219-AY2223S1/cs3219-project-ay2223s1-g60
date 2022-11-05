import { ChatModel } from './chat/ChatModel';

export interface HistoryModel {
  user1: UserSimpleModel;
  user2: UserSimpleModel;
  roomId: string;
  chats: ChatModel[];
  question: QuestionModel;
  code: CodeModel;
}

export interface CodeModel {
  code: string;
  language: string;
}

export interface UserSimpleModel {
  user_id: string | null;
  username: string;
}
