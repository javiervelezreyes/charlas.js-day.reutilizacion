var mp = require ('../lib/mp.ext');

(function (mp) {

    var MIndex = mp.Mixin({

        init  : function () {
            this.idx   = 0;
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
        },
        back : function () {
            (this.idx > 0) &&
            (this.idx--);
        },
        next : function () {
            (this.idx < this.self.size()) &&
            (this.idx++); 
        },
        size : function () {
            return this.items.length;
        },
        reset : function () {
            this.idx = 0;
        }

    });
    
    (function (MIndex) {
    
        var user = MIndex ({
            login : 'jvelez',
            pass  : 'secret',
        });

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
                user.reset ();
                var books = [];
                var book = user.get();
                while (user.id() < user.size()) {
                    books.push (book);
                    user.next ();
                    book = user.get ();
                }
                return books;
            })()
            
        );
    
    })(MIndex);

})(mp);