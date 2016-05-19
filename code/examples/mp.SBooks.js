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
                    price   : 300
                })
                .set ({ body: 'comment 1', score: 1 })
                .next ()
                .set ({ body: 'comment 2', score: 5 })
                .next ()
                .set ({ body: 'comment 3', score: 3 })
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
                    price   : 450
                })
                .set ({ body: 'comment 1', score: 4 })
                .next ()
                .set ({ body: 'comment 2', score: 2 })
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
                    price   : 500
                })
                .set ({ body: 'comment 1', score: 1 })
                .next ()
                .set ({ body: 'comment 2', score: 5 })
                .next ()
                .set ({ body: 'comment 3', score: 3 })
                .reset ()
            )
        );
        
        var SLoyalty = mp.Subject({
        
            title    : { method: 'title',  target: 0},
            author   : { method: 'author', target: 0},
            comments : { method: 'map',    target: 0},
            score    : { method: function () {
                return this
                    .reduce(function (score, comment){
                        return score + comment.score;
                    }, 0);
            }, target: 0}

        });

        var SSales = mp.Subject({

            title  : {method: 'title', target: 1},
            price  : {method: 'price', target: 1},
            owner  : {method: 'login', target: 0},
            others : {method: 'map',  target: 0}

        });

        user.reset();
        var book    = user.get ();
        var loyalty = SLoyalty (book);
        var sales   = SSales (user, book);

        console.log ([
        
            loyalty.title,
            loyalty.author,
            loyalty.comments (function (e) { return e; }),
            loyalty.score ()
        
        ], [
        
            sales.title,
            sales.price,
            sales.owner,
            sales.others (function (e) { return e.title; })
        
        ]);

    })(TEnumerable, MIndex);
    
})(mp);