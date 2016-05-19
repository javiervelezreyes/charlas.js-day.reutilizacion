var mp = require ('../lib/mp.ext');

(function (mp) {

    var db = {
        items : [],
        save  : function (e) { this.items.push (e); },
        load  : function ()  { return this.items;   }
    };
    
    function Books () {
        return {
            find : function (id)   { console.log ('Books - Retrieving [%s] ', id ); },
            add  : function (book) { console.log ('Books - Storing    [%j]', book); }
        };
    }

    var AStorable = mp.Aspect ({
        add: {
            when   : 'after',
            advice : function (item) {
                db.save (item);
            }
        }
    });
    
    var ACheckeable = mp.Aspect ({
        add: {
            when   : 'before',
            advice : function (item) {
                if (!item || !item.id) 
                    throw 'Invalid Type';
            }
        }
    });
    
    var ATraceable = mp.Aspect ({
        add: {
            when   : 'before',
            advice : function (item) {
                console.log ('Adding [%j]', item);
            }
        },
        find: {
            when   : 'after',
            advice : function (id) {
                console.log ('Finding [%d]', id);
            }
        }
    });
    
    (function (AStorable, ACheckeable, ATraceable, books, db) {
        
        AStorable (books);
        ATraceable (books);
        ACheckeable (books);

        books.find (1);
        books.find (2);
        books.add ({ id: 1, title: 'The Good Parts'});
        books.add ({ id: 2, title: 'JavaSCript Allongé'});
        try {
            books.add ({ title: 'JavaSCript Allongé'});
        } catch (e) { console.log (e); }
        console.log (db.items);
    
    })(AStorable, 
       ACheckeable, 
       ATraceable, 
       Books (), db);

})(mp);