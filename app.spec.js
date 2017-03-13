const should = require('should');
const request = require('supertest');
const app = require('./app');

describe('GET /users', () => {
  describe('success', ()=> {
    it('유저 객체를 담은 배열을 응답한다', (done)=> {
      request(app)
          .get('/users?limit=3&offset=0')
          .end((err, res) => {
            res.body.should.be.instanceof(Array);
            res.body.forEach(user => {
              user.should.have.properties('id','name');
            })
            done();
          })
    });
    it('최대 limit 갯수만큼 응답한다', (done)=> {
      request(app)
          .get('/users?limit=2&offset=0')
          .end((err, res) => {
            res.body.should.be.instanceof(Array).with.have.lengthOf(2);
            done();
          });
    });

  });
  describe('fail', ()=> {
      it('limit이 숫자형이 아니면 400을 응답한다', done=> {
        request(app)
            .get('/users?limit=two')
            .expect(400)
            .end(done)
      })
      it('offset이 숫자형이 아니면 400을 응답한다', done=> {
        request(app)
            .get('/users?limit=2&offset=one')
            .expect(400)
            .end(done)
      })
    })
});
describe('GET /users/:id', ()=>{
  describe('success', ()=>{
    it('id가 1인 유저 객체를 반환한다', done=>{
      request(app)
          .get('/users/1')
          .expect(200)
          .end((err, res)=>{
            res.body.should.have.properties('id','name');
            res.body.id.should.be.equal(1);
            done();
          })
    })
  });
  describe('fail', ()=>{
    it('id가 숫자가 아닐경우 400으로 응답한다', done=>{
      request(app)
          .get('/users/one')
          .expect(400)
          .end(done);
    });
    it('id로 유저를 찾을수 없을 경우 404로 응답한다', done=>{
      request(app)
          .get('/users/4')
          .expect(404)
          .end(done);
    })
  });
});
describe('POST /users', ()=>{
  describe('success', ()=>{
    let _res;
    const name = 'daniel';
    before(done=>{
      request(app)
          .post('/users')
          .send({name})
          .end((err, res) => {
            _res = res;
            done();
          });
    });
    it('생성된 유저 객체를 반환한다', ()=>{
      _res.body.should.have.properties('id', 'name');
    })
    it('입력한 name을 반환한다', ()=>{
      _res.body.name.should.be.equal(name)
    })
  });
  describe('fail', ()=>{
    it('name 파라매터 누락시 400을 반환한다', done=>{
      request(app)
          .post('/users')
          .send({})
          .expect(400)
          .end(done);
    });
    it('name이 중복일 경우 409를 반환한다', done=>{
      request(app)
          .post('/users')
          .send({name: 'Alice'})
          .expect(409)
          .end(done);
    })
  })
})
describe('PUT /users/:id', ()=>{
  describe('success', ()=>{
    it('변경된 정보를 응답한다', done=>{
      const name = 'Adel';
      request(app)
          .put('/users/1')
          .send({name})
          .end((err, res) => {
            res.body.name.should.be.equal(name);
            done();
          });
    });
  })
  describe('fail', ()=>{
    it('정수가 아닌 id일 경우 400 응답', done=>{
      request(app)
          .put('/users/one')
          .expect(400)
          .end(done);
    })
    it('name이 없을 경우 400 응답', done=>{
      request(app)
          .put('/users/1')
          .send({})
          .expect(400)
          .end(done);
    });
    it('없는 유저일 경우 404 응답', done=>{
      request(app)
          .put('/users/999')
          .send({name: 'Golf'})
          .expect(404)
          .end(done);
    });
    it('이름이 중복일 경우 409 응답', done=>{
      request(app)
          .put('/users/2')
          .send({name: 'Chris'})
          .expect(409)
          .end(done);
    });
  })
})
describe('DELETE /users/:id', ()=>{
  describe('success', ()=>{
    it('204를 응답한다', done=>{
      request(app)
          .delete('/users/1')
          .expect(204)
          .end(done);
    })
  });
  describe('fail', ()=>{
    it('id가 숫자가 아닐경우 400으로 응답한다', done=>{
      request(app).delete('/users/one')
          .expect(400).end(done);
    });
  });
})
