/* El objeto Juego sera el encargado del control de todo el resto de los Objetos
existentes.
Le dara ordenes al Dibujante para que dibuje entidades en la pantalla. Cargara
el mapa, chequeara colisiones entre los objetos y actualizara sus movimientos
y ataques. Gran parte de su implementacion esta hecha, pero hay espacios con el
texto COMPLETAR que deben completarse segun lo indique la consigna.

El objeto Juego contiene mucho codigo. Tomate tu tiempo para leerlo tranquilo
y entender que es lo que hace en cada una de sus partes. */

$(document).ready(function(){
  $.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null) {
       return null;
    }
    return decodeURI(results[1]) || 0;
  }

  const nivel = $.urlParam('nivel')

  var Juego = {
    anchoCanvas: 961,
    altoCanvas: 577,
    jugador: Jugador,
    vidasInicial: Jugador.vidas,
    ganador: false,
    bordes: [
      // // Bordes
      new Obstaculo('', 0, 5, 961, 18, 0),
      new Obstaculo('', 0, 559, 961, 18, 0),
      new Obstaculo('', 0, 5, 18, 572, 0),
      new Obstaculo('', 943, 5, 18, 572, 0),
      // Veredas
      new Obstaculo('', 18, 23, 51, 536, 2),
      new Obstaculo('', 69, 507, 690, 52, 2),
      new Obstaculo('', 587, 147, 173, 360, 2),
      new Obstaculo('', 346, 147, 241, 52, 2),
      new Obstaculo('', 196, 267, 263, 112, 2),
      new Obstaculo('', 196, 23, 83, 244, 2),
      new Obstaculo('', 279, 23, 664, 56, 2),
      new Obstaculo('', 887, 79, 56, 480, 2),
    ]
  }

  Juego.iniciarRecursos = function() {
    Resources.load([
      'imagenes/mapa.png',
      'imagenes/mensaje_gameover.png',
      'imagenes/Splash.png',
      'imagenes/bache.png',
      'imagenes/tren_horizontal.png',
      'imagenes/tren_vertical.png',
      'imagenes/valla_horizontal.png',
      'imagenes/valla_vertical.png',
      'imagenes/zombie1_izquierda.png',
      'imagenes/zombie2_izquierda.png',
      "imagenes/zombie1_abajo.png",
      'imagenes/zombie3_izquierda.png',
      'imagenes/zombie4_izquierda.png',
      'imagenes/zombie1_derecha.png',
      'imagenes/zombie2_derecha.png',
      'imagenes/zombie3_derecha.png',
      'imagenes/zombie4_derecha.png',
      'imagenes/auto_rojo_abajo.png',
      'imagenes/auto_rojo_arriba.png',
      'imagenes/auto_rojo_derecha.png',
      'imagenes/auto_rojo_izquierda.png',
      'imagenes/auto_verde_abajo.png',
      'imagenes/auto_verde_derecha.png',
      'imagenes/auto_verde_izquierda.png',
      "imagenes/meta.png"
    ]);
    Resources.onReady(this.comenzar.bind(Juego, nivel));
  };

  Juego.chequearEstadoNiveles = function() {
    if(nivel == null) {
      window.location.href = "?nivel=1"
    }
  }

  Juego.getObstaculosCarretera = function() {
    return niveles[this.nivel].obstaculosCarretera
  }

  Juego.getEnemigos = function() {
    return niveles[this.nivel].enemigos
  }

  Juego.obstaculos = function() {
    return this.getObstaculosCarretera().concat(this.bordes);
  };

  Juego.comenzar = function(nivel) {
    Dibujante.inicializarCanvas(this.anchoCanvas, this.altoCanvas);
    this.nivel = nivel
    this.buclePrincipal();

  };

  Juego.buclePrincipal = function() {
    this.update();
    this.dibujar();
    window.requestAnimationFrame(this.buclePrincipal.bind(this));
  };

  Juego.update = function() {
    this.calcularAtaques();
    this.moverEnemigos();
  }

  Juego.capturarMovimiento = function(tecla) {
    var movX = 0;
    var movY = 0;
    var velocidad = this.jugador.velocidad;

    // El movimiento esta determinado por la velocidad del jugador
    if (tecla == 'izq') {
      movX = -velocidad,
      Jugador.sprite = 'imagenes/auto_rojo_izquierda.png', 
      Jugador.girarHorizontal();
    }
    if (tecla == 'arriba') {
      movY = -velocidad,
      Jugador.sprite = 'imagenes/auto_rojo_arriba.png',
      Jugador.girarVertical();
    }
    if (tecla == 'der') {
      movX = velocidad,
      Jugador.sprite = 'imagenes/auto_rojo_derecha.png',
      Jugador.girarHorizontal();    
    }

    if (tecla == 'abajo') {
      movY = velocidad,
      Jugador.sprite ='imagenes/auto_rojo_abajo.png',
      Jugador.girarVertical();
    }

    if (tecla == 'esc') {
      Menu.abrirMenu();
    }

    if (this.chequearColisiones(movX + this.jugador.x, movY + this.jugador.y)) {
      Jugador.moverse(movX,movY);
    }
  }

  Juego.dibujar = function() {
    Dibujante.borrarAreaDeJuego();
    this.dibujarFondo();

    Dibujante.dibujarEntidad(Jugador);

    this.getObstaculosCarretera().forEach(function(obstaculo) {
      Dibujante.dibujarEntidad(obstaculo);
    });

    this.getEnemigos().forEach(function(enemigo) {
      Dibujante.dibujarEntidad(enemigo);
    });

    var tamanio = this.anchoCanvas / this.vidasInicial;
    Dibujante.dibujarRectangulo('white', 0, 0, this.anchoCanvas, 8);
    for (var i = 0; i < this.jugador.vidas; i++) {
      var x = tamanio * i
      Dibujante.dibujarRectangulo('red', x, 0, tamanio, 8);
    }
     Dibujante.dibujarImagen('imagenes/meta.png',760, 543, 126, 20);
  };

  Juego.moverEnemigos = function() {
    this.getEnemigos().forEach(function(enemigo) {
      enemigo.mover();
    })
  };

  Juego.calcularAtaques = function() {
    this.getEnemigos().forEach(function(enemigo) {
      if (this.intersecan(enemigo, this.jugador, this.jugador.x, this.jugador.y)) {
        enemigo.comenzarAtaque(this.jugador);
      } else {
        enemigo.dejarDeAtacar();
      }
    }, this);
  };

  Juego.chequearColisiones = function(x, y) {
    var puedeMoverse = true
    this.obstaculos().forEach(function(obstaculo) {
      if (this.intersecan(obstaculo, this.jugador, x, y)) {
        obstaculo.chocar(Jugador)

        puedeMoverse = false
      }
    }, this)
    return puedeMoverse
  };

  Juego.intersecan = function(elemento1, elemento2, x, y) {
    var izquierda1 = elemento1.x
    var derecha1 = izquierda1 + elemento1.ancho
    var techo1 = elemento1.y
    var piso1 = techo1 + elemento1.alto
    var izquierda2 = x
    var derecha2 = izquierda2 + elemento2.ancho
    var techo2 = y
    var piso2 = y + elemento2.alto

    return ((piso1 >= techo2) && (techo1 <= piso2) &&
      (derecha1 >= izquierda2) && (izquierda1 <= derecha2))
  };

  Juego.dibujarFondo = function(jugador) {
    if (this.terminoJuego()) {
      Juego.borrarObjetosJuego();
      Dibujante.dibujarImagen('imagenes/mensaje_gameover.png', 0, 5, this.anchoCanvas, this.altoCanvas);
      document.getElementById('reiniciar').style.visibility = 'visible';
    }

    else if (this.ganoJuego()) {
      Juego.borrarObjetosJuego();
      Dibujante.dibujarImagen('imagenes/Splash.png', 190, 113, 500, 203);
      document.getElementById('reiniciar').style.visibility = 'visible';
    } else {
      Dibujante.dibujarImagen('imagenes/mapa.png', 0, 5, this.anchoCanvas, this.altoCanvas);
    }
  };

  Juego.terminoJuego = function() {
    return this.jugador.vidas <= 0;
  };

  Juego.borrarObjetosJuego = function() {
    Jugador.ancho = 0;
    Jugador.alto = 0;
    this.getEnemigos = [];
    this.getObstaculosCarretera = [];
  } 


  /* Se gana el juego si se sobre pasa cierto altura y */
  Juego.ganoJuego = function() {
    if(this.jugador.y + this.jugador.alto > 543) {
      if (nivel == "1") {
        window.location.href = "juego.html?nivel=2";      
      }else if (nivel == "2") {
        return this.jugador.y + this.jugador.alto > 543
      }
    }
  }

  Juego.iniciarRecursos();
  Juego.chequearEstadoNiveles();

  // Activa las lecturas del teclado al presionar teclas
  // Documentacion: https://developer.mozilla.org/es/docs/Web/API/EventTarget/addEventListener
  document.addEventListener('keydown', function(e) {
    var allowedKeys = {
      27: 'esc',
      37: 'izq',
      38: 'arriba',
      39: 'der',
      40: 'abajo'
  };
   
    Juego.capturarMovimiento(allowedKeys[e.keyCode]);
  });
});

