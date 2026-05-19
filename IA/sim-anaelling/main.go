package main

import (
	"math"
	"math/rand/v2"
	"time"
)

var TMin float64 = 0.0001
var IterMax int = 100000

func checkCollisions(positions []int) int {
	collisions := 0
	rec := make([]int, len(positions))

	// colisoes de diagonal
	for i := 0; i < len(positions)-1; i++ {
		rec[positions[i]] += 1
		for j := i + 1; j < len(positions); j++ {
			if abs(i-j) == abs(positions[i]-positions[j]) {
				collisions += 1
			}
		}
	}
	rec[positions[len(positions)-1]] += 1

	// colisoes de coluna
	for i := range rec {
		if rec[i] > 1 {
			collisions += rec[i] * (rec[i] - 1) / 2
		}
	}
	return collisions
}

func intializeBoard(board []int) {
	n := len(board)
	for i := 0; i < n; i++ {
		board[i] = i
	}

	rand.Shuffle(len(board), func(i, j int) {
		board[i], board[j] = board[j], board[i]
	})
}

// gera o vizinho trocando duuas linhas aleatorias de posicao
func gerarVizinho(board []int) []int {
	vizinho := make([]int, len(board))
	copy(vizinho, board)
	n := len(board)
	linha1 := rand.IntN(n)
	linha2 := rand.IntN(n)
	for {
		if linha1 != linha2 {
			vizinho[linha1], vizinho[linha2] = vizinho[linha2], vizinho[linha1]
			return vizinho
		} else {
			linha2 = rand.IntN(n)
		}
	}
}

func simulatedAnaelling(board []int, t0 float64, TMin float64, alpha float64) ([]int, Metrics) {
	var metrics Metrics
	t := t0

	atual := make([]int, len(board))
	copy(atual, board)

	custoAtual := checkCollisions(atual)

	start := time.Now()
	for t > TMin && custoAtual > 0 && metrics.Iters <= IterMax {
		vizinho := gerarVizinho(atual)

		deltaE := checkCollisions(vizinho) - checkCollisions(atual)

		if deltaE < 0 {
			atual = vizinho
		} else {
			probabilidade := math.Exp(-float64(deltaE) / t)

			if rand.Float64() < probabilidade {
				atual = vizinho
			}
		}

		t = t * alpha
		custoAtual = checkCollisions(atual)
		metrics.Iters++
	}

	metrics.ElapsedTime = time.Since(start)
	metrics.Collisions = checkCollisions(atual)
	return atual, metrics
}

func main() {
	// se quiser rodar os testes, descomente a linha abaixo (e comente a de run)
	// benchmark()

	// debug (= true) mostra até n > 8 para nao quebrar as linhas no terminal; Se quiser aumentar o limite mude a condicao na funcao 'run'
	run(8, 5, TMin, 0.9995, true)
}
