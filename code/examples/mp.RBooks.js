var mp = require ('../lib/mp.ext');

(function (mp) {

    function Books () {
        return {
            get    : function (id)   { console.log ('Books - Retrieving [%s] ', id ); },
            getAll : function ()     { console.log ('Books - Retrieving [all]'     ); },
            add    : function (book) { console.log ('Books - Storing    [%j]', book); },
            remove : function (book) { console.log ('Books - Remove     [%j]', book); }
        };
    }

    var ROnly = mp.Role ({
        
        get : function (id) { return this.self.get(id);    },
        all : function ()   { return this.self.getAll (); }
                             
    });

    var ROnce = mp.Role ({
        
        init: function () {
            this.done = false;
        },
        
        get: function (id) { return self.get(id); },
        set: function (book) {
            if (!this.done) {
                this.done = true;
                this.self.add (book);
            } else console.log ('Error - [%s]',book.id);
        },
        reset: function () { this.done = false; }
        
    });

    var RMax = mp.Role ({
        
        init: function (max) {
            this.max = max;
            this.n   = 0;
        },

        get: function (k) { return self.get(k); },
        set: function (book) {
            if (this.n < this.max) {
                this.self.add(book);
                this.n++;
            } else console.log ('Error - [%s]', book.id);
        },
        reset: function () { this.n = 0; }
        
    });

    (function (ROnly, ROnce, RMax, Books) {

        var rOnlyBooks  = ROnly (Books)();
        var rOnceBooks1 = ROnce (Books)();
        var rOnceBooks2 = ROnce (Books)();
        var rMaxBooks1  = RMax  (Books)(3);
        var rMaxBooks2  = RMax  (Books)(3);

        rOnlyBooks.get (1);
        rOnlyBooks.all ();
        rOnceBooks1.set ({ id : 1,  title: 'title-01', author : 'author-01'});
        rOnceBooks1.set ({ id : 2,  title: 'title-02', author : 'author-02'});
        rOnceBooks2.set ({ id : 3,  title: 'title-03', author : 'author-03'});
        rOnceBooks2.set ({ id : 4,  title: 'title-04', author : 'author-04'});
        rMaxBooks1.set  ({ id : 5,  title: 'title-05', author : 'author-05'});
        rMaxBooks1.set  ({ id : 6,  title: 'title-06', author : 'author-06'});
        rMaxBooks1.set  ({ id : 7,  title: 'title-07', author : 'author-07'});
        rMaxBooks1.set  ({ id : 8,  title: 'title-08', author : 'author-08'});
        rMaxBooks2.set  ({ id : 9,  title: 'title-09', author : 'author-09'});
        rMaxBooks2.set  ({ id : 10, title: 'title-10', author : 'author-10'});
        rMaxBooks2.set  ({ id : 11, title: 'title-11', author : 'author-11'});
        rMaxBooks2.set  ({ id : 12, title: 'title-12', author : 'author-12'});
        
    })(ROnly, ROnce, RMax, Books() );

})(mp);