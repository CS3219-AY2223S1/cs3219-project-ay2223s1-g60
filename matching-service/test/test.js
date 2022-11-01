import chai from 'chai';
import chaiHttp from 'chai-http';
import io from 'socket.io-client';
import app from '../server.js';
import { DEV_SERVER_URI } from '../constants.js';
import mongoose from 'mongoose';
import 'dotenv/config';
import assert from 'assert';

assert(process.env.ENV == 'TEST');

chai.use(chaiHttp);
const expect = chai.expect;

const SOCKET_OPTIONS = {
  transports: ['websocket'],
  'force new connection': true,
};

let user1, user2, user3;

describe('Socket connection', function () {
  // Note: Remember to not use NUS_STU WiFi
  before('Connect to MongoDB', function (done) {
    mongoose.connect(process.env.DB_CLOUD_URI_TEST).then(function () {
      done();
    });
  });

  it('should connect user1', function (done) {
    user1 = io.connect(DEV_SERVER_URI, SOCKET_OPTIONS);
    user1.on('connect', done);
  });

  it('should connect user2', function (done) {
    user2 = io.connect(DEV_SERVER_URI, SOCKET_OPTIONS);
    user2.on('connect', done);
  });

  it('should connect user3', function (done) {
    user3 = io.connect(DEV_SERVER_URI, SOCKET_OPTIONS);
    user3.on('connect', done);
  });
});

describe('[Event] Find Match', function () {
  let matchReq1, matchReq2, matchReq3;

  describe('first match request', function () {
    it('should put users in waiting room', function (done) {
      matchReq1 = { username: 'user1', difficulty: 1, socketId: user1.id };
      user1.emit('find-match', matchReq1);
      user1.on('update-waiting-room', (waitingRoom) => {
        expect(waitingRoom).to.eql([matchReq1]);
        done();
      });
    });
  });

  describe('different match request', function () {
    it('should put users in waiting room', function (done) {
      matchReq2 = { username: 'user2', difficulty: 2, socketId: user2.id };
      user2.emit('find-match', matchReq2);
      user2.on('update-waiting-room', (waitingRoom) => {
        expect(waitingRoom).to.eql([matchReq1, matchReq2]);
        done();
      });
    });
  });

  describe('same match request', function () {
    it('should match users', function (done) {
      matchReq3 = { username: 'user3', difficulty: 2, socketId: user3.id };
      user3.emit('find-match', matchReq3);
      user3.on('found-match', done);
    });
  });
});

describe('Socket disconnect', function () {
  it('should disconnect user1', function (done) {
    user1.on('disconnect', () => done());
    user1.disconnect();
  });

  it('should disconnect user2', function (done) {
    user2.on('disconnect', () => done());
    user2.disconnect();
  });

  it('should disconnect user3', function (done) {
    user3.on('disconnect', () => done());
    user3.disconnect();
  });
});
