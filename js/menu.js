var audio = new Audio("audio/8bitxsong.mp3")
var Menu = {
	abrirMenu: function() {
    	$("#modal-principal").css('visibility', 'visible');
    	$("#bg-modal").css('visibility', 'visible');
    	$("#modal-niveles").css('visibility', 'hidden');	
	},
	audioReproducir: function () {
		return audio.paused ? audio.play() : audio.pause();
	},
	cerrarMenu: function() {
		$("#modal-principal").css('visibility', 'hidden');
		$("#bg-modal").css('visibility', 'hidden');
		$("#modal-niveles").css('visibility', 'hidden');
	},
	abrirNiveles: function() {
		$("#modal-principal").css('visibility', 'hidden');
		$("#modal-niveles").css('visibility', 'visible');
	},
	abrirInstrucciones: function() {
		$("#modal-principal").css('visibility', 'hidden');
		$("#modal-instruccion").css('visibility', 'visible');
	}
}


$(document).ready(function() {	
	$(".volverAlJuego").click(Menu.cerrarMenu)
	$(".niveles").click(Menu.abrirNiveles)
	$(".musica").click(Menu.audioReproducir)
})

