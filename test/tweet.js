const chai = require("chai");
const chaiHttp = require("chai-http");
const { expect } = chai;
const app = require("../index");

chai.use(chaiHttp);

describe("Initial state", function() {
  describe("GET /", function() {
    it("should return empty array when there is no tweet", function(done) {
      chai
        .request(app)
        .get("/")
        .end((error, response) => {
          expect(error).to.be.null
          expect(response).to.have.status(200);
          expect(response.body).to.have.lengthOf(0);
          done();
        });
    });
  });
});

describe("Normal state", function() {
  const agent = chai.request.agent(app);
  describe("POST /", function() {
    it("should have created response", function(done) {
      agent
        .post("/")
        .send({
          content: "Super bored",
          username: "pknn"
        })
        .then(response => {
          expect(response).to.have.status(201);
          done();
        })
        .catch(done);
    });
    it("should have 1 tweet", function(done) {
      agent
        .get("/")
        .then(response => {
          expect(response).to.have.status(200);
          expect(response.body).to.be.lengthOf(1);
          done();
        })
        .catch(done);
    });
  });
  describe("PUT /", function() {
    it("should response with success", function(done) {
      agent
        .put("/0")
        .send({
          content: "AHH",
          username: "pknn"
        })
        .then(response => {
          expect(response).to.have.status(200);
          done();
        })
        .catch(done);
    });
    it("should have content edited", function(done) {
      agent
        .get("/")
        .then(response => {
          expect(response).to.have.status(200);
          expect(response.body[0].content).to.be.equal("AHH");
          expect(response.body[0].username).to.be.equal("pknn");
          done();
        })
        .catch(done);
    });
    it("should get bad request", function(done) {
      agent
        .put("/0")
        .send({ content: "OHH", username: "haha" })
        .then(response => {
          expect(response).to.have.status(400);
          done();
        })
        .catch(done);
    });
    it("should not edit tweet content", function(done) {
      agent
        .get("/")
        .then(response => {
          expect(response).to.have.status(200);
          expect(response.body[0].content).to.be.equal("AHH");
          expect(response.body[0].username).to.be.equal("pknn");
          done();
        })
        .catch(done);
    });
  });
  describe("DELETE /", function() {
    it("should get success", function(done) {
      agent
        .delete("/0")
        .send()
        .then(response => {
          expect(response).to.have.status(200);
          done();
        })
        .catch(done);
    });
    it("should have 0 tweet", function(done) {
      agent
        .get("/")
        .then(response => {
          expect(response).to.have.status(200);
          expect(response.body).to.have.lengthOf(0);
          done();
        })
        .catch(done);
    });
    it("should get 404 when tweet not exist", function(done) {
      agent
        .delete("/0")
        .send()
        .then(response => {
          expect(response).to.have.status(404);
          done();
        })
        .catch(done);
    });
  });
});
