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

describe('Socket connection', function () {
  it('should connect user1', function (done) {
    user1 = io.connect(DEV_SERVER_URI, SOCKET_OPTIONS);
    user1.on('connect', done);
  });

  it('should put user1 in a room', function (done) {
    user1.emit('join-room', { room });
    user1.on('joined-room', ({ room: room1 }) => {
      expect(room1).to.equal(room);
      done();
    });
  });

  it('should connect user2', function (done) {
    user2 = io.connect(DEV_SERVER_URI, SOCKET_OPTIONS);
    user2.on('connect', done);
  });

  it('should put user2 in a room', function (done) {
    user2.emit('join-room', { room });
    user2.on('joined-room', ({ room: room2 }) => {
      expect(room2).to.equal(room);
      done();
    });
  });

  it('should connect user3', function (done) {
    user3 = io.connect(DEV_SERVER_URI, SOCKET_OPTIONS);
    user3.on('connect', done);
  });

  it('should put user3 in a room', function (done) {
    user3.emit('join-room', { room: diffRoom });
    user3.on('joined-room', ({ room: room3 }) => {
      expect(room3).to.equal(diffRoom);
      done();
    });
  });
});

describe('[Event] Typed Code', () => {
  let callCounts = { user1: 0, user2: 0, user3: 0 };

  it('should send private typing code', function (done) {
    const typingData = {
      socketId: user1.id,
      name: 'user1',
      room: room,
      text: "const main = () => console.log('hi')",
    };

    user1.emit('typedCode', typingData);
    user3.on('typedCode', () => callCounts.user3++);
    user2.on('typedCode', (data) => {
      expect(data).to.be.a('object');
      expect(data).to.deep.equal(typingData);
      callCounts.user2++;
    });

    setTimeout(() => {
      expect(callCounts).to.deep.eq({ user1: 0, user2: 1, user3: 0 });
      done();
    }, 20);
  });

  it('should send private typing code', function (done) {
    const typingData = {
      socketId: user1.id,
      name: 'user3',
      room: diffRoom,
      text: "const main = () => console.log('hi')",
    };

    user3.emit('typedCode', typingData);
    user1.on('typedCode', () => callCounts.user1++);
    user2.on('typedCode', () => callCounts.user2++);
    expect(callCounts).to.deep.eq({ user1: 0, user2: 1, user3: 0 });
    done();
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
