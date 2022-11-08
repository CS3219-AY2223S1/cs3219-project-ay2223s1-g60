import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index.js';
import mongoose from 'mongoose';
import assert from 'assert';
import 'dotenv/config';

assert(process.env.ENV == 'TEST');

chai.use(chaiHttp);

const user_id = '6347dbc7f4ae6f6c41001810';

describe('MongoDB Connection', () => {
  it('Connect to MongoDB', async function () {
    mongoose.connect(process.env.DB_CLOUD_URI_TEST);
    return new Promise(function (resolve) {
      mongoose.connection.collections['historymodels'].drop().then(function () {
        resolve();
      });
    });
  });
});

describe('GET /historyList/:user_id', () => {
  it("should get all user's history", function (done) {
    chai
      .request(app)
      .get(`/api/history/historyList/${user_id}`)
      .end((err, res) => {
        err && console.log(err);
        chai.expect(res).to.have.status(201);
        chai.expect(res.body).to.be.a('object');
      });
    done();
  });
});

describe('POST /:user_id', () => {
  it('should create a new history', function (done) {
    const newHistory = {
      user1: { username: 'user1', user_id: '1' },
      user2: { username: 'user2', user_id: '2' },
      roomId: 'roomId',
      chats: [
        { text: 'text', name: 'user1', socketId: 'socketId', room: 'roomId' },
      ],
      question: {
        question_frontend_id: '123',
        question_title: 'title',
        question_title_slug: 'title',
        question_text: 'hi',
        question_difficulty: 1,
      },
      code: { language: 'c', code: 'hahahah' },
    };

    const expectedBody = { message: 'Successfully added history entry!' };

    chai
      .request(app)
      .post(`/api/history/user1`)
      .send(newHistory)
      .end((err, res) => {
        err && console.log(err);
        chai.expect(res).to.have.status(201);
        chai.expect(res.body).to.deep.equal(expectedBody);
      });
    done();
  });

  it('should not create a new history', function (done) {
    const newHistory = {
      user1: { username: 'user1', user_id: '1' },
      user2: { username: 'user2', user_id: '2' },
      roomId: 'roomId',
      chats: [
        { text: 'text', name: 'user1', socketId: 'socketId', room: 'roomId' },
      ],
      code: { language: 'c', code: 'hahahah' },
    };

    const expectedBody = { message: 'Missing fields!' };

    chai
      .request(app)
      .post(`/api/history/user1`)
      .send(newHistory)
      .end((err, res) => {
        err && console.log(err);
        chai.expect(res).to.have.status(400);
        chai.expect(res.body).to.deep.equal(expectedBody);
      });
    done();
  });
});

describe('GET /:user_id/:room_id', () => {
  it('should get a specific history', function (done) {
    chai
      .request(app)
      .get(`/api/history/user1/roomId`)
      .end((err, res) => {
        err && console.log(err);
        chai.expect(res).to.have.status(201);
        chai.expect(res.body).to.be.a('object');
      });
    done();
  });
});
