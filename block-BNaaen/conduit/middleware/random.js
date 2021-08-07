function random(){
    let alphaStr = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ", str = "";
    for(let i = 0; i < 6; i++){
        str += alphaStr[(Math.floor(Math.random() * 35))];
    }
    return str;
}

module.exports = random;