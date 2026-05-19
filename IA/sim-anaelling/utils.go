package main

import (
	"fmt"
	"time"
)

type Metrics struct {
	Collisions  int
	Iters       int
	ElapsedTime time.Duration
}

type Media struct {
	Collisions  float64
	Iters       float64
	ElapsedTime time.Duration
}

func benchmark() {
	n := [4]int{8, 16, 32, 128}
	t0 := [3]float64{20, 5, 1}
	alpha := [3]float64{0.9995, 0.95, 0.9}

	for _, num := range n {
		fmt.Printf("------ N = %d ------\n", num)
		for j := range 3 {
			fmt.Printf("T0 = %f | Alpha = %f\n", t0[j], alpha[j])
			var media Metrics
			for range 3 {
				metrics := run(num, t0[j], TMin, alpha[j])
				media.Collisions += metrics.Collisions
				media.Iters += metrics.Iters
				media.ElapsedTime += metrics.ElapsedTime
			}
			fmt.Printf("Métricas médias (3): Collisions: %f | ETA: %s | Iterations: %f\n", float64(media.Collisions)/3, media.ElapsedTime/3, float64(media.Iters)/3)
		}
	}
}

func printBoard(positions []int) {
	for _, item := range positions {
		for j := 0; j < len(positions); j++ {
			if j == item {
				fmt.Print("R ")
			} else {
				fmt.Print("# ")
			}
		}
		fmt.Println("")
	}
}

func abs(n int) int {
	return max(n, -n)
}
