import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';

const gql = '/graphql';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe(gql, () => {
    const post = (query) => {
      return request(app.getHttpServer()).post(gql).send({ query });
    };

    describe('users', () => {
      let newItem, length;
      it('should get all users array', () => {
        return post('{users {id username}}')
          .expect(200)
          .expect((res) => {
            expect(res.body.data.users.length).toBeDefined();
            length = res.body.data.users.length;
          });
      });

      it('should create a new user', () => {
        return post(
          'mutation {createUser(createUserInput: { username: "justfortest" }) {id, username}}',
        )
          .expect(200)
          .expect((res) => {
            expect(res.body.data.createUser.username).toEqual('justfortest');
            expect(res.body.data.createUser.id).toBeDefined();
            newItem = res.body.data.createUser;
          });
      });

      it('should get all users with the new one', () => {
        return post('{users {id username}}')
          .expect(200)
          .expect((res) => {
            expect(res.body.data.users.length).toEqual(length + 1);
            expect(res.body.data.users.pop()).toEqual(newItem);
          });
      });

      it('should get a single user', () => {
        return post(`{user(id: ${newItem.id}) {id username}}`)
          .expect(200)
          .expect((res) => {
            expect(res.body.data.user).toEqual(newItem);
          });
      });

      it('should update the new user', () => {
        return post(
          `mutation {updateUser(updateUserInput: {id: ${newItem.id}, username: "justfortestedited"}) {id, username}}`,
        )
          .expect(200)
          .expect((res) => {
            expect(res.body.data.updateUser.username).toEqual('justfortestedited');
            expect(res.body.data.updateUser.id).toBeDefined();
            newItem = res.body.data.updateUser;
          });
      });

      it('should get the updated user', () => {
        return post(`{user(id: ${newItem.id}) {id username}}`)
          .expect(200)
          .expect((res) => {
            expect(res.body.data.user).toEqual(newItem);
          });
      });

      it('should remove the new user', () => {
        return post(`mutation {removeUser(id: ${newItem.id}) {username}}`)
          .expect(200)
          .expect((res) => {
            expect(res.body.data.removeUser.username).toEqual(newItem.username);
          });
      });

      it('should get an error requesting the removed user', () => {
        return post(`{user(id: ${newItem.id}) {id username}}`)
          .expect(200)
          .expect((res) => {
            expect(res.body.data).toBeNull();
            expect(res.body.errors[0].message).toBe('Item does not exist!');
          });
      });
    });
  });
});
