const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app'); // 서버 애플리케이션의 경로

const expect = chai.expect;

chai.use(chaiHttp);

describe('Playlist Routes', () => {
  describe('GET /playlist/:id', () => {
    it('플레이리스트 정확 ', (done) => {
      const validPlaylistId = '64abc0d4582a1b8de6667903';

      chai
        .request(app)
        .get(`/api/playlist/${validPlaylistId}`)
        .end((err, res) => {
          expect(res).to.have.status(200); // 들어와야하는 상태코드
          expect(res.body).to.be.an('array');
          done();
        });
    });
    it('잘못된 플레이리스트 아이디', (done) => {
      const invalidPlaylistId = '2';

      chai
        .request(app)
        .get(`/api/playlist/${invalidPlaylistId}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          done();
        });
    });
  });
});
