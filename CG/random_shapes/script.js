function random(max){
    return Math.floor(Math.random() * max);
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
    
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
ctx.fillStyle = `#1`;

// deixa as coordenadas (0,0) em baixo na esquerda
ctx.translate(0, canvas.height);
ctx.scale(1, -1);

function desenharPontos(x, y, xc, yc, px){
    ctx.fillRect(x+xc, y+yc, px, px);
    ctx.fillRect(x-xc, y+yc, px, px);
    ctx.fillRect(x+xc, y-yc, px, px);
    ctx.fillRect(x-xc, y-yc, px, px);

    ctx.fillRect(x+yc, y+xc, px, px);
    ctx.fillRect(x-yc, y+xc, px, px);
    ctx.fillRect(x+yc, y-xc, px, px);
    ctx.fillRect(x-yc, y-xc, px, px);
}

function circBrasenham(x, y, r){
    let yc = r
    let xc = 0
    ctx.fillRect(xc, yc, 2, 2);

    let d = 3 - 2*r
    while(xc <= yc){
        if(d < 0){
            d = d+4*xc+6
            desenharPontos(x, y, xc, yc, 2)
        } else{
            d = d+4 * (xc - yc)+10
            yc = yc - 1
            desenharPontos(x, y, xc, yc, 2)
        }
        xc = xc+1;
    }
}
ctx.fillStyle = `rgba(${random(255)}, ${random(255)}, ${random(255)}, 1)`;
circBrasenham(random(255),random(255),random(100))

function linhaDDA(x1, y1, x2, y2){
    const m = (x1 - x2)/(y1 - y2);
    for(let x = Math.min(x1, x2); x < Math.max(x1, x2); x++){
        y = y1 + m*(x - x1);
        ctx.fillRect(x, y, 1, 1);
    }
}

ctx.fillStyle = `rgba(${random(255)}, ${random(255)}, ${random(255)}, 1)`;
linhaDDA(random(550), random(550), random(550), random(550))



// https://www.geeksforgeeks.org/computer-graphics/dda-line-generation-algorithm-computer-graphics/