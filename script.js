var peliHahmo;
var laatat = []
var pisteet;

//pelin käynnistys
function aloitaPeli() {
    peliHahmo = new Komponentti(30, 30, 'red', 10, 120);
    //pisteet = new Komponentti();
    peliAlue.aloita();
}

//canvas
var peliAlue = {
    canvas : document.createElement('canvas'),
    aloita : function() {
        this.canvas.width = 270;
        this.canvas.height = 480;
        this.context = this.canvas.getContext('2d');
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    }
}

//komponentti konstruktori
function Komponentti(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    ctx = peliAlue.context;
    ctx.fillStyle = color;
    ctx.fillRect(this.x, this.y, this.width, this.height)
}

//pelialueen päivitys
function paivitaPeliAlue() {

}