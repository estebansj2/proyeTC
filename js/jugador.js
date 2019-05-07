/* El objeto jugador es un objeto literal que se encuentra incompleto.
 Solo tiene asignadas algunas de sus propiedades y ningun metodo */
var Jugador = {
  /* el sprite contiene la ruta de la imagen
  */
  sprite: 'imagenes/auto_rojo_abajo.png',
  x: 130,
  y: 60,
  ancho: 15,
  alto: 30,
  velocidad: 10,
  vidas: 5,
  moverse: function(x,y){
    this.x += x,
    this.y += y;
  },
  girarHorizontal : function(){
    this.alto = 15;
    this.ancho = 30;
  },
  girarVertical : function(){
    this.alto = 30;
    this.ancho = 15;
  },
  perderVidas: function(cantVidas) {
    this.vidas -= cantVidas;
  }
}
