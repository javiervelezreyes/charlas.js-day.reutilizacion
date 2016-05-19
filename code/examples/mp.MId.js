var mp = require ('../lib/mp.ext');

(function (mp) {
    
    var MId = mp.Mixin({
    
        init  : function () {
            this. id = 1;
        },
        getId : function () { return this.id; },
        setId : function (id) { this.id = id; }

    });

    (function (MId) {
    
        var A  = {
            x : 0,
            y : 0
        };


        var B = MId(A);
        var C = MId(A);
        var D = MId(A);

        B.setId (5);
        C.setId (7);

        console.log (
            
            A.x, A.y,
            B.x, B.y, B.getId(),
            C.x, C.y, C.getId(),
            D.x, D.y, D.getId()
            
        );
    
    })(MId);
    
})(mp);