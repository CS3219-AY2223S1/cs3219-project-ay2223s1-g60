import { ChatModel } from './chat/ChatModel';

export interface HistoryModel {
  username1: string;
  username2: string;
  roomId: string;
  chats: ChatModel[];
  question: QuestionModel;
  code: CodeModel;
}

export interface CodeModel {
  code: string;
  language: string;
}
