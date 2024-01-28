'use strict'

const SudokuSolver = require('../controllers/sudoku-solver.js')

module.exports = function (app) {
  let solver = new SudokuSolver()

  app.route('/api/check').post((req, res) => {
    const { puzzle, coordinate, value } = req.body

    if (!puzzle || !coordinate || !value) {
      return res.json({ error: 'Required field(s) missing' })
    }

    const validate = solver.validate(puzzle)
    if (validate != true) return res.json(validate)

    const coordinateRegex = /^[A-Ia-i]{1}[1-9]{1}$/
    if (!coordinateRegex.test(req.body.coordinate)) {
      return res.json({ error: 'Invalid coordinate' })
    }

    const valueRegex = /^[1-9]{1}$/
    if (!valueRegex.test(value)) {
      return res.json({ error: 'Invalid value' })
    }

    const [row, col] = coordinate.split('')
    const y = row.toLowerCase().charCodeAt(0) - 97
    const x = +col - 1

    const matrix = solver.getMatrix(puzzle)
    const conflict = []

    if (!solver.checkRowPlacement(matrix, y, x, value)) conflict.push('row')
    if (!solver.checkColPlacement(matrix, y, x, value)) conflict.push('column')
    if (!solver.checkRegionPlacement(matrix, y, x, value))
      conflict.push('region')

    if (conflict.length !== 0) return res.json({ valid: false, conflict })
    return res.json({ valid: true })
  })

  app.route('/api/solve').post((req, res) => {
    const puzzle = req.body.puzzle
    if (!puzzle) return res.json({ error: 'Required field missing' })

    const validate = solver.validate(puzzle)
    if (validate != true) return res.json(validate)

    const matrix = solver.getMatrix(puzzle)
    if (!solver.validate(matrix))
      return res.json({ error: 'Puzzle cannot be solved' })

    const [isSolved, solvedString] = solver.solve(puzzle)
    if (!isSolved) return res.json({ error: 'Puzzle cannot be solved' })

    return res.json({ solution: solvedString })
  })
}
