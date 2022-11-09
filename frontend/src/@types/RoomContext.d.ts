import { ChatModel } from '../components/room/chat/ChatModel';
import { UserSimpleModel } from '../components/room/HistoryModel';
import { QuestionModel } from '../components/room/QuestionModel';

export interface Room {
  readOnly: boolean;
  code: string | undefined;
  language: string | undefined;
  chats: ChatModel[];
  question: QuestionModel;
  roomId: string | null;
}

export interface RoomModel {
  user1: UserSimpleModel;
  user2: UserSimpleModel;
  difficulty: string;
  sessionInfo: Object;
  question: Object;
}

export interface RoomContextInterface {
  room: Room;
  saveHistory: () => {};
  setCode: (code: string) => {};
  setLanguage: (language: string) => {};
  setQuestion: (question: QuestionModel) => {};
  setChats: (chat: ChatModel) => {};
  setRoomId: (roomId: string) => {};
}
