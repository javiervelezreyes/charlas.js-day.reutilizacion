var mp = require ('./mp') || mp || {};


// Mixin Constructor

mp.Mixin = function (ext) {
    
    return function (core) { 
        var ctx  = Object.create (null);
        var keys = Object.getOwnPropertyNames (ext);
        var mix  = mp.extend ({}, core);
        ctx.self = mix;
        keys.forEach (function (key) {
            if (typeof (ext[key]) === 'function')
                mix[key]  = ext[key].bind (ctx);
            else ctx[key] = ext[key];
        });
        if (mix.init) mix.init.call (mix);
        return mix;
    };
    
};


// Trait Constructor

mp.Trait = function (ext){
    
    return function (core) {
        var keys  = Object.getOwnPropertyNames(ext);
        var trait = mp.extend ({}, core);
        keys.forEach (function (key) {
            if (typeof(ext[key]) === 'function')
                trait[key] = ext[key].bind(core);
        });
        return trait;
    };
    
};


// Subject Constructor

mp.Subject = function (cfg) {
    
    return function () {
        var objs = [].slice.call (arguments);
        return Object.keys(cfg)
            .reduce (function (subject, key) {
                var method  = cfg[key].method;
                var target  = objs[cfg[key].target];
                var feature = typeof (method)  === 'function' ?
                    method :
                    target[method];
                subject[key] = typeof (feature) === 'function' ?
                    feature.bind(target) :
                    feature;
                return subject;
            }, {});
    };

};


// Role Constructor

mp.Role = function (cfg) {
    
    return function (core) {
        return function () {
            var args = [].slice.call (arguments);
            var ctx  = Object.create (null);
            ctx.self = core;
            var role = Object
                .keys (cfg)
                .reduce (function (role, key) {
                    role[key] = cfg[key].bind(ctx);
                    return role;
                }, {});
                 if (role.init) role.init(args);
            return role;
        };
    };
};


// Aspect Helper

mp.advisable = function (core, key) {
    var fn    = core[key]; 
    core[key] = function () {
        var args = [].slice.call (arguments);
        core[key].befores.forEach (function (fn, idx, v) {
            fn.apply (core, args);
        });
        var r = core[key].body.apply (this, args);
        core[key].afters.forEach (function (fn) {
            fn.apply (core, args.concat (r));
        });
        return r;
    };
    core[key].isAdvisable = true;
    core[key].befores = [];
    core[key].body    = fn;
    core[key].afters  = [];
    core[key].before  = function (fn) {
        this.befores.unshift (fn); 
    };
    core[key].after   = function (fn) {
        this.afters.push (fn); 
    };
};


// Aspect Constructor

mp.Aspect = function (ext){
    return function (core, ctx) {
        Object
            .getOwnPropertyNames (ext)
            .forEach (function (key) {
                if (!core[key].isAdvisable) 
                    mp.advisable (core, key);
                var m = ext[key];
                core[key][m.when](m.advice);
            });
    };
};


// Filter Constructor


mp.Filter = function (ext){
    
    return function (core){
        return function () {
            var args = [].slice.call (arguments);
            var ctx  = Object.create(null);
            ctx.self = core;
            var keys = Object.getOwnPropertyNames (ext);
            keys.forEach (function (key) {
                if (typeof (ext[key]) === 'object') {
                    if (!core[key].isAdvisable)
                        mp.advisable (core, key);
                    var m = ext[key]; 
                    core[key][m.when](function (){
                        var params = [].slice.call (arguments);
                        if (!m.guard || m.guard && m.guard.apply(ctx, params.concat (args)))
                            m.do.apply (ctx, params.concat (args))
                    });
                }
                if (ext.init) ext.init.apply (ctx, args);
            });
        };
    };
    
};


module.exports = mp;