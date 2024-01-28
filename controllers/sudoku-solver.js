class SudokuSolver {
  getMatrix(puzzleString) {
    const matrix = Array.from({ length: 9 }, () => [])
    for (let i = 0; i < puzzleString.length; i++) {
      matrix[Math.floor(i / 9)].push(puzzleString[i])
    }

    console.log('\n\t-----  matrix  -----\n')
    console.log('\t    0 1 2 3 4 5 6 7 8 ')
    console.log('\t    -----------------')
    matrix.forEach((item, idx) => console.log(`\t ${idx}| ${item.join(' ')}`))
    console.log('\n\t-----  matrix  -----\n')
    return matrix
  }
  validate(matrix) {
    for (let y = 0; y < matrix.length; y++) {
      for (let x = 0; x < matrix[y].length; x++) {
        if (matrix[y][x] === '.') continue
        const validRowPlacement = this.checkRowPlacement(
          matrix,
          y,
          x,
          matrix[y][x]
        )
        const validColPlacement = this.checkColPlacement(
          matrix,
          y,
          x,
          matrix[y][x]
        )
        const validRegionPlacement = this.checkRegionPlacement(
          matrix,
          y,
          x,
          matrix[y][x]
        )
        if (!validRowPlacement || !validColPlacement || !validRegionPlacement)
          return false
      }
    }

    return true
  }

  checkRowPlacement(matrix, row, col, curr) {
    const rowValues = matrix[row].filter(
      (item, idx) => item !== '.' && idx !== col
    )

    // console.log('\t--- row values ---\n\t', rowValues.join(' '))

    if (rowValues.includes(curr)) return false
    return true
  }

  checkColPlacement(matrix, row, col, curr) {
    const colValues = matrix
      .map((item) => item[col])
      .filter((item, idx) => item !== '.' && idx !== row)
    // console.log('\t--- cow values ---\n\t', colValues.join(' '))

    if (colValues.includes(curr)) return false
    return true
  }

  checkRegionPlacement(matrix, row, col, curr) {
    const regionX = Math.floor(col / 3) * 3
    const regionY = Math.floor(row / 3) * 3
    const regionValues = []
    for (let y = regionY; y < regionY + 3; y++) {
      for (let x = regionX; x < regionX + 3; x++) {
        if (y === row && x === col) continue
        regionValues.push(matrix[y][x])
      }
    }
    // console.log('\t--- region values ---\n\t', regionValues.join(' '))

    if (regionValues.includes(curr)) return false
    return true
  }

  solve(puzzleString) {
    const matrix = this.getMatrix(puzzleString)
    if (!this.validate(matrix)) return false
    const result = backtrack(matrix)
    const solvedString = matrix.map((item) => item.join('')).join('')
    console.log('solving ', puzzleString, 'result:', result)
    return [result, solvedString]

    function backtrack(matrix) {
      const emptyCell = findEmptyCell(matrix)
      if (!emptyCell) return true

      const [row, col] = emptyCell

      for (let num = 1; num <= 9; num++) {
        num = num.toString()
        if (isValidMove(matrix, row, col, num)) {
          matrix[row][col] = num

          if (backtrack(matrix)) return true

          matrix[row][col] = '.'
        }
      }

      // If no valid number can be placed, backtrack
      return false
    }

    function isValidMove(board, row, col, num) {
      // Check if num is already in the row
      for (let i = 0; i < 9; i++) {
        if (board[row][i] === num) {
          return false
        }
      }

      // Check if num is already in the column
      for (let i = 0; i < 9; i++) {
        if (board[i][col] === num) {
          return false
        }
      }

      // Check if num is already in the 3x3 box
      const startRow = Math.floor(row / 3) * 3
      const startCol = Math.floor(col / 3) * 3
      for (let i = startRow; i < startRow + 3; i++) {
        for (let j = startCol; j < startCol + 3; j++) {
          if (board[i][j] === num) {
            return false
          }
        }
      }

      return true
    }

    function findEmptyCell(board) {
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (board[row][col] === '.') {
            return [row, col]
          }
        }
      }
      return null // If there are no empty cells
    }
  }

  // return this.validate(puzzleString)
}

module.exports = SudokuSolver
