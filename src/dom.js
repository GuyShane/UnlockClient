function find(id){
    const elem=document.querySelector(id);
    if (!elem){
        throw new Error('No element found with id '+id);
    }
    return elem;
}

function val(id){
    return document.querySelector(id).value;
}

function insertRules(rules){
    const style=document.createElement('style');
    style.appendChild(document.createTextNode(''));
    document.head.appendChild(style);
    const sheet=style.sheet;
    rules.forEach(r=>{
        sheet.insertRule(r, sheet.cssRules.length);
    });
}

function addOnEnter(id, action){
    const elem=document.querySelector(id);
    elem.onkeyup=e=>{
        const key=e.which||e.keyCode;
        if (key===13){
            action();
        }
    };
}

export {
    find,
    val,
    insertRules,
    addOnEnter
};
