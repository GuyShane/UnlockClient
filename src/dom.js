function $(id){
    const elem=document.querySelector(id);
    if (!elem){
        throw new Error('No element found with id '+id);
    }
    return elem;
}

function val(id){
    return document.querySelector(id).value;
}

function empty(elem){
    while(elem.firstChild){
        elem.removeChild(elem.firstChild);
    }
}

function transition(container, html, after){
    const delay=200;
    container.classList.add('ul-invisible');
    setTimeout(()=>{
        empty(container);
        container.innerHTML=html;
        container.classList.remove('ul-invisible');
        container.classList.add('ul-visible');
        setTimeout(()=>{
            container.classList.remove('ul-visible');
            after();
        }, delay);
    }, delay);
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

function onClick(elem, action){
    elem.addEventListener('click', action);
}

function offClick(elem, action){
    elem.removeEventListener('click', action);
}

function onEnter(id, action){
    const elem=document.querySelector(id);
    elem.onkeyup=e=>{
        const key=e.which||e.keyCode;
        if (key===13){
            action();
        }
    };
}

export {
    $,
    val,
    empty,
    transition,
    insertRules,
    onClick,
    offClick,
    onEnter
};
