var peliHahmo;
var laatat = [];
var laatta;
var erikoisLaatat = [];
var erikoisLaatta;
var tuplausLaatat = [];
var tuplausLaatta;
var pisteet;
let previousX = 140;
let pisteLuku = 0;

//pelin käynnistys
function aloitaPeli() {
    document.getElementById('ohjeet').style.display = 'none'
    document.getElementById('aloita').style.display = 'none'
    peliAlue.aloita();
    peliHahmo = new Komponentti(30, 30, 'rgb(25, 76, 78)', 0, 700, 'peliHahmo');
    pisteet = new Komponentti("20px", "Consolas", "black", 10, 690, "text");
    laatta = new Komponentti(35, 5, 'brown', 130, 350, 'laatta');
    laatat.push(laatta);
    laatat.push(new Komponentti(35, 5, 'brown', 100, 200, 'laatta'));
    laatat.push(new Komponentti(35, 5, 'brown', 140, 100, 'laatta'));
    laatat.push(new Komponentti(35, 5, 'brown', 90, 500, 'laatta'));
}

//canvas
var peliAlue = {
    canvas : document.createElement('canvas'),
    aloita : function() {
        this.canvas.width = 400;
        this.canvas.height = 700;
        this.context = this.canvas.getContext('2d');
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(paivitaPeliAlue, 20);
        window.addEventListener('keydown', function (e) {
            peliAlue.avaimet = (peliAlue.avaimet || []);
            peliAlue.avaimet[e.key] = true;
        })
        window.addEventListener('keyup', function (e) {
            peliAlue.avaimet[e.key] = false;
        })
        
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        alert('Peli loppui. Pisteet: ' + `${pisteLuku}.`);
        document.location.reload();
        clearInterval(this.interval);
    }
}

function everyinterval(n) {
    if ((peliAlue.frameNo / n) % 1 == 0) {
        return true;
    }
    return false;
}

//komponentti konstruktori
function Komponentti(width, height, color, x, y, type) {
    this.width = width;
    this.height = height;
    this.color = color;
    this.x = x;
    this.y = y;
    this.speedX = 0;
    this.speedY = 0;
    this.gravity = 0.3
    this.gravitySpeed = 0;
    this.type = type;
    if (this.type == 'laatta') {
        // Komponenteille asetetaan status- luku värin perusteella.
        if (this.color == 'brown') {
            this.status = 1;
        } else if (this.color == 'red') {
            this.status = 2;
        } else if (this.color == 'green') {
            this.status = 3;
        }
    }
    ctx = peliAlue.context;
    ctx.fillStyle = color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    this.update = function() {
        ctx = peliAlue.context;
        if (this.type == 'text') {
            ctx.font = this.width + ' ' + this.height;
            ctx.fillStyle = this.color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY; 
        this.hitSides();
    }
    this.pomppu = function() {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;  
        this.hitBottom();
        this.osuLaattaan(laatat);
        this.osuLaattaan(erikoisLaatat);
        this.osuLaattaan(tuplausLaatat);
    }
    this.hitBottom = function() {
        var rockbottom = peliAlue.canvas.height - this.height;
        if (this.y > rockbottom) {
          this.y = rockbottom;
          this.gravitySpeed = -9.6;
        }
    }
    this.gameOver = function() {
        rockbottom = peliAlue.canvas.height - this.height;
        var crash = false;
        if(peliAlue.frameNo >= 200 && this.y == rockbottom){
            crash = true;
        }
        return crash;
    }
    this.hitSides = function() {
        if (this.type == 'peliHahmo') {
            if (this.x < 0) {
                this.x = peliAlue.canvas.width;
            }
            if ((this.x) > peliAlue.canvas.width) {
                this.x = 0;
            }
            if (this.y < 0) {
                this.y = 0;
                this.gravitySpeed = 0;
            }
        }
    }  
    this.osuLaattaan = function(laattaLista) {
        if (this.type == 'peliHahmo') {
            var myleft = this.x;
            var myright = this.x + (this.width);
            var mybottom = this.y + (this.height);
            for (i = 0; i < laattaLista.length; i++) {
                //Punaiset laatat 'hajoavat' eli ne poistetaan ensimmäisen osuman jälkeen
                if (laattaLista[i].color == 'red' && laattaLista[i].status == 0) {
                    laattaLista.splice(i, 1);
                    continue;
                }
                var otherleft = laattaLista[i].x;
                var otherright = laattaLista[i].x + (laattaLista[i].width);
                var othertop = laattaLista[i].y;
                if (mybottom <= othertop+20 && mybottom >= othertop && myright >= otherleft && myleft <= otherright) {
                    this.gravitySpeed = -9.6;
                    // Kun pysyvälle laatalle osuu ensimmäisen kerran saa pisteen.
                    // Pysyvien laattojen väri muuttuu ensimmäisen osuman jälkeen.
                    if (laattaLista[i].status != 0) {
                        if (laattaLista[i].status == 1) {
                            laattaLista[i].color = 'pink';
                            pisteLuku += 1;
                        }
                        if (laattaLista[i].status == 2) {
                            pisteLuku += 1;
                        }
                        //Jos laatta on vihreä, pisteet tuplaantuu
                        if (laattaLista[i].status == 3) {
                            pisteLuku *= 2;
                            laattaLista[i].color = 'lightgreen'
                        }
                        laattaLista[i].status = 0;
                    }
                }
            }
        }
    }
}

//pelialueen päivitys
function paivitaPeliAlue() {
    if(peliHahmo.gameOver()){
        peliAlue.stop();
    }else{
    peliAlue.clear();
    peliAlue.frameNo += 1;
    if (peliAlue.frameNo == 1 || everyinterval(150)) {
        const minWidth = 10;
        const maxWidth = peliAlue.canvas.width-45;
        const maxGap = 135;
        let x = Math.floor(Math.random()*(maxWidth-minWidth+1)+minWidth);
        if (x <= previousX-maxGap) {
            x = previousX-maxGap;
        } else if (x >= previousX+maxGap) {
            x = previousX+maxGap;
        }
        laatat.push(new Komponentti(35, 5, 'brown', x, 0, 'laatta'));
        previousX = x;
    }
    for (i = 0; i < laatat.length; i++) {
        laatat[i].y += 1;
        laatat[i].update();
    }
    var randomTime = Math.random() * (10000 - 4000) + 4000;
    setTimeout(erikoisLaattaFunktio(), randomTime);
    var randomTime2 = Math.random() * (20000-10000) + 10000;
    setTimeout(tuplausLaattaFunktio(), randomTime2);
    peliHahmo.speedX = 0;
    if (peliAlue.avaimet && peliAlue.avaimet['ArrowRight']) {peliHahmo.speedX = 1;}
    if (peliAlue.avaimet && peliAlue.avaimet['ArrowLeft']) {peliHahmo.speedX = -1;}
    peliHahmo.newPos();
    peliHahmo.update();
    peliHahmo.pomppu();
    for (i = 0; i < erikoisLaatat.length; i++) {
        erikoisLaatat[i].y += 1;
        erikoisLaatat[i].update();
    }
    for (i = 0; i < tuplausLaatat.length; i++) {
        tuplausLaatat[i].y += 1;
        tuplausLaatat[i].update();
    }
    laatta.update();
    pisteet.text = 'Pisteet: ' + pisteLuku;
    pisteet.update();
    }
}

//erikoislaatat
function erikoisLaattaFunktio(){
    if (peliAlue.frameNo == 1 || everyinterval(200)) {
        let x2 = Math.floor(Math.random()*365)+1;
        erikoisLaatta = new Komponentti(35, 5, 'red', x2, 0, 'laatta');
        erikoisLaatat.push(erikoisLaatta);
    }
}

function tuplausLaattaFunktio(){
    if (peliAlue.frameNo == 1 || everyinterval(2000)) {
        let x2 = Math.floor(Math.random()*365)+1;
        tuplausLaatta = new Komponentti(35, 5, 'green', x2, 0, 'laatta');
        tuplausLaatat.push(tuplausLaatta);
    }
}