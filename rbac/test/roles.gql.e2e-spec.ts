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

    describe('roles', () => {
      let newRole, length;
      it('should get all roles array', () => {
        return post('{roles {id name}}')
          .expect(200)
          .expect((res) => {
            expect(res.body.data.roles.length).toBeDefined();
            length = res.body.data.roles.length;
          });
      });

      it('should create a new role', () => {
        return post('mutation {createRole(name: "justfortest") {id, name}}')
          .expect(200)
          .expect((res) => {
            expect(res.body.data.createRole.name).toEqual('justfortest');
            expect(res.body.data.createRole.id).toBeDefined();
            newRole = res.body.data.createRole;
          });
      });

      it('should get all roles with the new one', () => {
        return post('{roles {id name}}')
          .expect(200)
          .expect((res) => {
            expect(res.body.data.roles.length).toEqual(length + 1);
            expect(res.body.data.roles.pop()).toEqual(newRole);
          });
      });

      it('should get a single role', () => {
        return post(`{role(id: ${newRole.id}) {id name}}`)
          .expect(200)
          .expect((res) => {
            expect(res.body.data.role).toEqual(newRole);
          });
      });

      it('should update the new role', () => {
        return post(
          `mutation {updateRole(id: ${newRole.id}, name: "justfortestedited") {id, name}}`,
        )
          .expect(200)
          .expect((res) => {
            expect(res.body.data.updateRole.name).toEqual('justfortestedited');
            expect(res.body.data.updateRole.id).toBeDefined();
            newRole = res.body.data.updateRole;
          });
      });

      it('should get the updated role', () => {
        return post(`{role(id: ${newRole.id}) {id name}}`)
          .expect(200)
          .expect((res) => {
            expect(res.body.data.role).toEqual(newRole);
          });
      });

      it('should remove the new role', () => {
        return post(`mutation {removeRole(id: ${newRole.id}) {name}}`)
          .expect(200)
          .expect((res) => {
            expect(res.body.data.removeRole.name).toEqual(newRole.name);
          });
      });

      it('should get an error requesting the removed role', () => {
        return post(`{role(id: ${newRole.id}) {id name}}`)
          .expect(200)
          .expect((res) => {
            expect(res.body.data).toBeNull();
            expect(res.body.errors[0].message).toBe('Item does not exist!');
          });
      });
    });
  });
});
