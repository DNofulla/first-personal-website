var assert = require("assert");
var app = require("../server");
var request = require("supertest");

describe("Server", () => {
  describe("GET Users", () => {
    it("should return HTTP OK!", (done) => {
      request(app)
        .get("/")
        .expect(200)
        .end((err, res) => {
          done();
        });
    });
    it("should return all Users", (done) => {
      request(app)
        .get("/")
        .expect("object")
        .end((err, res) => {
          done();
        });
    });
  });
  describe("GET Pokemon", () => {
    it("should return Pokemon API HTTP OK!", (done) => {
      request(app)
        .get("/api/pokemon/3")
        .expect(200)
        .end((err, res) => {
          done();
        });
    });
    it("should return the third pokemon in the pokedex", (done) => {
      request(app)
        .get("/api/pokemon/3")
        .expect("object")
        .end((err, res) => {
          done();
        });
    });
  });
});
