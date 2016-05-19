var mp = require ('../lib/mp.ext');

(function (mp) {
    
    // Model : A
    function A (x, y) {
        this.x = x || 0;
        this.y = y || 0;
        this.m = function () { return this.x; };
        this.n = function () { return this.y; };
    }
    
    // Model : B
    function B (x, y) {
        this.x = x || 0;
        this.y = y || 0;
        this.u = function () { return this.x; };
        this.v = function () { return this.y; };
    }

    // View : SPQ
    var SPQ = mp.Subject ({
        
        p: {method: 'm', target: 0},
        q: {method: 'u', target: 1}
                      
    });
    
    // View : SRS 
    var SRS = mp.Subject ({
        
        r: {method: 'n', target: 0},
        s: {method: 'v', target: 1}
                      
    });
    
    (function (SPQ, SRS) {
    
        var a1 = new A (1, 1);
        var a2 = new A (2, 2);
        var b1 = new B (-1, -1);
        var b2 = new B (-2, -2);
        
        var pq1 = SPQ (a1, b1);
        var pq2 = SPQ (a1, b2);
        var pq3 = SPQ (a2, b1);
        var pq4 = SPQ (a2, b2);
        
        var rs1 = SRS (a1, b1);
        var rs2 = SRS (a1, b2);
        var rs3 = SRS (a2, b1);
        var rs4 = SRS (a2, b2);
        
        console.log (
        
            pq1.p (),
            pq1.q (),
            pq2.p (),
            pq2.q (),
            pq3.p (),
            pq3.q (),
            pq4.p (),
            pq4.q (),
            
            rs1.r (),
            rs1.s (),
            rs2.r (),
            rs2.s (),
            rs3.r (),
            rs3.s (),
            rs4.r (),
            rs4.s ()
        
        );
    
    })(SPQ, SRS);
    
})(mp);