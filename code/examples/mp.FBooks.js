var mp = require ('../lib/mp.ext');

(function (mp) {

    var DB = function () {
        this.items = {};
        this.get   = function (id) { return this.items[id]; };
        this.set   = function (e)  { this.items[e.id] = e;  };
    };
    
    
    function Books () {
        return {
            find : function (id)   { return this.data; },
            add  : function (book) { }
        };
    }

    var FShard = mp.Filter ({
        init : function (idx, max, db) {
            this.idx = idx;
            this.max = max;
            this.db  = db;
        },
        find : {
            when  : 'before',
            guard : function (id) {
                return id % this.max === this.idx;
            },
            do : function (id) { 
                this.self.data = this.db.get (id);
            }
        },
        add : {
            when : 'before',
            do : function (e) {
                this.db.set (e);
            }
        }
    });

    
    (function (FShard, books, DB) {
        
        var shardBooks = FShard (books);
        var db0 = new DB ();
        var db1 = new DB ();
        var db2 = new DB ();
        shardBooks (0, 3, db0);
        shardBooks (1, 3, db1);
        shardBooks (2, 3, db2);

        books.add ({ id: 1, title: 'The Good Parts'     });
        books.add ({ id: 2, title: 'JavaSCript Allongé' });
        
        console.log (   
            books.find (1),
            books.find (2),
            books.find (3)
        );

        console.log (
            db0.items,
            db1.items,
            db2.items
        );
        
    })(FShard, Books (), DB);

})(mp);