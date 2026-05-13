function random(max) {
    return Math.floor(Math.random() * max);
  }
  
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// deixa as coordenadas (0,0) em baixo na esquerda
ctx.translate(0, canvas.height);
ctx.scale(1, -1);


function bezier(delta_t, b0_x, b0_y, b1_x, b1_y, b2_x, b2_y){
// so para visualizar os pontos
ctx.fillStyle = "#FF0000";
ctx.fillRect(b0_x, b0_y, 4, 4);
ctx.fillStyle = "#002fff";
ctx.fillRect(b1_x, b1_y, 4, 4);
ctx.fillStyle = "#2fff00";
ctx.fillRect(b2_x, b2_y, 4, 4);

ctx.fillStyle = "#000000";
let p_1, p_2
for(t = 0; t < 1; t+= delta_t){
    p_1 = Math.pow((1-t), 2) * b0_x + 2*t*(1-t)*b1_x + Math.pow(t, 2) * b2_x
    p_2 = Math.pow((1-t), 2) * b0_y + 2*t*(1-t)*b1_y + Math.pow(t, 2) * b2_y
    console.log(p_1, p_2)
    ctx.fillRect(p_1, p_2, 2, 2);
}
}

function criarPoligono() {
const n = 3 + random(8);
return Array.from({ length: n }, () => ({
    x: random(canvas.width),
    y: random(canvas.height),
}));
}
    
  // ctx.fillRect(0, 0, 2, 5);
bezier(0.01, 50, 100, 550, 100, 300, 50)
bezier(0.01, 200, 50, 400, 50, 300, 150)