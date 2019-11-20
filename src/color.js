function normalize(c){
    var match=c.match(/^#?([0-9a-f]{6})$/i);
    if (match){
        return ('#'+match[1]).toLowerCase();
    }
    match=c.match(/^#?([1-9a-f])([1-9a-f])([1-9a-f])$/i);
    if (match){
        return ('#'+match[1]+match[1]+match[2]+match[2]+match[3]+match[3]).toLowerCase();
    }
    var numMatch='[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5]';
    var rgbRegex=new RegExp('^rgb\\(('+numMatch+'), ?('+numMatch+'), ?('+numMatch+')\\)$');
    match=c.match(rgbRegex);
    if (match){
        return ('#'+format(match[1])+
                format(match[2])+
                format(match[3])).toLowerCase();
    }
    throw new Error('Unrecognized color '+c+'. Must be either hex or rgb format');
}

function alter(c, up){
    c=c.slice(1);
    var delta=30;
    if (!up){
        delta*=-1;
    }
    var cnum=parseInt(c, 16);
    var newR=format((cnum>>16)+delta);
    var newB=format((cnum>>8&0x00ff)+delta);
    var newG=format((cnum&0x0000ff)+delta);
    return '#'+newR+newB+newG;
}

function format(num){
    num=parseInt(num);
    if (num>255){num=255;}
    if (num<0){num=0;}
    var s=num.toString(16);
    if (s.length===1){
        s='0'+s;
    }
    return s;
}

export {
    normalize,
    alter
};
