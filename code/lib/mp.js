var mp = mp || {};

// Common Operations

mp.bind = function bind (core, key, ctx) {

    if (typeof (core[key]) === 'function')
        core[key] = core[key].bind(ctx);
    return core;
    
};

mp.context = function context () {
    
    mp.n = mp.n || 0;
    return 'ctx' + (mp.n++);
    
};

// Addition Operators

mp.add = function add (core, key, value) {

    core[key] = value;
    return core;
    
};

mp.remove = function remove (core, key) {

    delete core[key];
    return core;

};

mp.update = function update (core, key, value) {

    if (key in core)
        mp.add (core, key, value);
    return core;

};

mp.rename = function rename (core, oKey, nKey) {

    if (oKey in core && oKey !== nKey) {
        mp.add (core, nKey, core[oKey]);
        mp.remove (core, oKey);
    }
    return core;

};

mp.copy = function copy (core, ext, key) {

    if (key in ext)
        mp.add (core, key, ext[key]);
    return core;

};

mp.move = function move (core, ext, key) {

    mp.copy (core, ext, key);
    mp.remove (ext, key);
    return core;

};

mp.extend = function extend (core, ext, ctx) {

    var keys = Object.getOwnPropertyNames (ext);
    keys.forEach (function (key) {
        mp.copy (core, ext, key);
        mp.bind (core, key, ctx || core);
    });
    return core;
        
};

// Extension Operators

mp.getPrototype = function getPrototype (core) {
    
    return Object.getPrototypeOf (core);
    
};

mp.setPrototype = function setPrototype (core, proto) {
    
    var ch = Object.create (proto);
    mp.extend (ch, core);
    return ch;
  
};

mp.removePrototype = function setPrototype (core) {

    return mp.setPrototype (core, null);
    return core;
  
};

mp.reversePrototype = function setPrototype (core) {

    var proto = mp.getPrototype (core);
    return mp.setPrototype (proto, core);
  
};

mp.copyUp = function copyUp (core, key) {
    
    var proto = mp.getPrototype (core);
    mp.copy (proto, core, key);
    return core;
    
};

mp.copyDown = function copyDown (core, key) {
    
    var proto = mp.getPrototype (core);
    mp.copy (core, proto, key);
    return core;
    
};

mp.moveUp = function moveUp (core, key) {
    
    var proto = mp.getPrototype (core);
    mp.move (proto, core, key);
    return core;
    
};

mp.moveDown = function moveDown (core, key, child) {
    
    var proto = mp.getPrototype (core);
    mp.move (core, proto, key);
    return core;
    
};

// Intercession Operators

mp.beforeAtt = function beforeAtt (core, key, ext) {
    
    ext.get = ext.get || function () {};
    ext.set = ext.set || function () {};
    Object.defineProperty (core, '_' + key, {
        value        : core[key],
        writable     : true,
        enumerable   : false,
        configurable : false
    });
    Object.defineProperty (core, key, {
        get: function () {
            ext.get.call (this, core['_' + key]);
            return core['_' + key];
        },
        set: function (v) {
            ext.set.call (this, core['_' + key], v);
            core['_' + key] = v;
        }  
    });
    return core;
    
};

mp.afterAtt = function afterAtt (core, key, ext) {
    
    ext.get = ext.get || function () {};
    ext.set = ext.set || function () {};
    Object.defineProperty (core, '_' + key, {
        value        : core[key],
        writable     : true,
        enumerable   : false,
        configurable : false
    });
    Object.defineProperty (core, key, {
        get: function () {
            var out = core['_' + key]; 
            ext.get.call (this, core['_' + key]);
            return out;
        },
        set: function (nv) {
            var ov = core['_' + key]; 
            core['_' + key] = nv;
            ext.set.call (this, ov, nv);
        }  
    });
    return core;
    
};

mp.before = function before (core, key, ext) {
    
    var fn = core[key]; 
    core[key] = function () {
        var args = [].slice.call (arguments);
        var out  = ext.apply (this, args);
        return fn.apply (this, args.concat (out));
    };
    return core;
    
};

mp.after = function after (core, key, ext) {
    
    var fn = core[key];
    core[key] = function () {
        var args = [].slice.call (arguments);
        var out = fn.apply (this, args);
        ext.apply (this, args.concat (out));
        return out;
    };
    return core;
    
};

mp.around = function around (core, key, ext) {

    var fn = core[key];
    core[key] = function () {
        var args = [].slice.call (arguments);
        args = [ext.bind (this)].concat (args);
        return fn.apply (this, args);
    };
    return core;
    
};

mp.provided = function provided (core, key, ext) {
    
    var fn = core[key];
    core[key] = function () {
        if (ext.apply (this, arguments))
            return fn.apply (this, arguments);
    };
    return core;

};

mp.except = function except (core, key, ext) {

    var fn = core[key];
    core[key] = function () {
        if (!ext.apply (this, arguments))
            return fn.apply (this, arguments);
    };
    return core;

};

mp.override = function override (core, key, ext) {
    
    core[key] = function () {
        return ext.apply (this, arguments);
    };
    return core;
},
    
mp.discard = function discard (core, key, ext) {
    
    return core;
    
},

// Delegative operators
    
mp.innerDelegate = function innerDelegate (core, oKey, nKey, ctx) {
    
    var context = ctx || core;
    core[nKey] = function () {
        var args = [].slice.call (arguments);
        var out  = core[oKey].apply (context, args);
        return out === core ? this : out;
    };
    return core;
    
};

mp.outerDelegate = function outerDelegate (core, ext, key, ctx) {
    
    var context = ctx || ext;
    core[key] = function () {
        var args = [].slice.call (arguments);
        var out  = ext[key].apply (context, args);
        return out === ext ? this : out;
    };
    return core;
    
};

mp.forward = function forward (core, ext, key) {
    
    return mp.outerDelegate (core, ext, key, ext);
    
};

mp.forwardProxy = function forwardProxy (core, ext) {
    
    if (typeof(ext) === 'string') ext = core[ext];
    if (ext) {
        var keys = Object.getOwnPropertyNames (ext);
        keys.forEach (function (key) {
            if (typeof (ext[key]) === 'function')
                mp.forward (core, ext, key);
        });
    }
    return core;
    
};

mp.delegate = function delegate (core, ext, key) {
    
    return mp.outerDelegate (core, ext, key, core);
    
};

mp.delegateProxy = function delegateProxy (core, ext) {
    
    if (typeof(ext) === 'string') ext = core[ext];
    if (ext) {
        var keys = Object.getOwnPropertyNames (ext);
        keys.forEach (function (key) {
            if (typeof (ext[key]) === 'function')
                mp.delegate (core, ext, key);
        });
    }
    return core;
    
};

module.exports = mp;
