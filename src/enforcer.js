function makeSchema(required, type, fallback){
    return {required, type, fallback};
}

function enforce(obj, schema){
    if (typeof obj==='undefined'){
        throw new Error('You need to supply an options object');
    }
    var ret={};
    var key;
    for (key in obj){
        if (!Object.prototype.hasOwnProperty.call(obj, key)){continue;}
        if (typeof schema[key]==='undefined'){
            throw new Error('Unrecognized option '+key);
        }
    }
    for (key in schema){
        if (!Object.prototype.hasOwnProperty.call(schema, key)){continue;}
        var reqs=schema[key];
        var val=obj[key];
        if (typeof val==='undefined'){
            if (reqs.required){
                throw new Error('Value '+key+' must be defined and of type '+reqs.type);
            }
            else {
                ret[key]=reqs.fallback;
            }
        }
        else {
            if (typeof val!==reqs.type){
                throw new Error('Value '+key+' must be of type '+reqs.type);
            }
            ret[key]=val;
        }
    }
    return ret;
}

function isEmpty(obj){
    return Object.keys(obj).length===0;
}

export {
    makeSchema,
    enforce
};
