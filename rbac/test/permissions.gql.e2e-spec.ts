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

    describe('permissions', () => {
      let newItem, length;
      it('should get all permissions array', () => {
        return post('{permissions {id name}}')
          .expect(200)
          .expect((res) => {
            expect(res.body.data.permissions.length).toBeDefined();
            length = res.body.data.permissions.length;            
          });
      });

      it('should create a new permission', () => {
        return post(
          'mutation {createPermission(createPermissionInput: {name: "justfortest"}) {id, name}}',
        )
          .expect(200)
          .expect((res) => {
            expect(res.body.data.createPermission.name).toEqual('justfortest');
            expect(res.body.data.createPermission.id).toBeDefined();
            newItem = res.body.data.createPermission;
          });
      });

      it('should get all permissions with the new one', () => {
        return post('{permissions {id name}}')
          .expect(200)
          .expect((res) => {
            expect(res.body.data.permissions.length).toEqual(length + 1);
          });
      });

      it('should get a single permission', () => {
        return post(`{permission(id: ${newItem.id}) {id name}}`)
          .expect(200)
          .expect((res) => {
            expect(res.body.data.permission).toEqual(newItem);
          });
      });

      it('should update the new permission', () => {
        return post(
          `mutation {updatePermission(updatePermissionInput: {id: ${newItem.id}, name: "justfortestedited"}) {id, name}}`,
        )
          .expect(200)
          .expect((res) => {
            expect(res.body.data.updatePermission.name).toEqual(
              'justfortestedited',
            );
            expect(res.body.data.updatePermission.id).toBeDefined();
            newItem = res.body.data.updatePermission;
          });
      });

      it('should get the updated permission', () => {
        return post(`{permission(id: ${newItem.id}) {id name}}`)
          .expect(200)
          .expect((res) => {
            expect(res.body.data.permission).toEqual(newItem);
          });
      });

      it('should remove the new permission', () => {
        return post(`mutation {removePermission(id: ${newItem.id}) {name}}`)
          .expect(200)
          .expect((res) => {
            expect(res.body.data.removePermission.name).toEqual(newItem.name);
          });
      });

      it('should get an error requesting the removed permission', () => {
        return post(`{permission(id: ${newItem.id}) {id name}}`)
          .expect(200)
          .expect((res) => {
            expect(res.body.data).toBeNull();
            expect(res.body.errors[0].message).toBe('Item does not exist!');
          });
      });
    });
  });
});
