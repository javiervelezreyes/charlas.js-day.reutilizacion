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
        }

    });
    
    (function (MIndex) {
    
        var user = MIndex ({
            login : 'jvelez',
            pass  : 'secret',
        });

        user.set (
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
        );

        user.next ();
        user.set (
            MIndex ({
                title   : 'JavaScript Allongé',
                author  : 'Reginald Braithwaite',
                pages   : 251,
            })
            .set ('comment 1')
            .next ()
            .set ('comment 2')
            .reset ()
        );

        user.next ();
        user.set (
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
        );

        
        console.log (
        
            (function getComments (){
                user.reset ();
                var books = [];
                var book = user.get();
                while (user.id() < user.size()) {
                    var comments = [];
                    var comment  = book.get ();
                    while (book.id() < book.size()) {
                        comments.push (comment);
                        book.next ();
                        comment = book.get ();
                    }
                    books.push ({
                        title    : book.title,
                        comments : comments
                    });
                    user.next ();
                    book = user.get ();
                }
                return books;
            })()
        
        );

    })(MIndex);
    
})(mp);