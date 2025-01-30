var peliHahmo;
var laatat = []
var pisteet;

//pelin käynnistys
function aloitaPeli() {
    peliHahmo = new Komponentti();
    pisteet = new Komponentti();
    peliAlue.aloita();
}

//canvas
var peliAlue = {
    canvas : document.createElement('canvas'),
    aloita : function() {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext('2d');
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
}
}

//komponentti konstruktori
function Komponentti() {

}

//pelialueen päivitys
function paivitaPeliAlue() {

}