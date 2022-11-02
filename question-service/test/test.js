// Import the dependencies for testing
import chai from "chai";
import chaiHttp from "chai-http";
import app from "../index.js";
import assert from 'assert';
import mongoose from 'mongoose';

assert(process.env.ENV == 'TEST');

chai.use(chaiHttp);
chai.should();
const expect = chai.expect;

describe("Question", () => {
  // Note: Remember to not use NUS_STU WiFi
  before('Connect to MongoDB', function (done) {
    mongoose.connect(process.env.DB_CLOUD_URI).then(function () {
      done();
    });
  });

  describe("GET /api/question/ EASY", () => {
    it("should get a random question with easy difficulty", (done) => {
      chai
        .request(app)
        .get("/api/question?difficulty=1")
        .end((err, res) => {
          res.should.have.status(201);
          res.body.resp.should.be.an('object').that.includes
            .keys('question_frontend_id', 'question_title',
              'question_title_slug', 'question_text', 'question_difficulty', 'discussion_urls');
          expect(res.body.resp.question_difficulty).to.equal(1);
          done();
        });
    });
  });
  
  describe("GET /api/question/ MEDIUM", () => {
    it("should get a random question with medium difficulty", (done) => {
      chai
        .request(app)
        .get("/api/question?difficulty=2")
        .end((err, res) => {
          res.should.have.status(201);
          res.body.resp.should.be.an('object').that.includes
            .keys('question_frontend_id', 'question_title',
              'question_title_slug', 'question_text', 'question_difficulty', 'discussion_urls');
          expect(res.body.resp.question_difficulty).to.equal(2);
          done();
        });
    });
  });
  
  describe("GET /api/question/ HARD", () => {
    it("should get a random question with hard difficulty", (done) => {
      chai
        .request(app)
        .get("/api/question?difficulty=3")
        .end((err, res) => {
          console.log(res.body.resp);
          res.should.have.status(201);
          res.body.resp.should.be.an('object').that.includes
            .keys('question_frontend_id', 'question_title',
              'question_title_slug', 'question_text', 'question_difficulty', 'discussion_urls');
          expect(res.body.resp.question_difficulty).to.equal(3);
          done();
        });
    });
  });
});