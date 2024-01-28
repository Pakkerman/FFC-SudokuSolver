class SudokuSolver {
  getMatrix(puzzleString) {
    const matrix = Array.from({ length: 9 }, () => [])
    for (let i = 0; i < puzzleString.length; i++) {
      matrix[Math.floor(i / 9)].push(puzzleString[i])
    }

    return matrix
  }
  validate(puzzleString) {
    const stringRegex = /[^1-9.]+/
    if (puzzleString.length !== 81) {
      return { error: 'Expected puzzle to be 81 characters long' }
    }
    if (stringRegex.test(puzzleString)) {
      return { error: 'Invalid characters in puzzle' }
    }

    return true
  }

  checkRowPlacement(matrix, y, x, num) {
    for (let i = 0; i < 9; i++) {
      if (matrix[y][i] === num) {
        return false
      }
    }
    return true
  }

  checkColPlacement(matrix, y, x, num) {
    for (let i = 0; i < 9; i++) {
      if (matrix[i][x] === num) {
        return false
      }
    }
    return true
  }

  checkRegionPlacement(matrix, row, col, num) {
    const regionX = Math.floor(col / 3) * 3
    const regionY = Math.floor(row / 3) * 3
    for (let y = regionY; y < regionY + 3; y++) {
      for (let x = regionX; x < regionX + 3; x++) {
        if (matrix[y][x] === num) return false
      }
    }

    return true
  }

  solve(puzzleString) {
    const matrix = this.getMatrix(puzzleString)
    if (!this.validate(matrix)) return false
    const result = backtrack(matrix)
    const solvedString = matrix.map((item) => item.join('')).join('')
    return [result, solvedString]

    function backtrack(matrix) {
      const nextTile = findEmptyCell(matrix)
      if (!nextTile) return true

      const [y, x] = nextTile

      for (let num = 1; num <= 9; num++) {
        num = num.toString()
        if (isValidMove(matrix, y, x, num)) {
          matrix[y][x] = num

          if (backtrack(matrix)) return true

          matrix[y][x] = '.'
        }
      }

      return false
    }

    function isValidMove(matrix, y, x, num) {
      for (let i = 0; i < 9; i++) {
        if (matrix[y][i] === num) {
          return false
        }
      }

      for (let i = 0; i < 9; i++) {
        if (matrix[i][x] === num) {
          return false
        }
      }

      const startRow = Math.floor(y / 3) * 3
      const startCol = Math.floor(x / 3) * 3
      for (let i = startRow; i < startRow + 3; i++) {
        for (let j = startCol; j < startCol + 3; j++) {
          if (matrix[i][j] === num) {
            return false
          }
        }
      }

      return true
    }

    function findEmptyCell(matrix) {
      for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
          if (matrix[y][x] === '.') {
            return [y, x]
          }
        }
      }
      return null
    }
  }
}

module.exports = SudokuSolver
