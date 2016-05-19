var mp = require ('../lib/mp.ext');

(function (mp) {

    var MIndex = mp.Mixin({

        init  : function () {
            this.idx = 0;
            this.items = [];
        },
        id   : function () {
            return this.idx;
        },
        get  : function () {
            return this.items[this.idx];
        },
        set  : function (item) {
            this.items[this.idx] = item;
            return this.self;
        },
        back : function () {
            (this.idx > 0) &&
            (this.idx--);
            return this.self;
        },
        next : function () {
            (this.idx < this.self.size()) &&
            (this.idx++);
            return this.self;
        },
        size : function () {
            return this.items.length;
        },
        reset : function () {
            this.idx = 0;
            return this.self;
        },
        each  : function (fn) { 
            this.items.forEach (fn); 
        }

    });
    
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
    
    (function (TEnumerable, MIndex) {
    
        user = TEnumerable (
            MIndex ({
                login : 'jvelez',
                pass  : 'secret',
            })
        );

        user.set (
            TEnumerable (
                MIndex ({
                    title   : 'Js. The Good Parts',
                    author  : 'Douglas Crockford',
                    pages   : 172,
                })
                .set ('comment 1')
                .next ()
                .set ('comment 2')
                .next ()
                .set ('comment 3')
                .reset ()
            )
        );

        user.next ();
        user.set (
            TEnumerable (
                MIndex ({
                    title   : 'JavaScript Allongé',
                    author  : 'Reginald Braithwaite',
                    pages   : 251,
                })
                .set ('comment 1')
                .next ()
                .set ('comment 2')
                .reset ()
            )
        );

        user.next ();
        user.set (
            TEnumerable (
                MIndex ({
                    title   : 'Functional JavaScript',
                    author  : 'Michael Fogus',
                    pages   : 260,
                })
                .set ('comment 1')
                .next ()
                .set ('comment 2')
                .next ()
                .set ('comment 3')
                .reset ()
            )
        );

        
        console.log (
        
            (function getNComments (){
                return user
                    .reduce (function (a, book) {
                        var nComments = (function (book) {
                            return book
                                .reduce (function (a, comment) {
                                    return a + 1;
                                }, 0);
                        })(book); 
                        
                        return a.concat ({ 
                            title : book.title,
                            n     : nComments
                        });
                    }, []);
            })()
        
        );

    })(TEnumerable, MIndex);
    
})(mp);