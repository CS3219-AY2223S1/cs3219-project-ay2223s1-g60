import chai from 'chai';
import io from 'socket.io-client';
import app from '../server.js';
import { DEV_SERVER_URI } from '../constants.js';
import { randomUUID } from 'crypto';

const expect = chai.expect;

const SOCKET_OPTIONS = {
  transports: ['websocket'],
  'force new connection': true,
};

let user1, user2, user3;
const room = randomUUID();
const diffRoom = randomUUID();

describe('Socket connection', () => {
  it('should connect user1', (done) => {
    user1 = io.connect(DEV_SERVER_URI, {
      query: { room: room },
    });
    user1.on('connect', () => {
      user1.on('join-room', ({ room: room1, socketId }) => {
        expect(room1).to.equal(room);
        socketId === user1.id && done();
      });
    });
  });

  it('should connect user2', (done) => {
    user2 = io.connect(DEV_SERVER_URI, {
      ...SOCKET_OPTIONS,
      query: { room: room },
    });
    user2.on('connect', () => {
      user2.on('join-room', ({ room: room2, socketId }) => {
        expect(room2).to.equal(room);
        socketId === user2.id && done();
      });
    });
  });

  it('should connect user3', (done) => {
    user3 = io.connect(DEV_SERVER_URI, {
      ...SOCKET_OPTIONS,
      query: { room: diffRoom },
    });
    user3.on('connect', () => {
      user3.on('join-room', ({ room: room3, socketId }) => {
        expect(room3).to.equal(diffRoom);
        socketId === user3.id && done();
      });
    });
  });
});

describe('[Event] New Chat', () => {
  let callCounts = { user1: 0, user2: 0, user3: 0 };

  it('should send private typing notification', (done) => {
    const typingData = {
      socketId: user1.id,
      name: 'user1',
      room: room,
    };
    user1.emit('typing', typingData);
    user3.on('typingMessage', () => callCounts.user3++);
    user2.on('typingMessage', (data) => {
      expect(data).to.be.a('object');
      expect(data).to.deep.equal(typingData);
      callCounts.user2++;
      expect(callCounts).to.deep.eq({ user1: 0, user2: 1, user3: 0 });
      done();
    });
  });

  it('should send private message', (done) => {
    const messageData = {
      text: 'hi',
      name: 'user1',
      socketId: user1.id,
      room: room,
    };
    user1.emit('message', messageData);
    user3.on('messageResponse', () => callCounts.user3++);
    user2.on('messageResponse', (data) => {
      expect(data).to.be.a('object');
      expect(data).to.deep.equal(messageData);
      callCounts.user2++;
      expect(callCounts).to.deep.equal({ user1: 0, user2: 2, user3: 0 });
      done();
    });
  });
});

describe('[Event] Assign Role', () => {
  const possibleRoles = [
    {
      interviewer: 'user1',
      interviewee: 'user2',
    },
    {
      interviewer: 'user2',
      interviewee: 'user1',
    },
  ];

  beforeEach(() => {
    user1.emit('get-role', { room: room, username: 'user1' });
    user2.emit('get-role', { room: room, username: 'user2' });
  });

  it('should assign different roles to users', (done) => {
    user1.on('assign-role', (role1) => {
      expect(role1).to.satisfy((role1) => {
        return (
          expect(role1).to.deep.equal(possibleRoles[0]) ||
          expect(role1).to.deep.equal(possibleRoles[1])
        );
      });
      user2.on('assign-role', (role2) => {
        expect(role2).to.deep.equal(role1);
        done();
      });
    });
  });
});

describe('Socket disconnect', () => {
  it('should disconnect user1', (done) => {
    user1.on('disconnect', () => done());
    user1.disconnect();
  });

  it('should disconnect user2', (done) => {
    user2.on('disconnect', () => done());
    user2.disconnect();
  });

  it('should disconnect user3', (done) => {
    user3.on('disconnect', () => done());
    user3.disconnect();
  });
});
