var mp = require ('../lib/mp.ext');

(function (mp) {

    var TEnumerable = mp.Trait ({
    
        map : function (fn) {
            var result = [];
            this.each (function (e) { 
              result.push (fn(e)); 
            });
            return result;
        },   
        reduce: function (rn, b) {
            var result = b;
            this.each (function (e) {
                result = rn(result, e); 
            });
            return result;
        },   
        filter: function (pn) {
            var result = [];
            this.each (function (e) { 
                pn(e) && result.push (e); 
            });
            return result;
        }

    });
    
    (function (TEnumerable) {
   
        function Collection () {
            this.items = [].slice.call (arguments);
        };
        Collection.prototype.add    = function (e)  { this.items.push (e);     };
        Collection.prototype.remove = function (e)  { this.items.slice (1);    };
        Collection.prototype.each   = function (fn) { this.items.forEach (fn); };

        var a1 = new Collection (1,2,3);
        var a2 = new Collection (4,5,6);

        var b1 = TEnumerable (a1);
        var b2 = TEnumerable (a2);

        console.log (
            
            b1.map (function (e) { return e * e; }),
            b2.map (function (e) { return e * e; }),
            b1.reduce (function (a, e) { return a + e; }, 0),
            b2.reduce (function (a, e) { return a + e; }, 0),
            b2.filter (function (e) { return e % 2 === 0; }),
            b1.filter (function (e) { return e % 2 === 0; })
            
        ); 
        
    })(TEnumerable);

})(mp);