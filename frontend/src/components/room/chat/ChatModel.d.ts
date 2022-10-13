export interface ChatModel {
  text: string;
  name: string;
  id: number;
  socketId: string;
  room: string;
}

export interface Roles {
  interviewer: string;
  interviewee: string;
}

export const defaultRole = { interviewer: '', interviewee: '' };
