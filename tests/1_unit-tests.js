const chai = require('chai')
const assert = chai.assert

const Solver = require('../controllers/sudoku-solver.js')
let solver = new Solver()

const validPuzzle =
  '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
const unsolvablePuzzle =
  '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.1'
const invalidCharPuzzle =
  '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.a'
const invalidLengthPuzzle = '1234567'

suite('Unit Tests', () => {
  suite('Solver.validate()', () => {
    test('a valid puzzle', (done) => {
      // Logic handles a valid puzzle string of 81 characters
      const input = validPuzzle
      const result = solver.validate(input)
      const expected = true
      assert.equal(expected, result)
      done()
    })

    test('a invalid puzzle with invalid char', (done) => {
      // Logic handles a puzzle string with invalid characters (not 1-9 or .)
      const input = invalidCharPuzzle
      const result = solver.validate(input)
      const expected = { error: 'Invalid characters in puzzle' }
      assert.deepEqual(expected, result)
      done()
    })
    test('an invalid string that is not 81 characters', (done) => {
      // Logic handles a puzzle string that is not 81 characters in length
      const input = invalidLengthPuzzle
      const result = solver.validate(input)
      const expected = { error: 'Expected puzzle to be 81 characters long' }
      assert.deepEqual(expected, result)
      done()
    })
  })
  suite('Solver.CheckRowPlacement()', () => {
    test('check valid row placement', (done) => {
      // Logic handles a valid row placement
      const input = solver.getMatrix(validPuzzle)
      const result = solver.checkRowPlacement(input, 0, 0, '7')
      const expected = true
      assert.equal(result, expected)
      done()
    })
    test('check invalid row placement', (done) => {
      // Logic handles an invalid row placement
      const input = solver.getMatrix(validPuzzle)
      const result = solver.checkRowPlacement(input, 0, 0, '1')
      const expected = false
      assert.equal(result, expected)
      done()
    })
  })
  suite('Solver.checkColPlacement', () => {
    test('check valid col placement', (done) => {
      // Logic handles a valid column placement
      const input = solver.getMatrix(validPuzzle)
      const result = solver.checkColPlacement(input, 0, 0, '7')
      const expected = true
      assert.equal(result, expected)
      done()
    })
    // Logic handles an invalid column placement
    test('check invalid col placement', (done) => {
      // Logic handles a valid column placement
      const input = solver.getMatrix(validPuzzle)
      const result = solver.checkColPlacement(input, 0, 0, '5')
      const expected = false
      assert.equal(result, expected)
      done()
    })
  })

  suite('Solver.checkRegionPlacement', () => {
    test('check valid region placement', (done) => {
      // Logic handles a valid region (3x3 grid) placement
      const input = solver.getMatrix(validPuzzle)
      const result = solver.checkRegionPlacement(input, 0, 0, '7')
      const expected = true
      assert.equal(result, expected)
      done()
    })
    test('check invalid region placement', (done) => {
      // Logic handles an invalid region (3x3 grid) placement
      const input = solver.getMatrix(validPuzzle)
      const result = solver.checkRegionPlacement(input, 0, 0, '4')
      const expected = false
      assert.equal(result, expected)
      done()
    })
  })
  suite('Solver.solve()', () => {
    test('solver a valid puzzle', (done) => {
      // Valid puzzle strings pass the solver
      const input = validPuzzle
      const result = solver.solve(input)
      const expected = [
        true,
        '769235418851496372432178956174569283395842761628713549283657194516924837947381625',
      ]

      assert.deepEqual(result, expected)
      done()
    })
    test('solver a valid puzzle', (done) => {
      // Invalid puzzle strings fail the solver
      const input = unsolvablePuzzle
      const result = solver.solve(input)
      const expected = [false, unsolvablePuzzle]
      assert.deepEqual(result, expected)
      done()
    })
    test('solver a valid puzzle', (done) => {
      // Solver returns the expected solution for an incomplete puzzle
      const input = validPuzzle
      const result = solver.solve(input)
      const expected = [
        true,
        '769235418851496372432178956174569283395842761628713549283657194516924837947381625',
      ]

      assert.deepEqual(result, expected)
      done()
    })
  })
})
