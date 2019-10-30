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
          expect(error).to.be.null;
          expect(response).to.have.status(200);
          expect(response.body).to.have.lengthOf(0);
        });
      done();
    });
  });
});

describe("Normal state", function() {
  const agent = chai.request.agent(app);
  describe("POST /", function() {
    it("should add new tweets", function(done) {
      agent
        .post("/")
        .send({
          content: "Super bored",
          username: "pknn"
        })
        .then(response => {
          expect(response).to.have.status(201);
          agent.get("/").then(response => {
            expect(response).to.have.status(200);
            expect(response.body).to.be.lengthOf(1);
            done();
          });
        })
        .catch(error => {
          throw error;
        });
    });
  });
  describe("PUT /", function() {
    it("should edit tweet content", function(done) {
      agent
        .put("/0")
        .send({
          content: "AHH",
          username: "pknn"
        })
        .then(response => {
          expect(response).to.have.status(200);
          agent.get("/").then(response => {
            expect(response).to.have.status(200);
            expect(response.body[0].content).to.be.equal("AHH");
            expect(response.body[0].username).to.be.equal("pknn");
            done();
          });
        })
        .catch(error => {
          throw error;
        });
    });
    it("should not edit tweet content if username is not match", function(done) {
      agent
        .put("/0")
        .send({ content: "OHH", username: "haha" })
        .then(response => {
          expect(response).to.have.status(400);
          agent.get("/").then(response => {
            expect(response).to.have.status(200);
            expect(response.body[0].content).to.be.equal("AHH");
            expect(response.body[0].username).to.be.equal("pknn");
            done();
          });
        });
    });
  });
  describe("DELETE /", function() {
    it("should delete tweet", function(done) {
      agent
        .delete("/0")
        .send()
        .then(response => {
          expect(response).to.have.status(200);
          agent.get("/").then(response => {
            expect(response).to.have.status(200);
            expect(response.body).to.have.lengthOf(0);
            done();
          });
        });
    });
    it("should get 404 when tweet not exist", function(done) {
      agent
        .delete("/0")
        .send()
        .then(response => {
          expect(response).to.have.status(404);
          done();
        });
    });
  });
});
