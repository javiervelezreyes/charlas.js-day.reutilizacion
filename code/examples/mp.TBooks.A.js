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

        user.set ({
            title   : 'Js. The Good Parts',
            author  : 'Douglas Crockford',
            pages   : 172,
        });

        user.next ();
        user.set ({
            title   : 'JavaScript Allongé',
            author  : 'Reginald Braithwaite',
            pages   : 251,
        });

        user.next ();
        user.set ({
            title   : 'Functional JavaScript',
            author  : 'Michael Fogus',
            pages   : 260,
        });

        console.log (
            
            (function getBooks () {
                return user
                    .reduce (function (books, book) {
                        return books.concat (book.title);
                    }, []);
            })(),
            
            (function getBigs (n) {
                return user
                    .filter (function (book) {
                        return book.pages > n;
                    })
                    .reduce (function (books, book) {
                        return books.concat (book.title);
                    }, []);
            })(200)
            
        );
    
    })(TEnumerable, MIndex);

})(mp);
