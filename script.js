var peliHahmo;
var laatat = []
var pisteet;

//pelin käynnistys
function aloitaPeli() {
    peliAlue.aloita();
    peliHahmo = new Komponentti(30, 30, 'red', 10, 300);
    pisteet = new Komponentti("30px", "Consolas", "black", 280, 40, "text");
    
}

//canvas
var peliAlue = {
    canvas : document.createElement('canvas'),
    aloita : function() {
        this.canvas.width = 270;
        this.canvas.height = 480;
        this.context = this.canvas.getContext('2d');
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(paivitaPeliAlue, 20);
        window.addEventListener('keydown', function (e) {
            peliAlue.avaimet = (peliAlue.avaimet || []);
            peliAlue.avaimet[e.key] = true
        })
        window.addEventListener('keyup', function (e) {
            peliAlue.avaimet[e.key] = false;
        })
        
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        clearInterval(this.interval);
    }
}

//komponentti konstruktori
function Komponentti(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.speedX = 0;
    this.speedY = 0;
    this.gravity = 0.3
    this.gravitySpeed = 0;
    this.bounce = 1
    ctx = peliAlue.context;
    ctx.fillStyle = color;
    ctx.fillRect(this.x, this.y, this.width, this.height)
    this.update = function() {
        ctx = peliAlue.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;        
    }
    this.pomppu = function() {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;  
        this.hitBottom()      
    }
    this.hitBottom = function() {
        var rockbottom = peliAlue.canvas.height - this.height;
        if (this.y > rockbottom) {
          this.y = rockbottom;
          this.gravitySpeed = -(this.gravitySpeed * this.bounce);
        }
    }
}

//pelialueen päivitys
function paivitaPeliAlue() {
    peliAlue.clear();
    peliHahmo.speedX = 0;
    if (peliAlue.avaimet && peliAlue.avaimet['ArrowRight']) {peliHahmo.speedX = 1;}
    if (peliAlue.avaimet && peliAlue.avaimet['ArrowLeft']) {peliHahmo.speedX = -1;}
    peliHahmo.newPos();
    peliHahmo.update();
    peliHahmo.pomppu();

}