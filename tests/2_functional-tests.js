const chai = require('chai')
const chaiHttp = require('chai-http')
const assert = chai.assert
const server = require('../server')

chai.use(chaiHttp)

const validPuzzle =
  '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
const unsolvablePuzzle =
  '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.1'
const invalidCharPuzzle =
  '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.a'
const invalidLengthPuzzle = '1234567'

suite('Functional Tests', () => {
  suite('POST /api/solve', () => {
    test('A valid puzzle string', (done) => {
      // Solve a puzzle with valid puzzle string: POST request to /api/solve
      const input = { puzzle: validPuzzle }
      const expected = {
        solution:
          '769235418851496372432178956174569283395842761628713549283657194516924837947381625',
      }
      chai
        .request(server)
        .post('/api/solve')
        .send(input)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.deepEqual(res.body, expected)
          done()
        })
    })
    test('Missing input string', (done) => {
      // Solve a puzzle with missing puzzle string: POST request to /api/solve
      const expected = { error: 'Required field missing' }
      chai
        .request(server)
        .post('/api/solve')
        .send({})
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.deepEqual(res.body, expected)
          done()
        })
    })
    test('A puzzle string with invalid char', (done) => {
      // Solve a puzzle with invalid characters: POST request to /api/solve
      const input = { puzzle: invalidCharPuzzle }
      const expected = { error: 'Invalid characters in puzzle' }

      chai
        .request(server)
        .post('/api/solve')
        .send(input)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.deepEqual(res.body, expected)
          done()
        })
    })
    test('A puzzle string with invalid length', (done) => {
      // Solve a puzzle with incorrect length: POST request to /api/solve
      const input = { puzzle: invalidLengthPuzzle }
      const expected = { error: 'Expected puzzle to be 81 characters long' }

      chai
        .request(server)
        .post('/api/solve')
        .send(input)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.deepEqual(res.body, expected)
          done()
        })
    })
    test('A unsolvable puzzle', (done) => {
      // Solve a puzzle that cannot be solved: POST request to /api/solve
      const input = { puzzle: unsolvablePuzzle }
      const expected = { error: 'Puzzle cannot be solved' }

      chai
        .request(server)
        .post('/api/solve')
        .send(input)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.deepEqual(res.body, expected)
          done()
        })
    })
  })

  suite('POST /api/check', () => {
    test('With all valid fields', (done) => {
      // Check a puzzle placement with all fields: POST request to /api/check
      const input = { puzzle: validPuzzle, coordinate: 'A1', value: 7 }
      chai
        .request(server)
        .post('/api/check')
        .send(input)
        .end((err, res) => {
          assert.equal(res.status, 200)
          done()
        })
    })
    test('With one conflict', (done) => {
      // Check a puzzle placement with single placement conflict: POST request to /api/check
      const input = { puzzle: validPuzzle, coordinate: 'A2', value: '1' }
      const expected = { valid: false, conflict: ['row'] }
      chai
        .request(server)
        .post('/api/check')
        .send(input)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.deepEqual(res.body, expected)
          done()
        })
    })
    test('With two conflict', (done) => {
      // Check a puzzle placement with multiple placement conflicts: POST request to /api/check
      const input = { puzzle: validPuzzle, coordinate: 'A1', value: '9' }
      const expected = { valid: false, conflict: ['row', 'region'] }
      chai
        .request(server)
        .post('/api/check')
        .send(input)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.deepEqual(res.body, expected)
          done()
        })
    })
    test('With three conflict', (done) => {
      // Check a puzzle placement with all placement conflicts: POST request to /api/check
      const input = { puzzle: validPuzzle, coordinate: 'A2', value: '9' }
      const expected = { valid: false, conflict: ['row', 'column', 'region'] }
      chai
        .request(server)
        .post('/api/check')
        .send(input)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.deepEqual(res.body, expected)
          done()
        })
    })
    test('With missing fields', (done) => {
      // Check a puzzle placement with missing required fields: POST request to /api/check
      const input = { coordinate: 'A2', value: '9' }
      const expected = { error: 'Required field(s) missing' }
      chai
        .request(server)
        .post('/api/check')
        .send(input)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.deepEqual(res.body, expected)
          done()
        })
    })
    test('With an invalid character in puzzle', (done) => {
      // Check a puzzle placement with invalid characters: POST request to /api/check
      const input = { puzzle: invalidCharPuzzle, coordinate: 'A2', value: '9' }
      const expected = { error: 'Invalid characters in puzzle' }
      chai
        .request(server)
        .post('/api/check')
        .send(input)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.deepEqual(res.body, expected)
          done()
        })
    })
    test('With incorrect length puzzle ', (done) => {
      // Check a puzzle placement with incorrect length: POST request to /api/check
      const input = {
        puzzle: invalidLengthPuzzle,
        coordinate: 'A2',
        value: '9',
      }
      const expected = { error: 'Expected puzzle to be 81 characters long' }
      chai
        .request(server)
        .post('/api/check')
        .send(input)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.deepEqual(res.body, expected)
          done()
        })
    })
    test('With an invalid coordinate', (done) => {
      // Check a puzzle placement with invalid placement coordinate: POST request to /api/check
      const input = {
        puzzle: validPuzzle,
        coordinate: 'J0',
        value: '9',
      }
      const expected = { error: 'Invalid coordinate' }
      chai
        .request(server)
        .post('/api/check')
        .send(input)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.deepEqual(res.body, expected)
          done()
        })
    })
    test('With invalid placement of a value', (done) => {
      // Check a puzzle placement with invalid placement value: POST request to /api/check
      const input = {
        puzzle: validPuzzle,
        coordinate: 'A1',
        value: '0',
      }
      const expected = { error: 'Invalid value' }
      chai
        .request(server)
        .post('/api/check')
        .send(input)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.deepEqual(res.body, expected)
          done()
        })
    })
  })
})
