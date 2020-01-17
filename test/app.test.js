import request from 'supertest'

import app from '../src/app'

describe("app", () => {
  let testApp
  beforeAll(() => testApp = request(app))

  describe('The cats path', () => {
    test('It should responde witb a 200 status code', async () => {
        const response = await testApp.get('/cats')
        expect(response.statusCode).toBe(200)
    })
  })

  describe('The dogs path', () => {
    test('It should responde with a 404 status code', async () => {
        const response = await testApp.get('/dogs')
        expect(response.statusCode).toBe(404)
    })
  })
})