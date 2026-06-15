/* kb-math.js — Eduardo.AI Mathematics Knowledge Base + Solver Engine
   v2026.03.28  —  COMPREHENSIVE EDITION
   ─────────────────────────────────────────────────────────────────
   CAPABILITIES (new / expanded):
   • Real-time expression evaluator (arithmetic, trig, log, combinatorics)
   • Natural language word problem solver (PT / EN / ES)
   • ENEM / FUVEST / SAT / vestibular pattern recognition
   • Step-by-step solutions with full working shown
   • NEW: Full financial calculator (compound/simple interest, annuity,
         loan amortisation, NPV, IRR approximation, WACC, ROI, payback,
         break-even, rule of 72, inflation-adjusted returns, DY, P/L,
         CAGR, Sharpe ratio, future value of annuity)
   • NEW: Advanced geometry (3-D solids, frustum, ellipse, regular
         polygons, spherical cap, torus, coordinate geometry, vectors,
         polygon area via shoelace, centroid, inertia)
   • NEW: Calculus helpers (numerical derivative, numerical integration,
         Taylor approximations, Newton-Raphson root finder, Riemann sum)
   • NEW: Linear algebra (determinant 2×2/3×3, matrix multiply, dot/
         cross product, eigenvalue 2×2, system solver Cramer 2×2)
   • NEW: Number theory (prime factorisation, totient, modular exponent)
   • NEW: Probability distributions (Binomial, Normal approx, Poisson)
   • NEW: Physics-adjacent formulas (kinematics, Ohm's law, energy)
   • NEW: Unit converter (length, mass, temperature, currency helpers)
   • Covers: arithmetic, algebra, geometry, trigonometry, calculus,
     statistics, linear algebra, number theory, combinatorics,
     financial math, logic, sets, complex numbers, sequences,
     physics, units, vectors, probability distributions
   ES5 compatible. No external dependencies.
   ─────────────────────────────────────────────────────────────────
*/
(function(W) {
  'use strict';

  /* ════════════════════════════════════════════════════════════
     §1  MATH ENVIRONMENT  —  safe sandbox for eval
  ════════════════════════════════════════════════════════════ */
  var MATH_ENV = {
    pi: Math.PI, PI: Math.PI,
    e: Math.E,   E: Math.E,
    phi: 1.6180339887498948482,
    sqrt2: Math.SQRT2, sqrt3: 1.7320508075688772, sqrt5: 2.2360679774997896,
    ln2: Math.LN2, ln10: Math.LN10, log2e: Math.LOG2E, log10e: Math.LOG10E,
    inf: Infinity, Inf: Infinity,
    tau: 2*Math.PI,

    abs:   Math.abs,  ceil:  Math.ceil,  floor: Math.floor, round: Math.round,
    sqrt:  Math.sqrt, pow:   Math.pow,   exp:   Math.exp,
    cbrt:  Math.cbrt  || function(x){ return x < 0 ? -Math.pow(-x,1/3) : Math.pow(x,1/3); },
    log:   Math.log,
    log2:  Math.log2  || function(x){ return Math.log(x)/Math.LN2; },
    log10: Math.log10 || function(x){ return Math.log(x)/Math.LN10; },
    sin:   Math.sin,  cos:  Math.cos,  tan:  Math.tan,
    asin:  Math.asin, acos: Math.acos, atan: Math.atan, atan2: Math.atan2,
    sinh:  Math.sinh  || function(x){ return (Math.exp(x)-Math.exp(-x))/2; },
    cosh:  Math.cosh  || function(x){ return (Math.exp(x)+Math.exp(-x))/2; },
    tanh:  Math.tanh  || function(x){ var e=Math.exp(2*x); return (e-1)/(e+1); },
    max: Math.max, min: Math.min,
    sign:  Math.sign  || function(x){ return x>0?1:x<0?-1:0; },
    trunc: Math.trunc || function(x){ return x<0?Math.ceil(x):Math.floor(x); },
    hypot: Math.hypot || function(){ var s=0; for(var i=0;i<arguments.length;i++) s+=arguments[i]*arguments[i]; return Math.sqrt(s); },
    clamp: function(x,lo,hi){ return Math.max(lo,Math.min(hi,x)); },

    /* ── Angle converters ── */
    deg:   function(r){ return r*180/Math.PI; },
    rad:   function(d){ return d*Math.PI/180; },
    sind:  function(d){ return Math.sin(d*Math.PI/180); },
    cosd:  function(d){ return Math.cos(d*Math.PI/180); },
    tand:  function(d){ return Math.tan(d*Math.PI/180); },
    asind: function(x){ return Math.asin(x)*180/Math.PI; },
    acosd: function(x){ return Math.acos(x)*180/Math.PI; },
    atand: function(x){ return Math.atan(x)*180/Math.PI; },
    atan2d:function(y,x){ return Math.atan2(y,x)*180/Math.PI; },
    cotd:  function(d){ return 1/Math.tan(d*Math.PI/180); },
    secd:  function(d){ return 1/Math.cos(d*Math.PI/180); },
    cscd:  function(d){ return 1/Math.sin(d*Math.PI/180); },

    /* ── Factorial & combinatorics ── */
    fact: function(n){
      if(n<0||n!==Math.floor(n)) return NaN;
      if(n>170) return Infinity;
      var r=1; for(var i=2;i<=n;i++) r*=i; return r;
    },
    perm: function(n,r){
      if(r>n) return 0; r=Math.floor(r); n=Math.floor(n);
      var v=1; for(var i=n;i>n-r;i--) v*=i; return v;
    },
    comb: function(n,r){
      n=Math.floor(n); r=Math.floor(r);
      if(r<0||r>n) return 0;
      r=Math.min(r,n-r);
      var num=1,den=1;
      for(var i=0;i<r;i++){ num*=(n-i); den*=(i+1); }
      return num/den;
    },
    C: function(n,r){ return MATH_ENV.comb(n,r); },
    P: function(n,r){ return MATH_ENV.perm(n,r); },
    /* Catalan number */
    catalan: function(n){ return MATH_ENV.comb(2*n,n)/(n+1); },
    /* Stirling approx log(n!) */
    logfact: function(n){ return n*Math.log(n)-n+0.5*Math.log(2*Math.PI*n); },
    /* derangement */
    derange: function(n){
      var r=0; for(var k=0;k<=n;k++) r+=Math.pow(-1,k)/MATH_ENV.fact(k);
      return Math.round(MATH_ENV.fact(n)*r);
    },

    /* ── Number theory ── */
    gcd: function(a,b){ a=Math.abs(Math.floor(a)); b=Math.abs(Math.floor(b)); while(b){ var t=b; b=a%b; a=t; } return a; },
    lcm: function(a,b){ return Math.abs(a*b)/MATH_ENV.gcd(a,b); },
    mdc: function(a,b){ return MATH_ENV.gcd(a,b); },
    mmc: function(a,b){ return MATH_ENV.lcm(a,b); },
    isPrime: function(n){
      n=Math.floor(n); if(n<2) return false; if(n<4) return true;
      if(n%2===0||n%3===0) return false;
      for(var i=5;i*i<=n;i+=6) if(n%i===0||n%(i+2)===0) return false;
      return true;
    },
    mod:    function(a,b){ return ((a%b)+b)%b; },
    totient:function(n){
      var r=n; for(var p=2;p*p<=n;p++){ if(n%p===0){ while(n%p===0) n=Math.floor(n/p); r-=Math.floor(r/p); } }
      if(n>1) r-=Math.floor(r/n); return r;
    },
    modpow: function(base,exp,m){
      var r=1; base%=m;
      while(exp>0){ if(exp%2===1) r=r*base%m; exp=Math.floor(exp/2); base=base*base%m; }
      return r;
    },
    digital_root: function(n){ return n===0?0:1+(n-1)%9; },

    /* ── Statistics ── */
    sum:  function(){ var a=Array.isArray(arguments[0])?arguments[0]:Array.prototype.slice.call(arguments); return a.reduce(function(s,x){return s+x;},0); },
    mean: function(){ var a=Array.isArray(arguments[0])?arguments[0]:Array.prototype.slice.call(arguments); return MATH_ENV.sum(a)/a.length; },
    variance: function(){
      var a=Array.isArray(arguments[0])?arguments[0]:Array.prototype.slice.call(arguments);
      var m=MATH_ENV.mean(a); return a.reduce(function(s,x){return s+(x-m)*(x-m);},0)/(a.length-1);
    },
    stdev: function(){ return Math.sqrt(MATH_ENV.variance.apply(null,arguments)); },
    median: function(){
      var a=(Array.isArray(arguments[0])?arguments[0]:Array.prototype.slice.call(arguments)).slice().sort(function(x,y){return x-y;});
      var m=Math.floor(a.length/2); return a.length%2?a[m]:(a[m-1]+a[m])/2;
    },
    geomean: function(){
      var a=Array.isArray(arguments[0])?arguments[0]:Array.prototype.slice.call(arguments);
      return Math.pow(a.reduce(function(p,x){return p*x;},1),1/a.length);
    },
    harmean: function(){
      var a=Array.isArray(arguments[0])?arguments[0]:Array.prototype.slice.call(arguments);
      return a.length/a.reduce(function(s,x){return s+1/x;},0);
    },
    /* covariance */
    covar: function(a,b){
      var ma=MATH_ENV.mean(a),mb=MATH_ENV.mean(b),n=a.length,s=0;
      for(var i=0;i<n;i++) s+=(a[i]-ma)*(b[i]-mb);
      return s/(n-1);
    },
    /* Pearson correlation */
    corr: function(a,b){ return MATH_ENV.covar(a,b)/(MATH_ENV.stdev(a)*MATH_ENV.stdev(b)); },
    /* z-score */
    zscore: function(x,mu,sigma){ return (x-mu)/sigma; },
    /* normal CDF approximation (Abramowitz & Stegun) */
    normcdf: function(z){
      var t=1/(1+0.2316419*Math.abs(z));
      var p=1-0.3989422806*Math.exp(-z*z/2)*(0.319381530*t-0.356563782*t*t+1.781477937*t*t*t-1.821255978*t*t*t*t+1.330274429*t*t*t*t*t);
      return z>=0?p:1-p;
    },
    /* binomial probability */
    binomP: function(n,k,p){ return MATH_ENV.comb(n,k)*Math.pow(p,k)*Math.pow(1-p,n-k); },
    /* Poisson probability */
    poissonP: function(lam,k){ return Math.pow(lam,k)*Math.exp(-lam)/MATH_ENV.fact(k); },

    /* ── Financial ── */
    fv:     function(p,r,t){ return p*Math.pow(1+r,t); },
    pv:     function(m,r,t){ return m/Math.pow(1+r,t); },
    pmt:    function(pv,r,n){ return pv*r/(1-Math.pow(1+r,-n)); },
    nper:   function(pv,r,m){ return Math.log(m/(m-pv*r))/Math.log(1+r); },
    pct:    function(part,total){ return (part/total)*100; },
    /* future value of annuity */
    fva:    function(pmt,r,n){ return pmt*(Math.pow(1+r,n)-1)/r; },
    /* present value of annuity */
    pva:    function(pmt,r,n){ return pmt*(1-Math.pow(1+r,-n))/r; },
    /* perpetuity */
    perpetuity: function(pmt,r){ return pmt/r; },
    /* CAGR */
    cagr:   function(start,end,years){ return Math.pow(end/start,1/years)-1; },
    /* real return (Fisher) */
    realret: function(nominal,inflation){ return (1+nominal)/(1+inflation)-1; },
    /* Rule of 72 */
    r72:    function(rate){ return 72/rate; },
    /* rule of 114 (triple) */
    r114:   function(rate){ return 114/rate; },
    /* NPV */
    npv:    function(rate){ /* first arg=rate, rest=cashflows */
      var cf=Array.prototype.slice.call(arguments,1);
      return cf.reduce(function(s,c,t){ return s+c/Math.pow(1+rate,t+1); },0);
    },
    /* ROI */
    roi:    function(gain,cost){ return (gain-cost)/cost*100; },
    /* Payback */
    payback: function(invest,annualCF){ return invest/annualCF; },
    /* Break-even units */
    breakeven: function(fixed,price,varCost){ return fixed/(price-varCost); },
    /* Sharpe ratio */
    sharpe: function(rp,rf,sigma){ return (rp-rf)/sigma; },
    /* Sortino ratio (pass downside_sigma) */
    sortino: function(rp,rf,sigmaDown){ return (rp-rf)/sigmaDown; },
    /* Treynor ratio */
    treynor: function(rp,rf,beta){ return (rp-rf)/beta; },
    /* Effective annual rate */
    ear:    function(nominal,n){ return Math.pow(1+nominal/n,n)-1; },
    /* Continuous compounding */
    fvc:    function(p,r,t){ return p*Math.exp(r*t); },
    /* Dividend Yield */
    dy:     function(div,price){ return (div/price)*100; },
    /* P/E ratio */
    pe:     function(price,eps){ return price/eps; },
    /* EV/EBITDA */
    evEbitda: function(ev,ebitda){ return ev/ebitda; },
    /* Black-Scholes call price (simplified, no dividends) */
    bscall: function(S,K,r,T,sigma){
      var d1=(Math.log(S/K)+(r+sigma*sigma/2)*T)/(sigma*Math.sqrt(T));
      var d2=d1-sigma*Math.sqrt(T);
      return S*MATH_ENV.normcdf(d1)-K*Math.exp(-r*T)*MATH_ENV.normcdf(d2);
    },
    /* Black-Scholes put price */
    bsput: function(S,K,r,T,sigma){
      var d1=(Math.log(S/K)+(r+sigma*sigma/2)*T)/(sigma*Math.sqrt(T));
      var d2=d1-sigma*Math.sqrt(T);
      return K*Math.exp(-r*T)*MATH_ENV.normcdf(-d2)-S*MATH_ENV.normcdf(-d1);
    },

    /* ── Geometry — plane ── */
    areaCircle:   function(r){ return Math.PI*r*r; },
    areaTriangle: function(b,h){ return b*h/2; },
    areaRect:     function(b,h){ return b*h; },
    areaSquare:   function(l){ return l*l; },
    areaTrap:     function(b1,b2,h){ return (b1+b2)*h/2; },
    areaEllipse:  function(a,b){ return Math.PI*a*b; },
    areaRegPoly:  function(n,s){ return n*s*s/(4*Math.tan(Math.PI/n)); },
    heron:        function(a,b,c){ var s=(a+b+c)/2; return Math.sqrt(s*(s-a)*(s-b)*(s-c)); },
    dist:         function(x1,y1,x2,y2){ return Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1)); },
    dist3:        function(x1,y1,z1,x2,y2,z2){ return Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1)+(z2-z1)*(z2-z1)); },
    /* perimeter helpers */
    perimCircle:  function(r){ return 2*Math.PI*r; },
    perimRect:    function(b,h){ return 2*(b+h); },
    perimTri:     function(a,b,c){ return a+b+c; },
    perimRegPoly: function(n,s){ return n*s; },
    /* arc length */
    arcLen:       function(r,thetaDeg){ return r*thetaDeg*Math.PI/180; },
    /* sector area */
    sectorArea:   function(r,thetaDeg){ return 0.5*r*r*thetaDeg*Math.PI/180; },
    /* segment area */
    segmentArea:  function(r,thetaDeg){ var th=thetaDeg*Math.PI/180; return 0.5*r*r*(th-Math.sin(th)); },
    /* shoelace polygon area */
    polyArea:     function(/* x1,y1,x2,y2,... */){
      var pts=Array.prototype.slice.call(arguments);
      var n=pts.length/2, s=0;
      for(var i=0;i<n;i++){ var j=(i+1)%n; s+=pts[2*i]*pts[2*j+1]-pts[2*j]*pts[2*i+1]; }
      return Math.abs(s)/2;
    },
    /* Geometry — 3-D ── */
    volSphere:    function(r){ return 4*Math.PI*r*r*r/3; },
    surfSphere:   function(r){ return 4*Math.PI*r*r; },
    volCyl:       function(r,h){ return Math.PI*r*r*h; },
    surfCyl:      function(r,h){ return 2*Math.PI*r*(r+h); },
    volCone:      function(r,h){ return Math.PI*r*r*h/3; },
    surfCone:     function(r,h){ return Math.PI*r*(r+Math.sqrt(r*r+h*h)); },
    volCube:      function(a){ return a*a*a; },
    surfCube:     function(a){ return 6*a*a; },
    volPrism:     function(ab,h){ return ab*h; },
    volPyramid:   function(ab,h){ return ab*h/3; },
    volFrustum:   function(R,r,h){ return Math.PI*h/3*(R*R+R*r+r*r); },
    surfFrustum:  function(R,r,h){ var l=Math.sqrt((R-r)*(R-r)+h*h); return Math.PI*(R*R+r*r+(R+r)*l); },
    volTorus:     function(R,r){ return 2*Math.PI*Math.PI*R*r*r; },
    surfTorus:    function(R,r){ return 4*Math.PI*Math.PI*R*r; },
    volSphereCap: function(r,h){ return Math.PI*h*h*(3*r-h)/3; },
    volEllipsoid: function(a,b,c){ return 4*Math.PI*a*b*c/3; },
    /* Diagonal of rect box */
    diagBox:      function(a,b,c){ return Math.sqrt(a*a+b*b+c*c); },

    /* ── Algebra helpers ── */
    disc: function(a,b,c){ return b*b-4*a*c; },
    quad: function(a,b,c){
      var d=b*b-4*a*c;
      if(d<0) return NaN;
      return [(-b+Math.sqrt(d))/(2*a), (-b-Math.sqrt(d))/(2*a)];
    },
    /* cubic discriminant */
    cubicDisc: function(a,b,c,d){ var p=(3*a*c-b*b)/(3*a*a), q=(2*b*b*b-9*a*b*c+27*a*a*d)/(27*a*a*a); return -(4*p*p*p+27*q*q); },

    /* ── Sequences ── */
    paSum:  function(a1,n,r){ return n*(2*a1+(n-1)*r)/2; },
    pgSum:  function(a1,n,q){ return q===1?a1*n:a1*(Math.pow(q,n)-1)/(q-1); },
    pgInf:  function(a1,q){ return Math.abs(q)<1?a1/(1-q):Infinity; },
    /* nth fibonacci */
    fib: function(n){ var a=0,b=1; for(var i=0;i<n;i++){var t=a+b;a=b;b=t;} return a; },

    /* ── Vector helpers (2-D / 3-D) ── */
    dot2:    function(ax,ay,bx,by){ return ax*bx+ay*by; },
    dot3:    function(ax,ay,az,bx,by,bz){ return ax*bx+ay*by+az*bz; },
    cross3:  function(ax,ay,az,bx,by,bz){ return [ay*bz-az*by, az*bx-ax*bz, ax*by-ay*bx]; },
    mag2:    function(x,y){ return Math.sqrt(x*x+y*y); },
    mag3:    function(x,y,z){ return Math.sqrt(x*x+y*y+z*z); },
    angle2v: function(ax,ay,bx,by){ return Math.acos(MATH_ENV.dot2(ax,ay,bx,by)/(MATH_ENV.mag2(ax,ay)*MATH_ENV.mag2(bx,by)))*180/Math.PI; },

    /* ── Linear algebra ── */
    det2: function(a,b,c,d){ return a*d-b*c; },
    det3: function(a,b,c,d,e,f,g,h,k){ return a*(e*k-f*h)-b*(d*k-f*g)+c*(d*h-e*g); },
    /* matrix multiply 2×2 A*B → flat [a,b,c,d] */
    matmul22: function(a,b,c,d, e,f,g,h){ return [a*e+b*g, a*f+b*h, c*e+d*g, c*f+d*h]; },
    /* trace 2×2 */
    trace2: function(a,b,c,d){ return a+d; },
    /* eigenvalues 2×2: λ² − tr·λ + det = 0 */
    eig2: function(a,b,c,d){ var tr=a+d, det=a*d-b*c, disc=tr*tr-4*det; return disc>=0?[(tr+Math.sqrt(disc))/2,(tr-Math.sqrt(disc))/2]:['complex','complex']; },
    /* Cramer 2×2: a1x+b1y=c1, a2x+b2y=c2 */
    cramer2: function(a1,b1,c1,a2,b2,c2){
      var D=a1*b2-a2*b1;
      if(D===0) return null;
      return [(c1*b2-c2*b1)/D, (a1*c2-a2*c1)/D];
    },

    /* ── Numerical methods ── */
    /* numerical derivative (central difference) */
    deriv: function(f,x,h){ h=h||1e-7; return (f(x+h)-f(x-h))/(2*h); },
    /* numerical integration (Simpson's rule) */
    integrate: function(f,a,b,n){
      n=n||100; if(n%2!==0) n++;
      var h=(b-a)/n, s=f(a)+f(b);
      for(var i=1;i<n;i++) s+=(i%2===0?2:4)*f(a+i*h);
      return s*h/3;
    },
    /* Newton-Raphson root finder */
    newton: function(f,x0,tol){
      tol=tol||1e-10; var x=x0;
      for(var i=0;i<100;i++){
        var fx=f(x), fpx=(f(x+1e-7)-f(x-1e-7))/2e-7;
        var dx=fx/fpx; x-=dx;
        if(Math.abs(dx)<tol) return x;
      }
      return x;
    },
    /* Taylor: e^x approx */
    taylorExp: function(x,terms){ var s=0,p=1,f=1; for(var i=0;i<(terms||20);i++){if(i>0){p*=x;f*=i;}s+=p/f;} return s; },

    /* ── Physics helpers ── */
    /* kinematics: v=u+at, s=ut+½at², v²=u²+2as */
    kinVelocity: function(u,a,t){ return u+a*t; },
    kinDisplace:  function(u,a,t){ return u*t+0.5*a*t*t; },
    kinVfromS:   function(u,a,s){ return Math.sqrt(u*u+2*a*s); },
    kinTime:     function(u,v,a){ return (v-u)/a; },
    /* energy */
    KE:  function(m,v){ return 0.5*m*v*v; },
    PE:  function(m,g,h){ return m*(g||9.81)*h; },
    work: function(f,d,cosTheta){ return f*d*(cosTheta===undefined?1:cosTheta); },
    power: function(w,t){ return w/t; },
    /* Ohm / circuits */
    voltage: function(I,R){ return I*R; },
    current: function(V,R){ return V/R; },
    resistance: function(V,I){ return V/I; },
    powerElec: function(V,I){ return V*I; },
    /* ideal gas */
    idealGasP: function(n,R,T,V){ return n*(R||8.314)*T/V; },

    /* ── Unit converters ── */
    kmToMi:   function(km){ return km*0.621371; },
    miToKm:   function(mi){ return mi*1.60934; },
    mToFt:    function(m){ return m*3.28084; },
    ftToM:    function(ft){ return ft*0.3048; },
    cmToIn:   function(cm){ return cm/2.54; },
    inToCm:   function(i){ return i*2.54; },
    kgToLb:   function(kg){ return kg*2.20462; },
    lbToKg:   function(lb){ return lb*0.453592; },
    celToFah: function(c){ return c*9/5+32; },
    fahToCel: function(f){ return (f-32)*5/9; },
    celToKel: function(c){ return c+273.15; },
    kelToCel: function(k){ return k-273.15; },
    lToGal:   function(l){ return l*0.264172; },
    galToL:   function(g){ return g*3.78541; },
    jToKcal:  function(j){ return j/4184; },
    kcalToJ:  function(k){ return k*4184; },
    mToKm:    function(m){ return m/1000; },
    kmToM:    function(km){ return km*1000; }
  };

  /* ════════════════════════════════════════════════════════════
     §2  EXPRESSION EVALUATOR
  ════════════════════════════════════════════════════════════ */
  function preprocess(expr) {
    return expr
      .replace(/\^/g, '**')
      .replace(/(\d)\s*[×x×]\s*(\d)/g, '$1*$2')
      .replace(/÷/g, '/')
      .replace(/√(\d+(?:\.\d+)?)/g, 'sqrt($1)')
      .replace(/∛(\d+(?:\.\d+)?)/g, 'cbrt($1)')
      .replace(/(\d+)!/g, 'fact($1)')
      .replace(/π/g, 'pi')
      .replace(/τ/g, 'tau')
      .replace(/\bmod\b/gi, '%')
      .replace(/\bdiv\b/gi, '/')
      .replace(/,/g, '.')
      .replace(/\b(sen|sin)\b/gi, 'sin')
      .replace(/\b(tg|tan)\b/gi, 'tan')
      .replace(/\b(cos)\b/gi, 'cos')
      .replace(/\bln\b/g, 'log')
      .replace(/\bMDC\b/gi, 'gcd')
      .replace(/\bMMC\b/gi, 'lcm')
      .replace(/\bIR\b/g, '__IR__')  /* protect IR abbreviation */
      .replace(/\btg\b/gi, 'tan');
  }

  function safeEval(expr) {
    var e = preprocess(expr);
    var names = Object.keys(MATH_ENV);
    var vals  = names.map(function(k){ return MATH_ENV[k]; });
    try {
      var fn = new Function(names, '"use strict"; return (' + e + ');');
      var res = fn.apply(null, vals);
      if(res === null || res === undefined) return null;
      if(typeof res === 'boolean') return res ? 'verdadeiro' : 'falso';
      if(Array.isArray(res)) return res.map(fmtNum).join(' | ');
      if(typeof res === 'number'){
        if(!isFinite(res)) return res > 0 ? '∞' : '-∞';
        if(isNaN(res)) return null;
        return fmtNum(res);
      }
      return String(res);
    } catch(err){ return null; }
  }

  function fmtNum(n) {
    if(typeof n !== 'number') return String(n);
    var abs = Math.abs(n);
    if(abs === 0) return '0';
    if(abs >= 1e15 || (abs < 1e-7 && abs > 0)) return n.toExponential(6).replace(/\.?0+e/, 'e');
    var r = parseFloat(n.toPrecision(12));
    return r === Math.floor(r) && Math.abs(r) < 1e15 ? r.toString() : r.toString();
  }

  /* Currency formatter (no locale dependency) */
  function fmtMoney(n, symbol) {
    symbol = symbol || 'R$';
    var abs = Math.abs(n);
    var s = abs.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    /* fix decimal sep */
    var parts = s.split('.');
    if(parts.length === 2) s = parts[0].replace(/\./g,',') + ',' + parts[1];
    return (n < 0 ? '-' : '') + symbol + ' ' + s;
  }

  var EXPR_RE = /[\d\(\)][\s\+\-\*\/\^][\s\d\(\)]|^[\d\s\+\-\*\/\^\(\)\.\,πeΦτ×÷√∛%!]+$|\b(sqrt|cbrt|pow|sin|cos|tan|sind|cosd|tand|log|log10|log2|abs|fact|comb|perm|gcd|lcm|mdc|mmc|mean|sum|stdev|median|dist|dist3|heron|disc|quad|fv|fva|pva|pmt|pv|nper|cagr|npv|roi|ear|dy|pe|sharpe|bscall|bsput|normcdf|binomP|poissonP|areaCircle|areaTriangle|areaEllipse|areaRegPoly|volSphere|volCyl|volCone|volTorus|volFrustum|surfSphere|surfCyl|paSum|pgSum|det2|det3|cramer2|eig2|dot2|dot3|cross3|kinVelocity|kinDisplace|KE|PE|celToFah|fahToCel|kmToMi|kgToLb|fib|catalan|derange|newton|integrate|deriv)\s*\(/i;

  /* ════════════════════════════════════════════════════════════
     §3  WORD PROBLEM SOLVER
  ════════════════════════════════════════════════════════════ */
  function num(s){ return parseFloat(String(s).replace(',','.')); }
  function norm(q){ return q.toLowerCase().replace(/\s+/g,' ').trim(); }
  function allNums(s){ return (s.match(/\d+(?:[,\.]\d+)?/g)||[]).map(num); }

  var W2N = {
    'zero':0,'um':1,'uma':1,'dois':2,'duas':2,'três':3,'tres':3,'quatro':4,
    'cinco':5,'seis':6,'sete':7,'oito':8,'nove':9,'dez':10,'onze':11,
    'doze':12,'treze':13,'quatorze':14,'catorze':14,'quinze':15,
    'dezesseis':16,'dezessete':17,'dezoito':18,'dezenove':19,
    'vinte':20,'trinta':30,'quarenta':40,'cinquenta':50,'sessenta':60,
    'setenta':70,'oitenta':80,'noventa':90,'cem':100,'cento':100,
    'duzentos':200,'trezentos':300,'quatrocentos':400,'quinhentos':500,
    'seiscentos':600,'setecentos':700,'oitocentos':800,'novecentos':900,
    'mil':1000,'milhão':1e6,'milhao':1e6,'bilhão':1e9,'bilhao':1e9,
    'one':1,'two':2,'three':3,'four':4,'five':5,'six':6,'seven':7,
    'eight':8,'nine':9,'ten':10,'eleven':11,'twelve':12,'thirteen':13,
    'fourteen':14,'fifteen':15,'sixteen':16,'seventeen':17,'eighteen':18,
    'nineteen':19,'twenty':20,'thirty':30,'forty':40,'fifty':50,
    'sixty':60,'seventy':70,'eighty':80,'ninety':90,
    'hundred':100,'thousand':1000,'million':1e6,'billion':1e9,
    'uno':1,'una':1,'diez':10,'once':11,'doce':12,'trece':13,'catorce':14,
    'quince':15,'veinte':20,'treinta':30,'cuarenta':40,'cincuenta':50,
    'sesenta':60,'setenta':70,'ochenta':80,'noventa':90,
    'cien':100,'ciento':100,'millón':1e6,'millon':1e6
  };
  function wordsToNumber(s){
    var words=s.toLowerCase().split(/\s+/);
    var total=0,current=0;
    for(var i=0;i<words.length;i++){
      var v=W2N[words[i]];
      if(v!==undefined){
        if(v===100){ current=(current||1)*100; }
        else if(v>=1000){ total+=(current||1)*v; current=0; }
        else{ current+=v; }
      }
    }
    return total+current||null;
  }
  function parseQty(s){
    var n=parseFloat(s.replace(',','.'));
    if(!isNaN(n)) return n;
    return wordsToNumber(s);
  }

  var SOLVERS = [];

  /* ── §3.1  Basic arithmetic word problems ── */
  SOLVERS.push(function basicArith(q, lang){
    var qn = norm(q);
    var m;
    m = qn.match(/(?:tenho|temos|havia[m]?|há|existem)\s+(\d+(?:[,\.]\d+)?|\w+)\s+\w+\s+(?:e\s+)?(?:como|comi|gasto|gastei|tiro|tirei|retiro|retirei|perco|perdi|vendeu|vendemos|dou|dei|remove?[mio]*)\s+(\d+(?:[,\.]\d+)?|\w+)/i);
    if(!m) m = qn.match(/(?:i have|there are|we have)\s+(\d+(?:\.\d+)?|\w+)\s+\w+\s+(?:and\s+)?(?:eat|ate|remove|take away|spend|give away|sell|use)\s+(\d+(?:\.\d+)?|\w+)/i);
    if(!m) m = qn.match(/(?:tengo|hay|tenemos)\s+(\d+(?:[,\.]\d+)?|\w+)\s+\w+\s+(?:y\s+)?(?:como|comi|quito|retiro|uso|doy)\s+(\d+(?:[,\.]\d+)?|\w+)/i);
    if(m){
      var a=parseQty(m[1]),b=parseQty(m[2]);
      if(a!==null&&b!==null){
        var res=a-b;
        return {
          answer: res,
          steps: lang==='en'
            ? '**Step 1:** Start with **'+a+'**\n**Step 2:** Remove **'+b+'**\n**Step 3:** '+a+' − '+b+' = **'+res+'**'
            : '**Passo 1:** Início: **'+a+'**\n**Passo 2:** Remover **'+b+'**\n**Passo 3:** '+a+' − '+b+' = **'+res+'**'
        };
      }
    }
    m = qn.match(/(?:tenho|temos|há)\s+(\d+(?:[,\.]\d+)?|\w+)\s+\w+\s+(?:e\s+)?(?:ganho|ganhei|compro|comprei|recebo|recebi|encontro|encontrei|adiciono|adicionei|chega[m]?|chegou|junt[oa]s?|mais)\s+(\d+(?:[,\.]\d+)?|\w+)/i);
    if(!m) m = qn.match(/(?:i have|there are)\s+(\d+(?:\.\d+)?|\w+)\s+\w+\s+(?:and\s+)?(?:gain|buy|receive|get|find|add)\s+(\d+(?:\.\d+)?|\w+)/i);
    if(m){
      var a2=parseQty(m[1]),b2=parseQty(m[2]);
      if(a2!==null&&b2!==null){
        var res2=a2+b2;
        return {
          answer: res2,
          steps: '**Passo 1:** Início: **'+a2+'**\n**Passo 2:** Adicionar **'+b2+'**\n**Passo 3:** '+a2+' + '+b2+' = **'+res2+'**'
        };
      }
    }
    return null;
  });

  /* ── §3.2  Percentage / proportion ── */
  SOLVERS.push(function pctSolver(q, lang){
    var qn=norm(q); var m;
    m=qn.match(/(\d+(?:[,\.]\d+)?)\s*%\s*(?:de|of|de)\s*(\d+(?:[,\.]\d+)?)/i);
    if(m){
      var pct=num(m[1]),base=num(m[2]),val=pct/100*base;
      return {
        answer: fmtNum(val),
        steps: lang==='en'
          ? '**Formula:** (pct ÷ 100) × base\n('+pct+' ÷ 100) × '+base+' = **'+fmtNum(val)+'**'
          : '**Fórmula:** (porcentagem ÷ 100) × base\n('+pct+' ÷ 100) × '+base+' = **'+fmtNum(val)+'**'
      };
    }
    m=qn.match(/(\d+(?:[,\.]\d+)?)\s*(?:com\s+)?(?:aumento|acréscimo|reajuste|aumentado?)\s+(?:de\s+)?(\d+(?:[,\.]\d+)?)\s*%/i);
    if(!m) m=qn.match(/(\d+(?:[,\.]\d+)?)\s*(?:increased?|raised?)\s+(?:by\s+)?(\d+(?:[,\.]\d+)?)\s*%/i);
    if(m){
      var base2=num(m[1]),pct2=num(m[2]),res=base2*(1+pct2/100);
      return { answer: fmtNum(res), steps: '**Aumento:** valor × (1 + taxa)\n'+base2+' × (1 + '+pct2+'/100) = '+base2+' × '+fmtNum(1+pct2/100)+' = **'+fmtNum(res)+'**' };
    }
    m=qn.match(/(\d+(?:[,\.]\d+)?)\s*(?:com\s+)?(?:desconto|redução|reduzido?|diminuído?)\s+(?:de\s+)?(\d+(?:[,\.]\d+)?)\s*%/i);
    if(!m) m=qn.match(/(\d+(?:[,\.]\d+)?)\s*(?:decreased?|discount)\s+(?:by\s+)?(\d+(?:[,\.]\d+)?)\s*%/i);
    if(m){
      var base3=num(m[1]),pct3=num(m[2]),res3=base3*(1-pct3/100);
      return { answer: fmtNum(res3), steps: '**Desconto:** valor × (1 − taxa)\n'+base3+' × (1 − '+pct3+'/100) = **'+fmtNum(res3)+'**' };
    }
    m=qn.match(/(?:qual\s+[eé]\s+)?(?:que\s+percentual|que\s+porcentagem|what\s+(?:percent|percentage))\s+(?:[eé]|is)?\s*(\d+(?:[,\.]\d+)?)\s+(?:de|of)\s*(\d+(?:[,\.]\d+)?)/i);
    if(m){
      var part=num(m[1]),total=num(m[2]),pctRes=part/total*100;
      return { answer: fmtNum(pctRes)+'%', steps: '('+part+' ÷ '+total+') × 100 = **'+fmtNum(pctRes)+'%**' };
    }
    return null;
  });

  /* ── §3.3  Rate / speed / distance / time ── */
  SOLVERS.push(function ratesSolver(q, lang){
    var qn=norm(q); var m;
    m=qn.match(/(\d+(?:[,\.]\d+)?)\s*km\/h.*?(\d+(?:[,\.]\d+)?)\s*h(?:ora)?/i);
    if(m){ var v=num(m[1]),t=num(m[2]),d=v*t; return { answer: fmtNum(d)+' km', steps: '**d = v × t**\n= '+v+' × '+t+' = **'+fmtNum(d)+' km**' }; }
    m=qn.match(/(\d+(?:[,\.]\d+)?)\s*km.*?(\d+(?:[,\.]\d+)?)\s*h(?:ora)?.*?(?:velocidade|speed|velocidad)/i);
    if(m){ var d2=num(m[1]),t2=num(m[2]),v2=d2/t2; return { answer: fmtNum(v2)+' km/h', steps: '**v = d ÷ t**\n= '+d2+' ÷ '+t2+' = **'+fmtNum(v2)+' km/h**' }; }
    m=qn.match(/(\d+(?:[,\.]\d+)?)\s*km\/h.*?(\d+(?:[,\.]\d+)?)\s*km\/h.*?(\d+(?:[,\.]\d+)?)\s*km/i);
    if(m){
      var v1=num(m[1]),v2b=num(m[2]),D=num(m[3]),t3=D/(v1+v2b),d1=v1*t3,d2b=v2b*t3;
      return { answer: fmtNum(t3.toFixed(4))+' h (A: '+fmtNum(d1.toFixed(2))+' km | B: '+fmtNum(d2b.toFixed(2))+' km)',
               steps: '**Encontro:** t = D ÷ (v₁+v₂) = '+D+' ÷ '+fmtNum(v1+v2b)+' = **'+fmtNum(t3.toFixed(4))+' h**' };
    }
    return null;
  });

  /* ── §3.4  Compound / simple interest & financial ── NEW EXPANDED ── */
  SOLVERS.push(function financeSolver(q, lang){
    var qn=norm(q); var m;

    /* ── Compound interest ── */
    m=qn.match(/r?\$?\s*([\d.,]+)\s*.*?(\d+(?:[,\.]\d+)?)\s*%.*?(?:ao?\s*(?:ano|mês|mes|month|year|a\.a\.|a\.m\.))\s*.*?(\d+)\s*(?:ano|mês|mes|month|year)/i);
    if(!m) m=qn.match(/(?:capital|principal|aplicação|investe|deposita?|valor)\s*[:\-]?\s*r?\$?\s*([\d.,]+).*?(\d+(?:[,\.]\d+)?)\s*%.*?(\d+)\s*(?:ano|mês|mes|month|year)/i);
    if(m){
      var P=num(m[1].replace(/\./g,'').replace(',','.')),r=num(m[2])/100,t=num(m[3]);
      var M=P*Math.pow(1+r,t),J=M-P;
      var periods=qn.match(/mês|mes|month/i)?'meses':'anos';
      return {
        answer: fmtMoney(M)+' | Juros: '+fmtMoney(J),
        steps: [
          '**Fórmula Juros Compostos:** M = P × (1 + i)ⁿ',
          '**Dados:** P = '+fmtMoney(P)+' | i = '+num(m[2])+'% | n = '+t+' '+periods,
          '**Fator:** (1 + '+r+')^'+t+' = '+fmtNum(Math.pow(1+r,t).toFixed(8)),
          '**Montante:** M = '+fmtMoney(P)+' × '+fmtNum(Math.pow(1+r,t).toFixed(6))+' = **'+fmtMoney(M)+'**',
          '**Juros:** J = M − P = **'+fmtMoney(J)+'**',
          '**Regra dos 72:** tempo para dobrar ≈ '+fmtNum((72/num(m[2])).toFixed(1))+' '+periods
        ].join('\n')
      };
    }

    /* ── Simple interest ── */
    m=qn.match(/juros simples.*?r?\$?\s*([\d.,]+).*?(\d+(?:[,\.]\d+)?)\s*%.*?(\d+)/i);
    if(!m) m=qn.match(/simple interest.*?\$?\s*([\d.,]+).*?(\d+(?:\.\d+)?)\s*%.*?(\d+)/i);
    if(m){
      var P2=num(m[1].replace(/\./g,'').replace(',','.')),r2=num(m[2])/100,t2=num(m[3]);
      var J2=P2*r2*t2,M2=P2+J2;
      return {
        answer: fmtMoney(M2)+' | Juros: '+fmtMoney(J2),
        steps: '**J = P × i × t**\n= '+fmtMoney(P2)+' × '+r2+' × '+t2+'\n= **'+fmtMoney(J2)+'**\n**M = P + J = '+fmtMoney(P2)+' + '+fmtMoney(J2)+' = **'+fmtMoney(M2)+'**'
      };
    }

    /* ── Loan / annuity / parcela ── */
    m=qn.match(/(?:financiamento|empréstimo|loan|parcela[s]?|installment[s]?|prestação).*?r?\$?\s*([\d.,]+).*?(\d+(?:[,\.]\d+)?)\s*%.*?(?:em\s+)?(\d+)\s*(?:parcelas?|meses?|months?|installments?)/i);
    if(!m) m=qn.match(/r?\$?\s*([\d.,]+).*?(\d+(?:[,\.]\d+)?)\s*%\s*(?:ao?\.?\s*m(?:ês|es)?)?.*?(\d+)\s*(?:parcelas?|meses?)/i);
    if(m){
      var PV=num(m[1].replace(/\./g,'').replace(',','.')),ri=num(m[2])/100,ni=num(m[3]);
      var PMT=PV*ri/(1-Math.pow(1+ri,-ni));
      var totalPaid=PMT*ni,totalInterest=totalPaid-PV;
      return {
        answer: 'Parcela: '+fmtMoney(PMT)+'/mês | Total pago: '+fmtMoney(totalPaid),
        steps: [
          '**Fórmula PMT (Price/Tabela Price):**',
          'PMT = PV × i / (1 − (1+i)^−n)',
          '**Dados:** PV = '+fmtMoney(PV)+' | i = '+num(m[2])+'% a.m. | n = '+ni+' meses',
          'PMT = '+fmtMoney(PV)+' × '+ri+' / (1 − (1+'+ri+')^−'+ni+')',
          '= '+fmtMoney(PV)+' × '+ri+' / '+fmtNum((1-Math.pow(1+ri,-ni)).toFixed(8)),
          '**Parcela = '+fmtMoney(PMT)+'**',
          '**Total pago:** '+ni+' × '+fmtMoney(PMT)+' = '+fmtMoney(totalPaid),
          '**Juros totais:** '+fmtMoney(totalInterest)
        ].join('\n')
      };
    }

    /* ── CAGR ── */
    m=qn.match(/(?:cagr|crescimento\s+anual\s+composto|taxa\s+de\s+crescimento).*?r?\$?\s*([\d.,]+).*?r?\$?\s*([\d.,]+).*?(\d+)\s*(?:anos?|years?)/i);
    if(m){
      var sv=num(m[1].replace(/\./g,'').replace(',','.')),ev=num(m[2].replace(/\./g,'').replace(',','.')),yrs=num(m[3]);
      var cagrVal=(Math.pow(ev/sv,1/yrs)-1)*100;
      return {
        answer: 'CAGR = '+fmtNum(cagrVal.toFixed(2))+'% a.a.',
        steps: '**CAGR = (FV/PV)^(1/n) − 1**\n= ('+fmtMoney(ev)+' / '+fmtMoney(sv)+')^(1/'+yrs+') − 1\n= '+fmtNum(Math.pow(ev/sv,1/yrs).toFixed(6))+' − 1\n= **'+fmtNum(cagrVal.toFixed(2))+'% a.a.**'
      };
    }

    /* ── ROI ── */
    m=qn.match(/roi.*?r?\$?\s*([\d.,]+).*?r?\$?\s*([\d.,]+)/i);
    if(!m) m=qn.match(/retorno.*?investimento.*?r?\$?\s*([\d.,]+).*?r?\$?\s*([\d.,]+)/i);
    if(m){
      var gain=num(m[2].replace(/\./g,'').replace(',','.')),cost=num(m[1].replace(/\./g,'').replace(',','.'));
      var roiVal=(gain-cost)/cost*100;
      return {
        answer: 'ROI = '+fmtNum(roiVal.toFixed(2))+'%',
        steps: '**ROI = (Retorno − Custo) / Custo × 100**\n= ('+fmtMoney(gain)+' − '+fmtMoney(cost)+') / '+fmtMoney(cost)+' × 100\n= **'+fmtNum(roiVal.toFixed(2))+'%**'
      };
    }

    /* ── Break-even ── */
    m=qn.match(/(?:break.?even|ponto\s+de\s+equilíbrio|break\s+even).*?(?:fixo[s]?|fixed)\s*r?\$?\s*([\d.,]+).*?(?:preço|price)\s*r?\$?\s*([\d.,]+).*?(?:variável|variable)\s*r?\$?\s*([\d.,]+)/i);
    if(m){
      var fixed=num(m[1].replace(/\./g,'').replace(',','.')),price=num(m[2].replace(/\./g,'').replace(',','.')),varC=num(m[3].replace(/\./g,'').replace(',','.'));
      var beUnits=fixed/(price-varC),beRev=beUnits*price;
      return {
        answer: fmtNum(Math.ceil(beUnits))+' unidades | Receita: '+fmtMoney(beRev),
        steps: '**Ponto de Equilíbrio = Custo Fixo / (Preço − Custo Variável)**\n= '+fmtMoney(fixed)+' / ('+fmtMoney(price)+' − '+fmtMoney(varC)+')\n= '+fmtMoney(fixed)+' / '+fmtMoney(price-varC)+'\n= **'+fmtNum(beUnits.toFixed(2))+' unidades**\n**Receita break-even:** '+fmtNum(Math.ceil(beUnits))+' × '+fmtMoney(price)+' = **'+fmtMoney(beRev)+'**'
      };
    }

    /* ── NPV ── */
    m=qn.match(/(?:vpl|vpn|npv|valor presente líquido).*?(\d+(?:[,\.]\d+)?)\s*%/i);
    if(m){
      var nums=allNums(q);
      if(nums.length>=3){
        var rateN=nums[0]/100,flows=nums.slice(1);
        var npvVal=flows.reduce(function(s,cf,t){ return s+cf/Math.pow(1+rateN,t+1); },0);
        var stepsNPV=flows.map(function(cf,t){ return '  FC'+(t+1)+' = '+fmtMoney(cf)+' / (1+'+rateN+')^'+(t+1)+' = '+fmtMoney(cf/Math.pow(1+rateN,t+1)); });
        return {
          answer: 'VPL = '+fmtMoney(npvVal)+' ('+(npvVal>0?'VIÁVEL — aceitar':'NÃO VIÁVEL — rejeitar')+')',
          steps: '**VPL = Σ FCt / (1+i)^t**\n**Taxa:** '+nums[0]+'%\n'+stepsNPV.join('\n')+'\n**VPL = **'+fmtMoney(npvVal)+'**'
        };
      }
    }

    /* ── Dividend Yield ── */
    m=qn.match(/(?:dividend yield|dy|rendimento de dividendos).*?r?\$?\s*([\d.,]+).*?r?\$?\s*([\d.,]+)/i);
    if(m){
      var divAnn=num(m[1].replace(',','.')),priceS=num(m[2].replace(',','.'));
      var dyVal=divAnn/priceS*100;
      return {
        answer: 'DY = '+fmtNum(dyVal.toFixed(2))+'%',
        steps: '**DY = Dividendo Anual / Preço × 100**\n= '+fmtMoney(divAnn)+' / '+fmtMoney(priceS)+' × 100\n= **'+fmtNum(dyVal.toFixed(2))+'%**'
      };
    }

    /* ── P/E ratio ── */
    m=qn.match(/(?:p\/l|p\/e|preço.*lucro|price.*earning).*?r?\$?\s*([\d.,]+).*?r?\$?\s*([\d.,]+)/i);
    if(m){
      var priceE=num(m[1].replace(',','.')),epsV=num(m[2].replace(',','.'));
      var peVal=priceE/epsV;
      return {
        answer: 'P/L = '+fmtNum(peVal.toFixed(2))+'x',
        steps: '**P/L = Preço / LPA**\n= '+fmtMoney(priceE)+' / '+fmtMoney(epsV)+'\n= **'+fmtNum(peVal.toFixed(2))+'x**\n_Interpretação: o mercado paga '+fmtNum(peVal.toFixed(1))+'× o lucro anual por ação._'
      };
    }

    /* ── Effective Annual Rate / EAR ── */
    m=qn.match(/(?:taxa efetiva|ear|effective annual).*?(\d+(?:[,\.]\d+)?)\s*%.*?(\d+)\s*(?:vezes|times|períodos?|ao\s*mês|a\.m\.)/i);
    if(m){
      var nomR=num(m[1])/100,nComp=num(m[2]);
      var earVal=(Math.pow(1+nomR/nComp,nComp)-1)*100;
      return {
        answer: 'TEA = '+fmtNum(earVal.toFixed(4))+'% a.a.',
        steps: '**EAR = (1 + i_nom/n)^n − 1**\n= (1 + '+nomR+'/'+nComp+')^'+nComp+' − 1\n= '+fmtNum(Math.pow(1+nomR/nComp,nComp).toFixed(8))+' − 1\n= **'+fmtNum(earVal.toFixed(4))+'%**'
      };
    }

    /* ── Inflation-adjusted return ── */
    m=qn.match(/(?:retorno real|real return|taxa real).*?(\d+(?:[,\.]\d+)?)\s*%.*?inflação.*?(\d+(?:[,\.]\d+)?)\s*%/i);
    if(!m) m=qn.match(/(\d+(?:[,\.]\d+)?)\s*%.*?(?:nominal|brut[oa]).*?(\d+(?:[,\.]\d+)?)\s*%.*?inflação/i);
    if(m){
      var nomRet=num(m[1])/100,inflRate=num(m[2])/100;
      var realRet=((1+nomRet)/(1+inflRate)-1)*100;
      return {
        answer: 'Retorno Real = '+fmtNum(realRet.toFixed(4))+'%',
        steps: '**Fisher:** (1+r_real) = (1+r_nom) / (1+inflação)\n= (1+'+nomRet+') / (1+'+inflRate+')\n= '+fmtNum((1+nomRet).toFixed(6))+' / '+fmtNum((1+inflRate).toFixed(6))+'\n= **'+fmtNum(realRet.toFixed(4))+'%**'
      };
    }

    /* ── Future Value of regular annuity ── */
    m=qn.match(/(?:poupança|poupa|saving|depósito|deposit).*?r?\$?\s*([\d.,]+)\s*(?:por mês|monthly|ao mês|mensal).*?(\d+(?:[,\.]\d+)?)\s*%.*?(\d+)\s*(?:meses?|years?|anos?)/i);
    if(m){
      var pmtFV=num(m[1].replace(/\./g,'').replace(',','.')),rFV=num(m[2])/100,nFV=num(m[3]);
      var fvaVal=pmtFV*(Math.pow(1+rFV,nFV)-1)/rFV;
      return {
        answer: 'Valor Acumulado = '+fmtMoney(fvaVal),
        steps: [
          '**Fórmula FVA (Valor Futuro da Anuidade):**',
          'FVA = PMT × [(1+i)^n − 1] / i',
          '= '+fmtMoney(pmtFV)+' × [(1+'+rFV+')^'+nFV+' − 1] / '+rFV,
          '= '+fmtMoney(pmtFV)+' × '+fmtNum((Math.pow(1+rFV,nFV)-1).toFixed(6))+' / '+rFV,
          '= **'+fmtMoney(fvaVal)+'**',
          'Total depositado: '+fmtMoney(pmtFV*nFV),
          'Juros acumulados: '+fmtMoney(fvaVal-pmtFV*nFV)
        ].join('\n')
      };
    }

    return null;
  });

  /* ── §3.5  Mixture / rule of three / proportion ── */
  SOLVERS.push(function proportionSolver(q, lang){
    var qn=norm(q); var m;
    m=qn.match(/se\s+(\d+(?:[,\.]\d+)?)\s+\w+\s+(?:custa[m]?|vale[m]?|pesam?|medem?|rendem?|produzem?|demoram?|levam?)\s+(\d+(?:[,\.]\d+)?)\s*\w*,\s*(?:quanto|quant\w+)\s+(?:\w+\s+)?(\d+(?:[,\.]\d+)?)/i);
    if(!m) m=qn.match(/if\s+(\d+(?:\.\d+)?)\s+\w+\s+(?:cost|weigh|take|produce|yield|measure)\s+(\d+(?:\.\d+)?)\s*\w*,?\s+(?:how much|how many).*?(\d+(?:\.\d+)?)/i);
    if(m){
      var a=num(m[1]),b=num(m[2]),c=num(m[3]),x=b*c/a;
      return { answer: fmtNum(x), steps: '**Regra de Três:**\n'+a+' ──→ '+b+'\n'+c+' ──→ x\nx = ('+b+' × '+c+') ÷ '+a+' = **'+fmtNum(x)+'**' };
    }
    m=qn.match(/(\d+(?:[,\.]\d+)?)\s*l(?:itros?)?\s+(?:com\s+)?(\d+(?:[,\.]\d+)?)\s*%.*?(\d+(?:[,\.]\d+)?)\s*l(?:itros?)?\s+(?:com\s+)?(\d+(?:[,\.]\d+)?)\s*%/i);
    if(m){
      var v1=num(m[1]),c1=num(m[2])/100,v2=num(m[3]),c2=num(m[4])/100;
      var vTot=v1+v2,cFinal=(v1*c1+v2*c2)/vTot;
      return { answer: fmtNum((cFinal*100).toFixed(4))+'%',
               steps: '**Mistura:**\nSolução A: '+v1+'L × '+(c1*100)+'% = '+fmtNum(v1*c1*100)+'mL\nSolução B: '+v2+'L × '+(c2*100)+'% = '+fmtNum(v2*c2*100)+'mL\nTotal: '+(v1+v2)+'L, '+fmtNum(v1*c1*100+v2*c2*100)+'mL\n**Concentração = '+fmtNum((cFinal*100).toFixed(4))+'%**' };
    }
    return null;
  });

  /* ── §3.6  Quadratic equations ── */
  SOLVERS.push(function quadraticSolver(q, lang){
    var qn=norm(q);
    var m=qn.match(/(-?\d*(?:[,\.]\d+)?)\s*x[²2]\s*([+\-]\s*\d*(?:[,\.]\d+)?)\s*x\s*([+\-]\s*\d+(?:[,\.]\d+)?)\s*(?:=\s*0)?/i);
    if(!m) return null;
    var as=m[1].replace(',','.'), bs=m[2].replace(/\s/g,'').replace(',','.'), cs=m[3].replace(/\s/g,'').replace(',','.');
    var a=num(as==='x'||as===''?'1':as==='-x'?'-1':as.replace(/x.*/,'')||as);
    var b=num(bs), c=num(cs);
    if(isNaN(a)||isNaN(b)||isNaN(c)) return null;
    var disc=b*b-4*a*c;
    var steps=['**Equação:** '+a+'x² + ('+b+')x + ('+c+') = 0','**Bhaskara:** x = (−b ± √Δ) / 2a','**Δ = '+fmtNum(b)+'² − 4×'+a+'×'+c+' = '+fmtNum(b*b)+' − '+fmtNum(4*a*c)+' = **'+fmtNum(disc)+'**'];
    var ans;
    if(disc>0){
      var x1=(-b+Math.sqrt(disc))/(2*a),x2=(-b-Math.sqrt(disc))/(2*a);
      steps.push('**x₁ = ('+fmtNum(-b)+' + √'+fmtNum(disc)+') / '+fmtNum(2*a)+' = **'+fmtNum(x1.toFixed(6))+'**');
      steps.push('**x₂ = ('+fmtNum(-b)+' − √'+fmtNum(disc)+') / '+fmtNum(2*a)+' = **'+fmtNum(x2.toFixed(6))+'**');
      steps.push('**Vieta:** x₁+x₂ = '+fmtNum(x1+x2)+' (esp: '+fmtNum(-b/a)+') | x₁×x₂ = '+fmtNum(x1*x2)+' (esp: '+fmtNum(c/a)+')');
      ans='x₁ = '+fmtNum(x1.toFixed(6))+' | x₂ = '+fmtNum(x2.toFixed(6));
    } else if(disc===0){
      var x0=-b/(2*a);
      steps.push('**Δ = 0 → raiz dupla:** x = −b/2a = **'+fmtNum(x0)+'**');
      ans='x = '+fmtNum(x0)+' (raiz dupla)';
    } else {
      var re=-b/(2*a),im=Math.sqrt(-disc)/(2*a);
      steps.push('**Δ < 0 → complexas:** x = '+fmtNum(re)+' ± '+fmtNum(im.toFixed(6))+'i');
      ans='x = '+fmtNum(re)+' ± '+fmtNum(im.toFixed(6))+'i';
    }
    return { answer: ans, steps: steps.join('\n') };
  });

  /* ── §3.7  Geometry — expanded ── */
  SOLVERS.push(function geometrySolver(q, lang){
    var qn=norm(q); var m;

    /* Circle */
    m=qn.match(/(?:círculo|circle|circunferência)\s+.*?(?:raio|radius|radio)\s+(?:de\s+)?(\d+(?:[,\.]\d+)?)/i);
    if(!m) m=qn.match(/(?:raio|radius)\s+(?:de\s+)?(\d+(?:[,\.]\d+)?)\s+.*?(?:área|area|circunferência)/i);
    if(m){
      var r=num(m[1]);
      var A=Math.PI*r*r, C=2*Math.PI*r;
      return { answer: 'Área = '+fmtNum(A.toFixed(6))+' u² | Circunf. = '+fmtNum(C.toFixed(6))+' u',
               steps: '**Círculo r = '+r+'**\nA = π × r² = π × '+r+'² = **'+fmtNum(A.toFixed(6))+' u²**\nC = 2πr = **'+fmtNum(C.toFixed(6))+' u**\nDiâmetro = **'+fmtNum(2*r)+'** u' };
    }

    /* Sphere */
    m=qn.match(/(?:esfera|sphere)\s+.*?(?:raio|radius)\s+(?:de\s+)?(\d+(?:[,\.]\d+)?)/i);
    if(m){
      var rs=num(m[1]),Vs=4*Math.PI*rs*rs*rs/3,As=4*Math.PI*rs*rs;
      return { answer: 'Volume = '+fmtNum(Vs.toFixed(6))+' u³ | Superfície = '+fmtNum(As.toFixed(6))+' u²',
               steps: '**Esfera r = '+rs+'**\nV = 4πr³/3 = **'+fmtNum(Vs.toFixed(6))+' u³**\nA = 4πr² = **'+fmtNum(As.toFixed(6))+' u²**' };
    }

    /* Cylinder */
    m=qn.match(/(?:cilindro|cylinder|cilindro)\s+.*?(?:raio|radius)\s+(?:de\s+)?(\d+(?:[,\.]\d+)?).*?(?:altura|height|alto)\s+(?:de\s+)?(\d+(?:[,\.]\d+)?)/i);
    if(!m) m=qn.match(/(?:cilindro|cylinder).*?(\d+(?:[,\.]\d+)?)\s*[,e]\s*(\d+(?:[,\.]\d+)?)/i);
    if(m){
      var rc=num(m[1]),hc=num(m[2]),Vc=Math.PI*rc*rc*hc,Ac=2*Math.PI*rc*(rc+hc);
      return { answer: 'Volume = '+fmtNum(Vc.toFixed(6))+' u³ | Sup. Total = '+fmtNum(Ac.toFixed(6))+' u²',
               steps: '**Cilindro r='+rc+', h='+hc+'**\nV = πr²h = **'+fmtNum(Vc.toFixed(6))+' u³**\nA = 2πr(r+h) = **'+fmtNum(Ac.toFixed(6))+' u²**' };
    }

    /* Cone */
    m=qn.match(/(?:cone|cone)\s+.*?(?:raio|radius)\s+(?:de\s+)?(\d+(?:[,\.]\d+)?).*?(?:altura|height)\s+(?:de\s+)?(\d+(?:[,\.]\d+)?)/i);
    if(m){
      var rco=num(m[1]),hco=num(m[2]),Vco=Math.PI*rco*rco*hco/3,l=Math.sqrt(rco*rco+hco*hco),Aco=Math.PI*rco*(rco+l);
      return { answer: 'Volume = '+fmtNum(Vco.toFixed(6))+' u³ | Geratriz = '+fmtNum(l.toFixed(4))+' u',
               steps: '**Cone r='+rco+', h='+hco+'**\nGeratriz: l = √(r²+h²) = **'+fmtNum(l.toFixed(4))+'**\nV = πr²h/3 = **'+fmtNum(Vco.toFixed(6))+' u³**\nA total = πr(r+l) = **'+fmtNum(Aco.toFixed(6))+' u²**' };
    }

    /* Rectangle */
    m=qn.match(/(?:retângulo|rectangle).*?(\d+(?:[,\.]\d+)?)\s*(?:por|by|×|x)\s*(\d+(?:[,\.]\d+)?)/i);
    if(!m) m=qn.match(/(?:base|comprimento)\s*(?:de\s*)?(\d+(?:[,\.]\d+)?).*?(?:altura|largura|width)\s*(?:de\s*)?(\d+(?:[,\.]\d+)?)/i);
    if(m){
      var b=num(m[1]),h=num(m[2]),A2=b*h,P=2*(b+h),diag=Math.sqrt(b*b+h*h);
      return { answer: 'Área = '+fmtNum(A2)+' u² | Perímetro = '+fmtNum(P)+' u | Diagonal = '+fmtNum(diag.toFixed(4))+' u',
               steps: '**Retângulo b='+b+', h='+h+'**\nA = b×h = **'+fmtNum(A2)+' u²**\nP = 2(b+h) = **'+fmtNum(P)+' u**\nDiagonal = √(b²+h²) = **'+fmtNum(diag.toFixed(4))+' u**' };
    }

    /* Triangle area */
    m=qn.match(/(?:triângulo|triangle|triángulo).*?(?:base|b)\s*(?:=\s*|de\s*)?(\d+(?:[,\.]\d+)?).*?(?:altura|h(?:eight)?)\s*(?:=\s*|de\s*)?(\d+(?:[,\.]\d+)?)/i);
    if(m){
      var bt=num(m[1]),ht=num(m[2]),At=bt*ht/2;
      return { answer: 'Área = '+fmtNum(At)+' u²',
               steps: '**Triângulo b='+bt+', h='+ht+'**\nA = (b×h)/2 = ('+bt+'×'+ht+')/2 = **'+fmtNum(At)+' u²**' };
    }

    /* Heron's formula */
    m=qn.match(/(?:triângulo|triangle|heron).*?(?:lados?|sides?)\s*[:\-]?\s*(\d+(?:[,\.]\d+)?)\s*[,e\s]+(\d+(?:[,\.]\d+)?)\s*[,e\s]+(\d+(?:[,\.]\d+)?)/i);
    if(m){
      var a=num(m[1]),b=num(m[2]),c=num(m[3]);
      var s=(a+b+c)/2, Ah=Math.sqrt(s*(s-a)*(s-b)*(s-c));
      if(isNaN(Ah)||Ah<=0) return null;
      return { answer: 'Área = '+fmtNum(Ah.toFixed(6))+' u²',
               steps: '**Fórmula de Herão — lados '+a+', '+b+', '+c+'**\ns = ('+a+'+'+b+'+'+c+')/2 = **'+fmtNum(s)+'**\nA = √(s(s-a)(s-b)(s-c))\n= √('+fmtNum(s)+'×'+fmtNum(s-a)+'×'+fmtNum(s-b)+'×'+fmtNum(s-c)+')\n= **'+fmtNum(Ah.toFixed(6))+' u²**' };
    }

    /* Pythagorean theorem */
    m=qn.match(/(?:cateto|leg)\s+(?:de\s+)?(\d+(?:[,\.]\d+)?).*?(?:cateto|leg)\s+(?:de\s+)?(\d+(?:[,\.]\d+)?)/i);
    if(!m) m=qn.match(/(?:triângulo retângulo|right triangle).*?(\d+(?:[,\.]\d+)?)\s*[,e\s]+(\d+(?:[,\.]\d+)?)/i);
    if(m && /pit[aá]g|hypotenuse|hipotenusa/i.test(qn)){
      var c1=num(m[1]),c2=num(m[2]),hip=Math.sqrt(c1*c1+c2*c2);
      return { answer: 'Hipotenusa = '+fmtNum(hip.toFixed(6)),
               steps: '**Pitágoras:** c² = a² + b²\n= '+c1+'² + '+c2+'² = '+fmtNum(c1*c1)+' + '+fmtNum(c2*c2)+' = '+fmtNum(c1*c1+c2*c2)+'\n**c = √'+fmtNum(c1*c1+c2*c2)+' = **'+fmtNum(hip.toFixed(6))+'**' };
    }

    /* Trapezoid */
    m=qn.match(/(?:trapézio|trapezoid|trapezium).*?(\d+(?:[,\.]\d+)?).*?(\d+(?:[,\.]\d+)?).*?(?:altura|height)\s*(?:de\s*)?(\d+(?:[,\.]\d+)?)/i);
    if(m){
      var b1=num(m[1]),b2=num(m[2]),htrap=num(m[3]),Atrap=(b1+b2)*htrap/2;
      return { answer: 'Área = '+fmtNum(Atrap)+' u²',
               steps: '**Trapézio:** A = (b₁+b₂)×h/2\n= ('+b1+'+'+b2+')×'+htrap+'/2 = '+fmtNum(b1+b2)+'×'+htrap+'/2 = **'+fmtNum(Atrap)+' u²**' };
    }

    /* Ellipse */
    m=qn.match(/(?:elipse|ellipse).*?(?:semi.?eixo|semi.?axis)\s*a\s*=?\s*(\d+(?:[,\.]\d+)?).*?b\s*=?\s*(\d+(?:[,\.]\d+)?)/i);
    if(m){
      var ea=num(m[1]),eb=num(m[2]),Aell=Math.PI*ea*eb;
      return { answer: 'Área = '+fmtNum(Aell.toFixed(6))+' u²',
               steps: '**Elipse a='+ea+', b='+eb+'**\nA = π×a×b = **'+fmtNum(Aell.toFixed(6))+' u²**' };
    }

    /* Regular polygon */
    m=qn.match(/(?:polígono regular|regular polygon)\s+(?:de\s+)?(\d+)\s*(?:lados?|sides?).*?(?:lado|side)\s*(?:de\s*)?(\d+(?:[,\.]\d+)?)/i);
    if(m){
      var nn=+m[1],sn=num(m[2]);
      var An=nn*sn*sn/(4*Math.tan(Math.PI/nn)),Pn=nn*sn;
      return { answer: 'Área = '+fmtNum(An.toFixed(6))+' u² | Perímetro = '+fmtNum(Pn)+' u',
               steps: '**Polígono regular n='+nn+', lado='+sn+'**\nA = n×s²/(4×tan(π/n)) = **'+fmtNum(An.toFixed(6))+' u²**\nP = n×s = **'+fmtNum(Pn)+' u**' };
    }

    /* Torus */
    m=qn.match(/(?:torus|toro).*?(?:R|raio maior)\s*=?\s*(\d+(?:[,\.]\d+)?).*?(?:r|raio menor)\s*=?\s*(\d+(?:[,\.]\d+)?)/i);
    if(m){
      var Rt=num(m[1]),rt=num(m[2]);
      var Vtorus=2*Math.PI*Math.PI*Rt*rt*rt,Storus=4*Math.PI*Math.PI*Rt*rt;
      return { answer: 'Volume = '+fmtNum(Vtorus.toFixed(4))+' u³ | Superfície = '+fmtNum(Storus.toFixed(4))+' u²',
               steps: '**Torus R='+Rt+', r='+rt+'**\nV = 2π²Rr² = **'+fmtNum(Vtorus.toFixed(4))+' u³**\nS = 4π²Rr = **'+fmtNum(Storus.toFixed(4))+' u²**' };
    }

    return null;
  });

  /* ── §3.8  Combinatorics ── */
  SOLVERS.push(function combinSolver(q, lang){
    var qn=norm(q);
    var mComb=qn.match(/(?:combinaç(?:ão|oes)|combinations?|escolher|choose|selecionar)\s+.*?(\d+)\s+(?:de|from|entre|of|em)\s+(\d+)/i);
    if(mComb){
      var r=+mComb[1],n=+mComb[2]; if(r>n){var tmp=r;r=n;n=tmp;}
      var c=MATH_ENV.comb(n,r);
      return { answer: 'C('+n+','+r+') = '+fmtNum(c),
               steps: '**C(n,r) = n! / (r!(n−r)!)**\nC('+n+','+r+') = '+n+'! / ('+r+'! × '+fmtNum(n-r)+'!) = **'+fmtNum(c)+'** maneiras' };
    }
    var mPerm=qn.match(/(?:permutaç(?:ão|oes)|arranjo|arrangement|permutation)\s+.*?(\d+)\s+(?:de|from|em)\s+(\d+)/i);
    if(mPerm){
      var n2=+mPerm[2],r2=+mPerm[1]; if(r2>n2){var tmp2=r2;r2=n2;n2=tmp2;}
      var p=MATH_ENV.perm(n2,r2);
      return { answer: 'A('+n2+','+r2+') = '+fmtNum(p),
               steps: '**A(n,r) = n!/(n−r)!**\n= '+n2+'!/'+fmtNum(n2-r2)+'! = **'+fmtNum(p)+'** arranjos' };
    }
    var mFact=qn.match(/(\d+)\s*!|\bfatorial\s+(?:de\s+)?(\d+)/i);
    if(mFact){
      var nf=+(mFact[1]||mFact[2]),f=MATH_ENV.fact(nf);
      if(f===Infinity) return { answer: nf+'! > 10¹⁷⁰ (overflow)', steps: 'Fatorial muito grande para float64.' };
      return { answer: nf+'! = '+fmtNum(f), steps: nf+'! = **'+fmtNum(f)+'**' };
    }
    /* Derangement */
    var mDer=qn.match(/(?:desarranjo|derangement|permutação caótica)\s+.*?(\d+)/i);
    if(mDer){ var nd=+mDer[1],Dn=MATH_ENV.derange(nd); return { answer: 'D('+nd+') = '+Dn, steps: '**Desarranjo D(n) ≈ n!/e**\nD('+nd+') = **'+Dn+'**' }; }
    /* Catalan */
    var mCat=qn.match(/catalan\s+(?:número\s+)?(\d+)/i);
    if(mCat){ var nc=+mCat[1],Cn=MATH_ENV.catalan(nc); return { answer: 'C'+nc+' = '+fmtNum(Cn), steps: 'Número de Catalan C('+nc+') = C('+fmtNum(2*nc)+','+nc+')/('+nc+'+1) = **'+fmtNum(Cn)+'**' }; }
    return null;
  });

  /* ── §3.9  Sequences ── */
  SOLVERS.push(function sequenceSolver(q, lang){
    var qn=norm(q),nums=allNums(q);
    var mPA=qn.match(/(?:p\.?a\.?|progressão aritmética|arithmetic (?:progression|sequence))/i);
    if(mPA&&nums.length>=2){
      var t1m=qn.match(/(?:primeiro\s+termo|a1|a₁|first\s+term)\s*[=:]\s*(\d+(?:[,\.]\d+)?)/i);
      var rm=qn.match(/(?:razão|ratio|r)\s*[=:]\s*(\d+(?:[,\.]\d+)?)/i);
      var nm=qn.match(/(?:termo\s+|term\s+)(\d+)/i);
      var snm=qn.match(/soma\s+(?:dos\s+primeiros\s+|of\s+(?:the\s+)?first\s+)?(\d+)/i);
      if(t1m&&rm){
        var a1=num(t1m[1]),r=num(rm[1]);
        if(nm){ var n=+nm[1],an=a1+(n-1)*r; return { answer: 'a'+n+' = '+fmtNum(an), steps: '**aₙ = a₁+(n−1)r**\na'+n+' = '+a1+'+'+(n-1)+'×'+r+' = **'+fmtNum(an)+'**' }; }
        if(snm){ var sn=+snm[1],S=sn*(2*a1+(sn-1)*r)/2; return { answer: 'S'+sn+' = '+fmtNum(S), steps: '**Sₙ = n(2a₁+(n−1)r)/2**\nS'+sn+' = '+sn+'×(2×'+a1+'+'+(sn-1)+'×'+r+')/2 = **'+fmtNum(S)+'**' }; }
      }
    }
    var mPG=qn.match(/(?:p\.?g\.?|progressão geométrica|geometric (?:progression|sequence))/i);
    if(mPG&&nums.length>=2){
      var t1g=qn.match(/(?:primeiro\s+termo|a1|a₁|first\s+term)\s*[=:]\s*(\d+(?:[,\.]\d+)?)/i);
      var qg=qn.match(/(?:razão|ratio|q)\s*[=:]\s*(\d+(?:[,\.]\d+)?)/i);
      var ng=qn.match(/(?:termo\s+|term\s+)(\d+)/i);
      if(t1g&&qg&&ng){ var a1g=num(t1g[1]),qv=num(qg[1]),nv=+ng[1],ang=a1g*Math.pow(qv,nv-1); return { answer: 'a'+nv+' = '+fmtNum(ang), steps: '**aₙ = a₁×qⁿ⁻¹**\na'+nv+' = '+a1g+'×'+qv+'^'+(nv-1)+' = **'+fmtNum(ang)+'**' }; }
    }
    /* Fibonacci */
    var mFib=qn.match(/fibonacci.*?(\d+)/i);
    if(mFib){ var fi=+mFib[1],fibv=MATH_ENV.fib(fi); return { answer: 'F('+fi+') = '+fmtNum(fibv), steps: '**Fibonacci F('+fi+') = **'+fmtNum(fibv) }; }
    return null;
  });

  /* ── §3.10  Sets / Venn ── */
  SOLVERS.push(function setsSolver(q, lang){
    var qn=norm(q);
    var m=qn.match(/(\d+)\s+\w+\s+(?:gosta[m]?\s+de|like[s]?|pratica[m]?|sabem?|falam?|estudam?)\s+\w+.*?(\d+)\s+\w+\s+(?:gosta[m]?\s+de|like[s]?|pratica[m]?|sabem?|falam?|estudam?)\s+\w+.*?(\d+)\s+(?:gosta[m]?\s+de|like[s]?|ambos|both|os\s+dois)/i);
    if(m){ var A=+m[1],B=+m[2],AB=+m[3],AuB=A+B-AB; return { answer: 'A∪B = '+AuB, steps: '**|A∪B| = |A|+|B|−|A∩B|**\n= '+A+'+'+B+'−'+AB+' = **'+AuB+'**' }; }
    var m2=qn.match(/total\s+(?:de\s+)?(\d+).*?(\d+)\s+\w+\s+(?:gosta[m]?\s+de|like[s]?)\s+\w+.*?(\d+)\s+\w+\s+(?:gosta[m]?\s+de|like[s]?)\s+\w+.*?(\d+)\s+(?:gosta[m]?\s+de|like[s]?)\s+(?:ambos|both|os\s+dois)/i);
    if(m2){ var N=+m2[1],Aa=+m2[2],Bb=+m2[4],ABb=+m2[6],soA=Aa-ABb,soB=Bb-ABb,nenhum=N-(Aa+Bb-ABb); return { answer: 'Só A: '+soA+' | Só B: '+soB+' | Ambos: '+ABb+' | Nenhum: '+nenhum, steps: '**Venn:** Só A='+Aa+'−'+ABb+'='+soA+' | Só B='+Bb+'−'+ABb+'='+soB+' | Nenhum='+N+'−'+(Aa+Bb-ABb)+'='+nenhum }; }
    return null;
  });

  /* ── §3.11  Age problems ── */
  SOLVERS.push(function ageSolver(q, lang){
    var qn=norm(q);
    var m=qn.match(/(\w+)\s+tem\s+(\d+)\s+anos.*?(\w+)\s+tem\s+(\d+)\s+anos.*?(?:daqui\s+a|em)\s+(\d+)\s+anos/i);
    if(!m) m=qn.match(/(\w+)\s+is\s+(\d+)\s+years.*?(\w+)\s+is\s+(\d+)\s+years.*?in\s+(\d+)\s+years/i);
    if(m){ var n1=m[1],a1=+m[2],n2=m[3],a2=+m[4],dt=+m[5]; return { answer: n1+': '+(a1+dt)+' anos, '+n2+': '+(a2+dt)+' anos', steps: n1+': '+a1+'+'+dt+' = **'+(a1+dt)+'** | '+n2+': '+a2+'+'+dt+' = **'+(a2+dt)+'**' }; }
    m=qn.match(/(\w+)\s+tem\s+(\w+)\s+vez(?:es)?\s+(?:a\s+)?(?:idade|anos)\s+(?:de|que)\s+(\w+).*?(?:somam?|juntos|total)\s+(\d+)/i);
    if(m){
      var mult={'dobro':2,'duplo':2,'triplo':3,'metade':0.5}[m[2].toLowerCase()]||2;
      var total=+m[4],bAge=total/(mult+1),aAge=mult*bAge;
      return { answer: m[1]+': '+fmtNum(aAge.toFixed(1))+' | '+m[3]+': '+fmtNum(bAge.toFixed(1)), steps: 'a='+mult+'b, a+b='+total+' → '+fmtNum(mult+1)+'b='+total+' → b=**'+fmtNum(bAge.toFixed(1))+'**, a=**'+fmtNum(aAge.toFixed(1))+'**' };
    }
    return null;
  });

  /* ── §3.12  Work rate problems ── */
  SOLVERS.push(function workSolver(q, lang){
    var qn=norm(q);
    var m=qn.match(/(\w+)\s+(?:faz|conclui|completa|pinta|constrói|termina)\s+\w+\s+(?:em|in)\s+(\d+(?:[,\.]\d+)?)\s*(?:dias?|horas?|days?|hours?).*?(\w+)\s+(?:faz|conclui|completa|pinta|constrói|termina)\s+\w+\s+(?:em|in)\s+(\d+(?:[,\.]\d+)?)/i);
    if(!m) m=qn.match(/(?:A|worker)\s*.*?(\d+(?:\.\d+)?)\s*(?:day|hour).*?(?:B|worker)\s*.*?(\d+(?:\.\d+)?)\s*(?:day|hour)/i);
    if(m){
      var na=m[1]||'A',ta=num(m[2]),nb=m[3]||'B',tb=num(m[4]||m[2]);
      if(!ta||!tb) return null;
      var together=1/(1/ta+1/tb);
      return { answer: fmtNum(together.toFixed(6))+' unidades de tempo',
               steps: '**Trabalho conjunto:**\n'+na+': 1/'+ta+' por unidade\n'+nb+': 1/'+tb+' por unidade\nJuntos: 1/'+ta+'+1/'+tb+' = '+fmtNum(ta+tb)+'/'+(ta*tb)+'\n**Tempo = '+fmtNum(ta*tb)+'/'+fmtNum(ta+tb)+' = **'+fmtNum(together.toFixed(6))+'**' };
    }
    return null;
  });

  /* ── §3.13  Statistics ── */
  SOLVERS.push(function statsSolver(q, lang){
    var qn=norm(q),nums=allNums(q);
    if(nums.length<2) return null;
    var wMean=/(?:média|mean|promedio|calcule\s+a\s+média)/i.test(qn);
    var wMed=/(?:mediana|median)/i.test(qn);
    var wMode=/(?:moda|mode)/i.test(qn);
    var wStd=/(?:desvio\s+padrão|standard\s+deviation|desviación)/i.test(qn);
    var wVar=/(?:variânc|variance|varianza)/i.test(qn);
    var wZ=/(?:z.?score|escore\s+z)/i.test(qn);
    if(!wMean&&!wMed&&!wMode&&!wStd&&!wVar&&!wZ) return null;
    var sorted=nums.slice().sort(function(a,b){return a-b;});
    var n=nums.length,meanV=nums.reduce(function(s,x){return s+x;},0)/n;
    var steps=[],answers=[];
    if(wMean){ steps.push('**Média:** ('+nums.join('+')+') ÷ '+n+' = **'+fmtNum(meanV.toFixed(6))+'**'); answers.push('x̄ = '+fmtNum(meanV.toFixed(4))); }
    if(wMed){ var mid=Math.floor(n/2),med=n%2===0?(sorted[mid-1]+sorted[mid])/2:sorted[mid]; steps.push('**Mediana:** ['+sorted.join(',')+'] → **'+fmtNum(med)+'**'); answers.push('Md = '+fmtNum(med)); }
    if(wMode){ var freq={};nums.forEach(function(x){freq[x]=(freq[x]||0)+1;});var mxF=Math.max.apply(null,Object.values(freq));var modes=Object.keys(freq).filter(function(k){return freq[k]===mxF;}).map(Number); steps.push('**Moda:** **'+modes.join(', ')+'** (freq='+mxF+')'); answers.push('Mo = '+modes.join(', ')); }
    if(wStd||wVar){ var v=nums.reduce(function(s,x){return s+(x-meanV)*(x-meanV);},0)/(n-1),sd=Math.sqrt(v); steps.push('**Variância s²:** '+fmtNum(v.toFixed(6))+'\n**Desvio Padrão s:** **'+fmtNum(sd.toFixed(6))+'**'); answers.push('s='+fmtNum(sd.toFixed(4))); }
    if(wZ&&nums.length>=3){ var zx=nums[0],zmu=nums[1],zsig=nums[2],zv=(zx-zmu)/zsig; steps.push('**Z-score:** ('+zx+'−'+zmu+')/'+zsig+' = **'+fmtNum(zv.toFixed(4))+'**\nP(X<'+zx+') ≈ '+fmtNum(MATH_ENV.normcdf(zv).toFixed(4))); answers.push('z='+fmtNum(zv.toFixed(4))); }
    return { answer: answers.join(' | '), steps: steps.join('\n\n') };
  });

  /* ── §3.14  Probability distributions ── NEW ── */
  SOLVERS.push(function probDistSolver(q, lang){
    var qn=norm(q); var m;
    /* Binomial: n, p, k */
    m=qn.match(/(?:binomial|binomi).*?n\s*=\s*(\d+).*?p\s*=\s*(\d+(?:[,\.]\d+)?).*?k\s*=\s*(\d+)/i);
    if(!m) m=qn.match(/(\d+)\s+ensaios?.*?prob(?:abilidade)?\s+(\d+(?:[,\.]\d+)?).*?exatamente\s+(\d+)/i);
    if(m){
      var nb=+m[1],pb=num(m[2].replace(',','.')),kb=+m[3];
      if(pb>1) pb=pb/100;
      var bpv=MATH_ENV.binomP(nb,kb,pb);
      var mean=nb*pb,std=Math.sqrt(nb*pb*(1-pb));
      return {
        answer: 'P(X='+kb+') = '+fmtNum(bpv.toFixed(6)),
        steps: '**Distribuição Binomial B(n='+nb+', p='+pb+')**\nP(X=k) = C(n,k)×pᵏ×(1−p)ⁿ⁻ᵏ\nP(X='+kb+') = C('+nb+','+kb+')×'+pb+'^'+kb+'×'+fmtNum(1-pb)+'^'+(nb-kb)+'\n= '+fmtNum(MATH_ENV.comb(nb,kb))+'×'+fmtNum(Math.pow(pb,kb).toFixed(8))+'×'+fmtNum(Math.pow(1-pb,nb-kb).toFixed(8))+'\n= **'+fmtNum(bpv.toFixed(6))+'**\n**E[X] = np = '+fmtNum(mean.toFixed(4))+'** | **σ = √(np(1−p)) = '+fmtNum(std.toFixed(4))+'**'
      };
    }
    /* Poisson */
    m=qn.match(/(?:poisson).*?(?:lambda|λ|media|média)\s*=?\s*(\d+(?:[,\.]\d+)?).*?k\s*=?\s*(\d+)/i);
    if(!m) m=qn.match(/(?:poisson).*?(\d+(?:[,\.]\d+)?)\s*(?:eventos?|ocorrências?).*?(?:exatamente\s+)?(\d+)/i);
    if(m){
      var lam=num(m[1].replace(',','.')),kp=+m[2];
      var ppv=MATH_ENV.poissonP(lam,kp);
      return {
        answer: 'P(X='+kp+') = '+fmtNum(ppv.toFixed(6)),
        steps: '**Distribuição Poisson (λ='+lam+')**\nP(X=k) = λᵏ × e^−λ / k!\nP(X='+kp+') = '+lam+'^'+kp+' × e^−'+lam+' / '+kp+'!\n= '+fmtNum(Math.pow(lam,kp).toFixed(6))+' × '+fmtNum(Math.exp(-lam).toFixed(8))+' / '+fmtNum(MATH_ENV.fact(kp))+'\n= **'+fmtNum(ppv.toFixed(6))+'**\n**E[X] = λ = '+lam+'** | **σ = √λ = '+fmtNum(Math.sqrt(lam).toFixed(4))+'**'
      };
    }
    /* Normal P(X < x) */
    m=qn.match(/(?:normal|gaussiana?).*?(?:μ|media|média)\s*=?\s*(\d+(?:[,\.]\d+)?).*?(?:σ|desvio)\s*=?\s*(\d+(?:[,\.]\d+)?).*?(?:x\s*<?=?\s*|menor\s+que\s+)(\d+(?:[,\.]\d+)?)/i);
    if(m){
      var mun=num(m[1]),sn=num(m[2]),xn=num(m[3]);
      var zn=(xn-mun)/sn,pn=MATH_ENV.normcdf(zn);
      return {
        answer: 'P(X < '+xn+') ≈ '+fmtNum(pn.toFixed(4)),
        steps: '**Distribuição Normal N(μ='+mun+', σ='+sn+')**\nZ = (x−μ)/σ = ('+xn+'−'+mun+')/'+sn+' = **'+fmtNum(zn.toFixed(4))+'**\nP(X < '+xn+') = Φ('+fmtNum(zn.toFixed(4))+') ≈ **'+fmtNum(pn.toFixed(4))+'** ('+fmtNum((pn*100).toFixed(2))+'%)'
      };
    }
    return null;
  });

  /* ── §3.15  Kinematics / Physics helpers ── NEW ── */
  SOLVERS.push(function kinematicsSolver(q, lang){
    var qn=norm(q); var m;
    /* MRUA: v = u + at */
    m=qn.match(/(?:velocidade\s+final|final\s+velocity|velocidad\s+final).*?(?:inicial|initial)\s*(?:v0|u|v₀)?\s*=?\s*(\d+(?:[,\.]\d+)?).*?(?:aceleração|acceleration|aceleración)\s*=?\s*(\d+(?:[,\.]\d+)?).*?(?:tempo|time|tiempo)\s*=?\s*(\d+(?:[,\.]\d+)?)/i);
    if(m){
      var u=num(m[1]),a=num(m[2]),t=num(m[3]),vf=u+a*t;
      return { answer: 'v = '+fmtNum(vf)+' m/s', steps: '**v = u + at**\n= '+u+' + '+a+'×'+t+' = **'+fmtNum(vf)+' m/s**' };
    }
    /* displacement s = ut + ½at² */
    m=qn.match(/(?:deslocamento|displacement|distância\s+percorrida).*?(?:inicial|initial)\s*(?:u|v₀|v0)?\s*=?\s*(\d+(?:[,\.]\d+)?).*?(?:aceleração|acceleration)\s*=?\s*(\d+(?:[,\.]\d+)?).*?(?:tempo|time)\s*=?\s*(\d+(?:[,\.]\d+)?)/i);
    if(m){
      var us=num(m[1]),as2=num(m[2]),ts=num(m[3]),s=us*ts+0.5*as2*ts*ts;
      return { answer: 's = '+fmtNum(s)+' m', steps: '**s = ut + ½at²**\n= '+us+'×'+ts+' + 0.5×'+as2+'×'+ts+'²\n= '+fmtNum(us*ts)+' + '+fmtNum(0.5*as2*ts*ts)+'\n= **'+fmtNum(s)+' m**' };
    }
    /* Energy: KE */
    m=qn.match(/(?:energia cinética|kinetic energy).*?(?:massa|mass)\s*=?\s*(\d+(?:[,\.]\d+)?).*?(?:velocidade|velocity|speed)\s*=?\s*(\d+(?:[,\.]\d+)?)/i);
    if(m){
      var mk=num(m[1]),vk=num(m[2]),ke=0.5*mk*vk*vk;
      return { answer: 'EC = '+fmtNum(ke)+' J', steps: '**EC = ½mv²**\n= 0.5 × '+mk+' × '+vk+'²\n= 0.5 × '+mk+' × '+fmtNum(vk*vk)+'\n= **'+fmtNum(ke)+' J**' };
    }
    /* Gravitational PE */
    m=qn.match(/(?:energia potencial|potential energy).*?(?:massa|mass)\s*=?\s*(\d+(?:[,\.]\d+)?).*?(?:altura|height)\s*=?\s*(\d+(?:[,\.]\d+)?)/i);
    if(m){
      var mp=num(m[1]),hp=num(m[2]),g=9.81,pe=mp*g*hp;
      return { answer: 'EP = '+fmtNum(pe)+' J', steps: '**EP = mgh**\n= '+mp+' × 9.81 × '+hp+'\n= **'+fmtNum(pe)+' J**' };
    }
    /* Ohm's law */
    m=qn.match(/(?:lei de ohm|ohm\'s law|tensão|voltage).*?(?:corrente|current)\s*=?\s*(\d+(?:[,\.]\d+)?).*?(?:resistência|resistance)\s*=?\s*(\d+(?:[,\.]\d+)?)/i);
    if(m){ var I=num(m[1]),R=num(m[2]),V=I*R; return { answer: 'V = '+fmtNum(V)+' V', steps: '**V = I × R**\n= '+I+' × '+R+' = **'+fmtNum(V)+' V**' }; }
    return null;
  });

  /* ── §3.16  Unit converter ── NEW ── */
  SOLVERS.push(function unitSolver(q, lang){
    var qn=norm(q); var m;
    var pairs=[
      [/(\d+(?:[,\.]\d+)?)\s*km(?:\s|$|\.).*?(?:em\s+)?milhas?|miles?/i, function(v){ return { answer: fmtNum((v*0.621371).toFixed(4))+' mi', steps: fmtNum(v)+' km × 0.621371 = **'+fmtNum((v*0.621371).toFixed(4))+' mi**' }; }],
      [/(\d+(?:[,\.]\d+)?)\s*milhas?|miles?.*?(?:em\s+)?km/i, function(v){ return { answer: fmtNum((v*1.60934).toFixed(4))+' km', steps: fmtNum(v)+' mi × 1.60934 = **'+fmtNum((v*1.60934).toFixed(4))+' km**' }; }],
      [/(\d+(?:[,\.]\d+)?)\s*°?c(?:elsius)?.*?(?:em\s+)?(?:fahrenheit|°?f)/i, function(v){ var f=v*9/5+32; return { answer: fmtNum(f.toFixed(2))+'°F', steps: fmtNum(v)+'°C × 9/5 + 32 = **'+fmtNum(f.toFixed(2))+'°F**' }; }],
      [/(\d+(?:[,\.]\d+)?)\s*°?f(?:ahrenheit)?.*?(?:em\s+)?(?:celsius|°?c)/i, function(v){ var c=(v-32)*5/9; return { answer: fmtNum(c.toFixed(2))+'°C', steps: '('+v+'−32) × 5/9 = **'+fmtNum(c.toFixed(2))+'°C**' }; }],
      [/(\d+(?:[,\.]\d+)?)\s*kg.*?(?:em\s+)?(?:lb|libras?|pounds?)/i, function(v){ return { answer: fmtNum((v*2.20462).toFixed(4))+' lb', steps: fmtNum(v)+' kg × 2.20462 = **'+fmtNum((v*2.20462).toFixed(4))+' lb**' }; }],
      [/(\d+(?:[,\.]\d+)?)\s*(?:lb|libras?|pounds?).*?(?:em\s+)?kg/i, function(v){ return { answer: fmtNum((v*0.453592).toFixed(4))+' kg', steps: fmtNum(v)+' lb × 0.453592 = **'+fmtNum((v*0.453592).toFixed(4))+' kg**' }; }],
      [/(\d+(?:[,\.]\d+)?)\s*m(?:\s|$|\.).*?(?:em\s+)?(?:ft|pés?|feet|foot)/i, function(v){ return { answer: fmtNum((v*3.28084).toFixed(4))+' ft', steps: fmtNum(v)+' m × 3.28084 = **'+fmtNum((v*3.28084).toFixed(4))+' ft**' }; }],
      [/(\d+(?:[,\.]\d+)?)\s*(?:ft|pés?|feet).*?(?:em\s+)?(?:m\b|metros?)/i, function(v){ return { answer: fmtNum((v*0.3048).toFixed(4))+' m', steps: fmtNum(v)+' ft × 0.3048 = **'+fmtNum((v*0.3048).toFixed(4))+' m**' }; }],
      [/(\d+(?:[,\.]\d+)?)\s*(?:litros?|liters?|l\b).*?(?:em\s+)?(?:galões?|gallons?)/i, function(v){ return { answer: fmtNum((v*0.264172).toFixed(4))+' gal', steps: fmtNum(v)+' L × 0.264172 = **'+fmtNum((v*0.264172).toFixed(4))+' gal**' }; }],
      [/(\d+(?:[,\.]\d+)?)\s*(?:galões?|gallons?).*?(?:em\s+)?(?:litros?|liters?)/i, function(v){ return { answer: fmtNum((v*3.78541).toFixed(4))+' L', steps: fmtNum(v)+' gal × 3.78541 = **'+fmtNum((v*3.78541).toFixed(4))+' L**' }; }],
      [/(\d+(?:[,\.]\d+)?)\s*(?:cm|centímetros?).*?(?:em\s+)?(?:in|polegadas?|inches?)/i, function(v){ return { answer: fmtNum((v/2.54).toFixed(4))+' in', steps: fmtNum(v)+' cm ÷ 2.54 = **'+fmtNum((v/2.54).toFixed(4))+' in**' }; }],
      [/(\d+(?:[,\.]\d+)?)\s*(?:in|polegadas?|inches?).*?(?:em\s+)?(?:cm|centímetros?)/i, function(v){ return { answer: fmtNum((v*2.54).toFixed(4))+' cm', steps: fmtNum(v)+' in × 2.54 = **'+fmtNum((v*2.54).toFixed(4))+' cm**' }; }]
    ];
    for(var i=0;i<pairs.length;i++){
      m=qn.match(pairs[i][0]);
      if(m){ var v=num(m[1]); var r=pairs[i][1](v); return r; }
    }
    return null;
  });

  /* ── §3.17  Vector operations ── NEW ── */
  SOLVERS.push(function vectorSolver(q, lang){
    var qn=norm(q); var m;
    m=qn.match(/(?:produto\s+escalar|dot\s+product|produto\s+interno).*?\((-?\d+(?:[,\.]\d+)?)\s*,\s*(-?\d+(?:[,\.]\d+)?)\).*?\((-?\d+(?:[,\.]\d+)?)\s*,\s*(-?\d+(?:[,\.]\d+)?)\)/i);
    if(m){ var ax=num(m[1]),ay=num(m[2]),bx=num(m[3]),by=num(m[4]),dot=ax*bx+ay*by; return { answer: 'A·B = '+fmtNum(dot), steps: '**Produto Escalar:** ('+ax+','+ay+')·('+bx+','+by+')\n= '+ax+'×'+bx+' + '+ay+'×'+by+' = '+fmtNum(ax*bx)+' + '+fmtNum(ay*by)+' = **'+fmtNum(dot)+'**' }; }
    m=qn.match(/(?:produto\s+vetorial|cross\s+product).*?\((-?\d+(?:[,\.]\d+)?)\s*,\s*(-?\d+(?:[,\.]\d+)?)\s*,\s*(-?\d+(?:[,\.]\d+)?)\).*?\((-?\d+(?:[,\.]\d+)?)\s*,\s*(-?\d+(?:[,\.]\d+)?)\s*,\s*(-?\d+(?:[,\.]\d+)?)\)/i);
    if(m){
      var ax3=num(m[1]),ay3=num(m[2]),az3=num(m[3]),bx3=num(m[4]),by3=num(m[5]),bz3=num(m[6]);
      var cx=ay3*bz3-az3*by3,cy=az3*bx3-ax3*bz3,cz=ax3*by3-ay3*bx3;
      return { answer: 'A×B = ('+fmtNum(cx)+', '+fmtNum(cy)+', '+fmtNum(cz)+')', steps: '**Produto Vetorial:**\ni: '+ay3+'×'+bz3+'−'+az3+'×'+by3+' = '+fmtNum(cx)+'\nj: '+az3+'×'+bx3+'−'+ax3+'×'+bz3+' = '+fmtNum(cy)+'\nk: '+ax3+'×'+by3+'−'+ay3+'×'+bx3+' = '+fmtNum(cz)+'\n= **('+fmtNum(cx)+', '+fmtNum(cy)+', '+fmtNum(cz)+')**' };
    }
    m=qn.match(/(?:ângulo\s+entre\s+vetores?|angle\s+between\s+vectors?).*?\((-?\d+(?:[,\.]\d+)?)\s*,\s*(-?\d+(?:[,\.]\d+)?)\).*?\((-?\d+(?:[,\.]\d+)?)\s*,\s*(-?\d+(?:[,\.]\d+)?)\)/i);
    if(m){
      var ax2=num(m[1]),ay2=num(m[2]),bx2=num(m[3]),by2=num(m[4]);
      var dotv=ax2*bx2+ay2*by2,magA=Math.sqrt(ax2*ax2+ay2*ay2),magB=Math.sqrt(bx2*bx2+by2*by2);
      var theta=Math.acos(dotv/(magA*magB))*180/Math.PI;
      return { answer: 'θ = '+fmtNum(theta.toFixed(4))+'°', steps: '**θ = arccos(A·B / (|A||B|))**\nA·B = '+fmtNum(dotv)+' | |A| = '+fmtNum(magA.toFixed(4))+' | |B| = '+fmtNum(magB.toFixed(4))+'\ncos θ = '+fmtNum((dotv/(magA*magB)).toFixed(6))+'\n**θ = '+fmtNum(theta.toFixed(4))+'°**' };
    }
    return null;
  });

  /* ── §3.18  Linear algebra 2×2 system ── NEW ── */
  SOLVERS.push(function linearAlgSolver(q, lang){
    var qn=norm(q); var m;
    /* Cramer 2×2 */
    m=qn.match(/(-?\d*(?:[,\.]\d+)?)\s*x\s*([+\-]\s*\d*(?:[,\.]\d+)?)\s*y\s*=\s*(-?\d+(?:[,\.]\d+)?)\s+(-?\d*(?:[,\.]\d+)?)\s*x\s*([+\-]\s*\d*(?:[,\.]\d+)?)\s*y\s*=\s*(-?\d+(?:[,\.]\d+)?)/i);
    if(m){
      var a1=num(m[1]||'1'),b1=num(m[2].replace(/\s/g,'')),c1=num(m[3]);
      var a2=num(m[4]||'1'),b2=num(m[5].replace(/\s/g,'')),c2=num(m[6]);
      var D=a1*b2-a2*b1;
      if(D===0) return { answer: 'Sistema sem solução única (D=0)', steps: '**Δ = '+fmtNum(a1)+'×'+fmtNum(b2)+' − '+fmtNum(a2)+'×'+fmtNum(b1)+' = 0**\n→ Sistema sem solução única (paralelas ou coincidentes).' };
      var xv=(c1*b2-c2*b1)/D,yv=(a1*c2-a2*c1)/D;
      return { answer: 'x = '+fmtNum(xv.toFixed(6))+' | y = '+fmtNum(yv.toFixed(6)),
               steps: '**Regra de Cramer:**\nΔ = '+fmtNum(a1)+'×'+fmtNum(b2)+'−'+fmtNum(a2)+'×'+fmtNum(b1)+' = **'+fmtNum(D)+'**\nΔx = '+fmtNum(c1)+'×'+fmtNum(b2)+'−'+fmtNum(c2)+'×'+fmtNum(b1)+' = **'+fmtNum(c1*b2-c2*b1)+'**\nΔy = '+fmtNum(a1)+'×'+fmtNum(c2)+'−'+fmtNum(a2)+'×'+fmtNum(c1)+' = **'+fmtNum(a1*c2-a2*c1)+'**\n**x = Δx/Δ = '+fmtNum(xv.toFixed(6))+'**\n**y = Δy/Δ = '+fmtNum(yv.toFixed(6))+'**' };
    }
    /* Determinant 2×2 */
    m=qn.match(/(?:determinante|determinant|det).*?\[\s*(-?\d+(?:[,\.]\d+)?)\s*,?\s*(-?\d+(?:[,\.]\d+)?)\s*;?\s*(-?\d+(?:[,\.]\d+)?)\s*,?\s*(-?\d+(?:[,\.]\d+)?)\s*\]/i);
    if(m){
      var a=num(m[1]),b=num(m[2]),c=num(m[3]),d=num(m[4]),det=a*d-b*c;
      return { answer: 'det = '+fmtNum(det), steps: '**det [['+a+','+b+'],['+c+','+d+']]**\n= '+a+'×'+d+' − '+b+'×'+c+'\n= '+fmtNum(a*d)+' − '+fmtNum(b*c)+'\n= **'+fmtNum(det)+'**' };
    }
    /* Eigenvalues 2×2 */
    m=qn.match(/(?:autovalor|eigenvalue).*?\[\s*(-?\d+(?:[,\.]\d+)?)\s*,?\s*(-?\d+(?:[,\.]\d+)?)\s*;?\s*(-?\d+(?:[,\.]\d+)?)\s*,?\s*(-?\d+(?:[,\.]\d+)?)\s*\]/i);
    if(m){
      var a=num(m[1]),b=num(m[2]),c=num(m[3]),d=num(m[4]);
      var tr=a+d,det=a*d-b*c,disc=tr*tr-4*det;
      var steps='**Equação característica:** λ² − tr(A)λ + det(A) = 0\ntr = '+fmtNum(tr)+' | det = '+fmtNum(det)+' | Δ = '+fmtNum(disc);
      if(disc>=0){ var l1=(tr+Math.sqrt(disc))/2,l2=(tr-Math.sqrt(disc))/2; return { answer: 'λ₁='+fmtNum(l1.toFixed(4))+', λ₂='+fmtNum(l2.toFixed(4)), steps: steps+'\nλ₁ = **'+fmtNum(l1.toFixed(4))+'** | λ₂ = **'+fmtNum(l2.toFixed(4))+'**' }; }
      else { return { answer: 'Autovalores complexos', steps: steps+'\nΔ < 0 → autovalores complexos conjugados' }; }
    }
    return null;
  });

  /* ── §3.19  Direct expression evaluator (fallback) ── */
  SOLVERS.push(function exprSolver(q, lang){
    var qn=norm(q);
    var clean=qn.replace(/^(?:calcul[ae]|resolv[ae]|quanto\s+[eé]|what\s+is|compute|evaluate|simplif[iy](?:que)?|encontre|find|calcula)\s+/i,'').replace(/[=?]\s*$/,'').trim();
    if(!EXPR_RE.test(clean)) return null;
    var r=safeEval(clean);
    if(r===null) return null;
    return { answer: r, steps: '**Expressão:** '+clean.replace(/\*\*/g,'^')+'\n**Resultado:** **'+r+'**' };
  });

  /* ════════════════════════════════════════════════════════════
     §4  MAIN PUBLIC INTERFACE
  ════════════════════════════════════════════════════════════ */
  function detectLang(q){
    var qn=q.toLowerCase();
    if(/\b(?:how|what|when|where|which|find|calculate|solve|the|is|are|if|there|interest|loan|payment|probability)\b/.test(qn)) return 'en';
    if(/\b(?:cuánto|cuántos|cuántas|qué|cómo|cuál|calcula|resuelve|hay|interés)\b/.test(qn)) return 'es';
    return 'pt';
  }

  function buildAnswer(query, solver_result, lang){
    var L = lang==='en'
      ? {prefix:'📐 **Result:**', solving:'**Step-by-step:**', warn:'_Educational only. Verify critical calculations._'}
      : lang==='es'
      ? {prefix:'📐 **Resultado:**', solving:'**Resolución:**', warn:'_Solo educativo. Verifique cálculos importantes._'}
      : {prefix:'📐 **Resultado:**', solving:'**Resolução passo a passo:**', warn:'_Apenas educacional. Sempre verifique cálculos importantes._'};
    var out=L.prefix+' '+solver_result.answer;
    if(solver_result.steps) out+='\n\n'+L.solving+'\n'+solver_result.steps;
    out+='\n\n'+L.warn;
    return out;
  }

  W.tryMathEval = function(query, lang){
    if(!lang) lang=detectLang(query);
    var q=(query||'').trim();
    if(!q) return null;
    for(var i=0;i<SOLVERS.length;i++){
      try { var r=SOLVERS[i](q,lang); if(r) return buildAnswer(q,r,lang); } catch(e){}
    }
    return null;
  };

  /* ════════════════════════════════════════════════════════════
     §5  KNOWLEDGE BASE TOPICS
  ════════════════════════════════════════════════════════════ */
  if(!W.EduardoKB) W.EduardoKB=[];
  W.EduardoKB.push({
    id: 'math',
    priority: 10,
    lang: {

      /* ══════════════════ PORTUGUESE ══════════════════════ */
      pt: {
        'como_calcular': '**Eduardo.AI resolve problemas matemáticos e financeiros em linguagem natural!**\n\n**Aritmética / Álgebra:**\n• "Quanto é 15% de 200?" → **30**\n• "Resolva 2x² − 5x + 3 = 0" → **x₁=1,5; x₂=1**\n• "MDC de 48 e 18" → **6**\n\n**Geometria:**\n• "Área do círculo de raio 5" → **78,5398 u²**\n• "Volume da esfera raio 3" → **113,0973 u³**\n• "Triângulo lados 3, 4, 5 (Herão)" → **6 u²**\n\n**Financeiro:**\n• "R$1.000 a 2% ao mês por 12 meses (juros compostos)" → **R$1.268,24**\n• "Financiamento R$50.000 a 1% am em 60 parcelas" → **Parcela: R$1.112,22**\n• "CAGR de R$10.000 para R$20.000 em 5 anos" → **14,87%**\n• "ROI: investimento R$5.000 retorno R$7.000" → **40%**\n• "Break-even: fixo R$10.000, preço R$50, variável R$20" → **334 unidades**\n\n**Probabilidade:**\n• "Binomial n=10, p=0.3, k=3" → **P=0,266828**\n• "Poisson λ=4, k=2" → **P=0,146525**\n\n**Vetores / Álgebra Linear:**\n• "Produto escalar (1,2) e (3,4)" → **11**\n• "Sistema: 2x+3y=8; x−y=1" → **x=2,2; y=1,2**\n\n**Conversão de unidades:**\n• "100 km em milhas" → **62,1371 mi**\n• "37°C em Fahrenheit" → **98,6°F**\n\n**Expressões diretas:** sqrt(144), 2^10, sind(30), log10(1000), fact(7), comb(10,3), fv(1000,0.02,12), normcdf(1.96), bscall(100,100,0.05,1,0.2)',

        'enem': '**ENEM — Principais temas:**\n\n**Álgebra:** equações 1º/2º grau, sistemas, inequações, funções (afim, quadrática, exponencial, logarítmica, trigonométrica), PA/PG.\n\n**Geometria:** plana (área, perímetro), sólidos (volume, área), semelhança, Pitágoras, trigonometria, noções de geometria analítica.\n\n**Estatística:** tabelas, gráficos, média, mediana, moda, probabilidade clássica.\n\n**Matemática financeira:** %, juros simples/compostos, descontos, financiamentos.\n\n**Combinatória:** princípio multiplicativo, fatorial, arranjo, combinação, permutação.\n\n_Pergunte qualquer questão específica para solução passo a passo!_',

        'fuvest': '**FUVEST — Matemática:**\n\n• **Álgebra avançada:** polinômios, módulo, inequações, sistemas 3×3\n• **Geometria analítica:** cônicas (parábola, elipse, hipérbole, circunferência), distância ponto-reta\n• **Trigonometria completa:** identidades, equações, fórmulas de adição e multiplicação\n• **Combinatória e Probabilidade:** condicional, Bayes, Binomial\n• **PA / PG / séries:** somas infinitas (PG convergente)\n• **Matrizes e Determinantes:** Cramer 3×3, escalonamento\n• **Noções de cálculo:** taxas de variação, máximos/mínimos\n\n_Pergunte qualquer tópico ou questão!_',

        'vestibular': '**Vestibulares — Fórmulas Essenciais:**\n\n**Álgebra:**\nx = (−b ± √Δ) / 2a | Δ = b²−4ac\n\n**Financeira:**\nJuros compostos: M = P(1+i)^n\nJuros simples: M = P(1+in)\nPMT = PV·i / (1−(1+i)^−n)\n\n**Sequências:**\nPA: aₙ = a₁+(n−1)r; Sₙ = n(a₁+aₙ)/2\nPG: aₙ = a₁·qⁿ⁻¹; S∞ = a₁/(1−q)\n\n**Geometria:**\nCírculo: A=πr², C=2πr\nPitágoras: c²=a²+b²\nHerão: A=√(s(s−a)(s−b)(s−c))\nEsfera: V=4πr³/3\nCilindro: V=πr²h\n\n**Combinatória:**\nC(n,r) = n!/(r!(n−r)!)\nA(n,r) = n!/(n−r)!\n\n**Probabilidade:**\nP(A∪B) = P(A)+P(B)−P(A∩B)\nP(A|B) = P(A∩B)/P(B)\n\nDigite qualquer questão para solução passo a passo!',

        'aritmetica': 'Operações: + − × ÷. Ordem: Parênteses → Expoentes → ×÷ → +−. Ex: 2+3×4=14. Divisibilidade: ÷2 (par), ÷3 (soma dígitos÷3), ÷5 (0/5), ÷9 (soma÷9). MDC via Euclides: gcd(a,b)=gcd(b,a mod b). MMC = |a×b|/MDC. **Calcule:** "gcd(48,18)", "lcm(12,18)", "mdc(36,60)"',

        'porcentagem': 'x% de N = (x/100)×N. Aumento: N×(1+x/100). Desconto: N×(1−x/100). Variação%: (final−inicial)/inicial×100. Margem: lucro/custo×100. Markup: preço venda/custo×100. **Exemplos:** "15% de 200", "desconto 30% em 500", "qual % é 40 de 250", "aumento de 12% em 850"',

        'equacoes': '1º grau: ax+b=0 → x=−b/a. 2º grau (Bhaskara): x=(−b±√Δ)/2a, Δ=b²−4ac. Δ>0: 2 reais distintas. Δ=0: raiz dupla. Δ<0: complexas. Vieta: x₁+x₂=−b/a; x₁x₂=c/a. Sistema 2×2: substituição, adição ou Cramer. **Exemplos:** "2x²−5x+3=0", "sistema: 2x+3y=8; x−y=1"',

        'funcoes': 'Afim f(x)=ax+b (reta, raiz x=−b/a). Quadrática f(x)=ax²+bx+c, vértice V=(−b/2a, −Δ/4a). Exponencial aˣ. Log: log_a(b)=c↔aᶜ=b. Composta (f∘g)(x)=f(g(x)). Inversa f⁻¹. Par: f(−x)=f(x). Ímpar: f(−x)=−f(x). Bijeção: injetora+sobrejetora. TVI (Bolzano). Derivada=taxa de variação.',

        'progressoes': 'PA: r=aₙ₊₁−aₙ. Termo: aₙ=a₁+(n−1)r. Soma: Sₙ=n(a₁+aₙ)/2=n(2a₁+(n−1)r)/2. Média aritmética: a_m=(a₁+aₙ)/2. PG: q=aₙ₊₁/aₙ. Termo: aₙ=a₁qⁿ⁻¹. Soma finita: a₁(qⁿ−1)/(q−1). Soma infinita (|q|<1): S∞=a₁/(1−q). Média geométrica: a_m=√(a₁×aₙ). **Exemplos:** "PA a₁=2, r=3, 10º termo", "PG a₁=1, q=2, soma dos 8 primeiros"',

        'geometria_plana': 'Quadrado: A=l², P=4l, d=l√2. Retângulo: A=bh, P=2(b+h), d=√(b²+h²). Triângulo: A=bh/2, Herão=√(s(s−a)(s−b)(s−c)). Círculo: A=πr², C=2πr. Setor circular: A=r²θ/2 (θ rad). Segmento: A=r²(θ−sinθ)/2. Trapézio: A=(b₁+b₂)h/2. Losango: A=d₁d₂/2. Polígono regular n lados lado s: A=ns²/(4tan(π/n)). **Exemplos:** "área círculo raio 5", "retângulo 4×7", "triângulo lados 3,4,5"',

        'geometria_solidos': 'Cubo: V=a³, Stotal=6a². Paralelepípedo: V=abc, S=2(ab+bc+ca). Cilindro: V=πr²h, S=2πr(r+h). Cone: V=πr²h/3, l=√(r²+h²). Esfera: V=4πr³/3, S=4πr². Pirâmide: V=Ab×h/3. Tronco de cone: V=πh(R²+Rr+r²)/3. Toro: V=2π²Rr². Elipsoide: V=4πabc/3. **Exemplos:** "esfera raio 3", "cilindro r=2, h=5", "cone r=3, h=4"',

        'trigonometria': 'Razões: sin=op/hip, cos=adj/hip, tan=op/adj. Identidades: sin²+cos²=1, 1+tan²=sec², 1+cot²=csc². Valores notáveis: sin30=½, cos30=√3/2, sin45=cos45=√2/2, sin60=√3/2. Lei dos Senos: a/sinA=b/sinB=c/sinC=2R. Lei dos Cossenos: c²=a²+b²−2ab·cosC. Adição: sin(a+b)=sin·a·cos·b+cos·a·sin·b. Duplicação: sin2a=2sin·a·cos·a. **Calcule:** "sind(45)", "cosd(60)", "atand(1)"',

        'logaritmos': 'log_a(b)=c ↔ aᶜ=b. ln=base e. log=base 10. Propriedades: log(ab)=loga+logb; log(a/b)=loga−logb; log(aⁿ)=n·loga; log_a(a)=1; log_a(1)=0. Mudança de base: log_a(b)=ln(b)/ln(a). log_a(b)=1/log_b(a). **Calcule:** "log10(1000)"=3, "log2(32)"=5, "log(e)"=1',

        'combinatoria': 'Princípio multiplicativo: n₁×n₂×...×nₖ. Fatorial n!=n×(n−1)×...×1, 0!=1. Arranjo A(n,r)=n!/(n−r)!. Combinação C(n,r)=n!/(r!(n−r)!). Permutação com repetição: n!/(n₁!...nₖ!). Número de subconjuntos: 2ⁿ. Princípio da Inclusão-Exclusão. Número de Catalan. Estrelas e barras. **Calcule:** "comb(10,3)"=120, "perm(6,2)"=30, "fact(7)"=5040, "catalan(5)"=42',

        'probabilidade': 'P(A)∈[0,1]. Complementar: P(Aᶜ)=1−P(A). Adição: P(A∪B)=P(A)+P(B)−P(A∩B). Condicional: P(A|B)=P(A∩B)/P(B). Independentes: P(A∩B)=P(A)×P(B). Bayes: P(A|B)=P(B|A)×P(A)/P(B). Binomial B(n,p): P(X=k)=C(n,k)pᵏ(1−p)ⁿ⁻ᵏ. Poisson(λ): P(X=k)=λᵏe^−λ/k!. Normal: Z=(X−μ)/σ. **Calcule:** "binomP(10,3,0.3)", "poissonP(4,2)", "normcdf(1.96)"',

        'estatistica': 'Média: x̄=Σxᵢ/n. Mediana: valor central (dados ordenados). Moda: mais frequente. Variância: s²=Σ(xᵢ−x̄)²/(n−1). Desvio padrão: s=√s². CV = s/x̄ × 100%. Assimetria. Normal: 68-95-99,7% em 1σ, 2σ, 3σ. Z-score: z=(x−μ)/σ. Regressão linear: y=a+bx, b=Cov(X,Y)/Var(X). Correlação Pearson ρ∈[−1,1]. **Calcule:** "mean(10,20,30,40,50)", "stdev(2,4,6,8)", "median(3,1,4,1,5)"',

        'matematica_financeira': '**Juros simples:** J=Pit, M=P(1+it)\n**Juros compostos:** M=P(1+i)^n\n**Regra dos 72:** anos para dobrar ≈ 72/taxa%\n**PMT (Price/Tabela Price):** PMT = PV×i/(1−(1+i)^−n)\n**FVA (Poupança):** FVA = PMT×((1+i)^n−1)/i\n**CAGR:** (FV/PV)^(1/n)−1\n**ROI:** (Retorno−Custo)/Custo × 100\n**Break-even:** CF/(P−CV)\n**VPL:** Σ FCt/(1+i)^t\n**TIR:** taxa que zera o VPL\n**EAR (Taxa Efetiva Anual):** (1+i_nom/n)^n−1\n**Fisher (Retorno Real):** (1+nom)/(1+infl)−1\n**DY:** Dividendo/Preço × 100\n**P/L:** Preço/LPA\n**WACC:** Ke×E/(D+E) + Kd(1−T)×D/(D+E)\n\n_Pergunte qualquer cálculo financeiro passo a passo!_',

        'calculos_financeiros': '**Exemplos de cálculos financeiros:**\n\n"R$5.000 a 1,5% ao mês por 24 meses — juros compostos" → M e Juros\n"Financiamento R$200.000 a 0,8% am em 360 parcelas" → PMT\n"CAGR de R$50.000 para R$90.000 em 7 anos" → CAGR%\n"ROI: custo R$20.000, retorno R$28.000" → 40%\n"Break-even: fixo R$15.000, preço R$80, variável R$35" → unidades\n"VPL taxa 12%: FC1=5000, FC2=6000, FC3=7000" → VPL\n"Retorno real: nominal 12%, inflação 6,5%" → Fisher\n"DY: dividendo R$4, preço R$50" → 8%\n"P/L: preço R$30, LPA R$2,5" → 12x\n"EAR: nominal 12% ao ano capitalizado mensalmente" → 12,68%\n"Poupança R$500/mês a 0,5% por 36 meses" → acumulado\n"Black-Scholes call: S=100, K=105, r=5%, T=1, σ=20%" → prêmio',

        'matrizes': 'Operações: soma, produto escalar, produto A×B. det 2×2: ad−bc. det 3×3: Sarrus ou cofatores. Inversa: A⁻¹=adj(A)/det(A). Cramer: resolve sistemas. Autovalores: det(A−λI)=0. Traço: soma da diagonal. **Calcule:** "det2(3,2,1,4)"=10, "cramer2(2,3,8,1,-1,1)"→x,y, "eig2(4,1,2,3)"→λ',

        'numeros_complexos': 'z=a+bi, |z|=√(a²+b²), arg=atan(b/a). Conjugado: z̄=a−bi. Soma: (a+bi)+(c+di)=(a+c)+(b+d)i. Produto: (ac−bd)+(ad+bc)i. Forma polar: z=r·e^(iθ)=r(cosθ+i·sinθ). Euler: e^(iπ)+1=0. Fórmula de De Moivre: zⁿ=rⁿ(cos·nθ+i·sin·nθ). Raízes n-ésimas: n raízes igualmente espaçadas.',

        'calculo': 'Limite: lim f(x) conforme x→a. L\'Hôpital (0/0 ou ∞/∞). Derivada f\'(x)=lim[f(x+h)−f(x)]/h. Regras: (xⁿ)\'=nxⁿ⁻¹, (eˣ)\'=eˣ, (ln x)\'=1/x, (sin x)\'=cos x, (cos x)\'=−sin x. Produto (fg)\'=f\'g+fg\'. Cadeia (f∘g)\'=f\'(g)·g\'. Integral: ∫xⁿdx=xⁿ⁺¹/(n+1)+C. TFC: ∫ₐᵇf=F(b)−F(a). Integral por partes: ∫u·dv=uv−∫v·du. Substituição. Aplicações: máximos, área, volume, arco. **Numérico:** "deriv(x=>x*x,3)"≈6, "integrate(x=>x*x,0,1,100)"≈0,333',

        'vetores': 'Vetor v=(x,y) ou (x,y,z). |v|=√(x²+y²). Soma (a,b)+(c,d)=(a+c,b+d). Escalar k·(a,b)=(ka,kb). Produto escalar A·B=ax·bx+ay·by. A·B=|A||B|cosθ. Produto vetorial A×B=(aybz−azby, azbx−axbz, axby−aybx). |A×B|=|A||B|sinθ (área do paralelogramo). **Calcule:** "dot2(1,2,3,4)"=11, "mag2(3,4)"=5, "cross3(1,0,0,0,1,0)"=(0,0,1)',

        'teoria_numeros': 'Números primos: sem divisores além de 1 e si mesmo. Crivo de Eratóstenes. Fatoração única (TFA). Pequeno Teorema de Fermat: aᵖ⁻¹≡1 (mod p). Totiente de Euler φ(n). Congruências. CRT (Teorema Chinês do Resto). Sequência de Fibonacci: F(n)=F(n−1)+F(n−2). Número de ouro φ=(1+√5)/2. **Calcule:** "isPrime(97)"=true, "totient(12)"=4, "fib(20)"=6765',

        'constantes': 'π=3,14159265358979… e=2,71828182845904… φ=(1+√5)/2=1,61803398… √2=1,41421356… √3=1,73205080… √5=2,23606797… ln2=0,69314718… τ=2π=6,28318530… **Calcule:** "pi", "e", "phi", "sqrt2", "tau"',

        'fisica_aplicada': '**Cinemática:** v=u+at | s=ut+½at² | v²=u²+2as\n**Energia:** EC=½mv² | EP=mgh | W=F·d·cosθ\n**Ohm:** V=IR | P=VI | P=V²/R\n**Gravitação:** F=Gm₁m₂/r²\n**Gás ideal:** PV=nRT\n\n_Exemplos:_\n"EC de massa 2kg a 10m/s" → 100J\n"Deslocamento u=5, a=2, t=3" → 24m\n"Tensão corrente=3A, resistência=8Ω" → 24V',

        'conversao_unidades': '**Comprimento:** 1 km=0,621371 mi | 1 m=3,28084 ft | 1 cm=0,393701 in\n**Massa:** 1 kg=2,20462 lb | 1 lb=453,592 g\n**Temperatura:** °F=°C×9/5+32 | K=°C+273,15\n**Volume:** 1 L=0,264172 gal | 1 gal=3,78541 L\n**Velocidade:** 1 km/h=0,621371 mph | 1 m/s=3,6 km/h\n\n_Exemplos:_ "100 km em milhas", "37°C em Fahrenheit", "80 kg em libras", "5 galões em litros"'
      },

      /* ══════════════════ ENGLISH ══════════════════════════ */
      en: {
        'how_to_calculate': '**Eduardo.AI solves math and finance problems in natural language!**\n\n**Arithmetic / Algebra:**\n• "What is 15% of 200?" → **30**\n• "Solve 2x² − 5x + 3 = 0" → **x₁=1.5; x₂=1**\n• "GCD of 48 and 18" → **6**\n\n**Geometry:**\n• "Area of circle radius 5" → **78.5398 u²**\n• "Volume of sphere radius 3" → **113.0973 u³**\n• "Triangle sides 3, 4, 5 (Heron)" → **6 u²**\n\n**Finance (NEW):**\n• "$1,000 at 2% per month for 12 months (compound)" → **$1,268.24**\n• "Loan $50,000 at 1% pm in 60 installments" → **PMT**\n• "CAGR from $10,000 to $20,000 in 5 years" → **14.87%**\n• "ROI: invest $5,000 return $7,000" → **40%**\n• "Break-even: fixed $10,000, price $50, variable $20" → **334 units**\n• "NPV 12%: CF1=5000 CF2=6000 CF3=7000" → **NPV**\n\n**Probability / Stats:**\n• "Binomial n=10, p=0.3, k=3" → **0.266828**\n• "Normal μ=100 σ=15, P(X<110)" → **Φ value**\n\n**Direct expressions:**\nsqrt(144), 2^10, sind(30), fact(7), comb(10,3), fv(1000,0.05,10), bscall(100,100,0.05,1,0.2)',

        'sat_act': '**SAT/ACT Math Topics:**\n\n**Algebra:** linear/quadratic equations, inequalities, systems, functions\n**Problem Solving:** ratios, proportions, percentages, rates, unit conversions\n**Geometry:** area, volume, Pythagorean theorem, similar triangles, coordinate geometry\n**Statistics:** mean, median, mode, standard deviation, data interpretation\n**Trigonometry (SAT):** SOHCAHTOA, unit circle, basic identities\n\n_Ask any question for step-by-step solution!_',

        'arithmetic': 'PEMDAS: Parentheses, Exponents, ×÷, +−. Divisibility rules: ÷2 (even), ÷3 (digit sum), ÷5 (ends 0/5). GCD via Euclidean algorithm, LCM=|a×b|/GCD. **Calculate:** "gcd(48,18)", "lcm(12,18)", "2^10", "sqrt(144)"',

        'percentages': 'x% of N=(x/100)×N. Increase by x%: N×(1+x/100). Decrease: N×(1−x/100). Percent change: (final−initial)/initial×100. **Examples:** "15% of 200", "30% discount on 500", "what % is 40 of 250"',

        'algebra': 'Linear: ax+b=0 → x=−b/a. Quadratic: x=(−b±√Δ)/2a, Δ=b²−4ac. Vieta: x₁+x₂=−b/a; x₁x₂=c/a. Systems: substitution, elimination, Cramer\'s rule. **Example:** "solve 2x² − 5x + 3 = 0"',

        'geometry': 'Square A=l². Rectangle A=bh, diag=√(b²+h²). Triangle A=bh/2; Heron A=√(s(s-a)(s-b)(s-c)). Circle A=πr², C=2πr. Sphere V=4πr³/3. Cylinder V=πr²h. Cone V=πr²h/3, slant l=√(r²+h²). **Examples:** "area circle radius 5", "volume sphere radius 3"',

        'trigonometry': 'sin=opp/hyp, cos=adj/hyp, tan=opp/adj. Identity: sin²+cos²=1. Notable angles: sin30°=½, cos45°=√2/2, sin60°=√3/2. Law of sines: a/sinA=b/sinB. Law of cosines: c²=a²+b²−2ab·cosC. Addition: sin(a+b)=sina·cosb+cosa·sinb. **Calculate:** "sind(45)", "cosd(60)"',

        'statistics': 'Mean x̄=Σxᵢ/n. Median: middle value. Mode: most frequent. Variance s²=Σ(xᵢ−x̄)²/(n−1). Std dev s=√s². CV=s/x̄×100%. Normal rule: 68-95-99.7% within 1σ,2σ,3σ. Z-score z=(x−μ)/σ. Pearson correlation ρ=Cov(X,Y)/(σₓσᵧ). **Calculate:** "mean(10,20,30,40,50)", "stdev(2,4,6,8)"',

        'financial_math': '**Compound interest:** A=P(1+r)^t\n**Simple interest:** A=P(1+rt)\n**Rule of 72:** years to double ≈ 72/rate%\n**Annuity payment (PMT):** PMT=PV·r/(1−(1+r)^−n)\n**Future value annuity:** FVA=PMT·((1+r)^n−1)/r\n**CAGR:** (FV/PV)^(1/n)−1\n**ROI:** (Return−Cost)/Cost×100\n**Break-even:** Fixed/(Price−VarCost)\n**NPV:** Σ CF_t/(1+r)^t\n**EAR:** (1+r_nom/n)^n−1\n**Real return (Fisher):** (1+nom)/(1+infl)−1\n**DY:** Dividend/Price×100\n**P/E:** Price/EPS\n**Black-Scholes call:** bscall(S,K,r,T,σ)\n\n_Ask any financial calc for step-by-step solution!_',

        'combinatorics': 'Factorial n!. Permutation P(n,r)=n!/(n−r)! (order matters). Combination C(n,r)=n!/(r!(n−r)!) (order doesn\'t). Multinomial n!/(n₁!·n₂!·...). Stars & bars. Inclusion-exclusion. **Calculate:** "comb(10,3)"=120, "perm(6,2)"=30, "derange(5)", "catalan(5)"',

        'probability': 'P(A)∈[0,1]. Complement P(Aᶜ)=1−P(A). Addition P(A∪B)=P(A)+P(B)−P(A∩B). Conditional P(A|B)=P(A∩B)/P(B). Bayes P(A|B)=P(B|A)P(A)/P(B). Binomial B(n,p): P(X=k)=C(n,k)pᵏ(1−p)ⁿ⁻ᵏ. Poisson(λ): P(X=k)=λᵏe^−λ/k!. Normal: Z=(X−μ)/σ. **Calculate:** "binomP(10,3,0.3)", "poissonP(4,2)", "normcdf(1.96)"≈0.975',

        'calculus': 'Derivative rules: (xⁿ)\'=nxⁿ⁻¹, (eˣ)\'=eˣ, (ln x)\'=1/x, (sin)\'=cos, (cos)\'=−sin. Product (fg)\'=f\'g+fg\'. Quotient: (f/g)\'=(f\'g−fg\')/g². Chain (f∘g)\'=f\'(g)·g\'. Integral ∫xⁿdx=xⁿ⁺¹/(n+1)+C. FTC: ∫ₐᵇf=F(b)−F(a). Integration by parts: ∫u·dv=uv−∫v·du. L\'Hôpital for 0/0, ∞/∞. **Numerical:** "deriv(x=>x*x*x,2)"≈12, "integrate(x=>x*x,0,1)"≈0.333',

        'vectors_linear_algebra': 'Dot product A·B=Σaᵢbᵢ=|A||B|cosθ. Cross product A×B⊥A,B; |A×B|=|A||B|sinθ (parallelogram area). Projection: proj_B(A)=(A·B/|B|²)B. det [[a,b],[c,d]]=ad−bc. Cramer\'s rule 2×2. Eigenvalues: det(A−λI)=0. **Calculate:** "dot2(1,2,3,4)", "cross3(1,0,0,0,1,0)", "det2(3,2,1,4)", "cramer2(2,3,8,1,-1,1)", "eig2(4,1,2,3)"',

        'unit_conversion': '**Length:** 1 km=0.621 mi | 1 m=3.281 ft | 1 cm=0.394 in\n**Mass:** 1 kg=2.205 lb\n**Temperature:** °F=°C×9/5+32 | K=°C+273.15\n**Volume:** 1 L=0.264 gal\n**Speed:** 1 km/h=0.621 mph | 1 m/s=3.6 km/h\n\n_Examples:_ "100 km in miles", "98.6°F in Celsius", "80 kg in pounds"',

        'math_constants': 'π=3.14159265… e=2.71828182… φ=(1+√5)/2=1.61803398… √2=1.41421356… √3=1.73205080… τ=2π=6.28318530… Euler: e^(iπ)+1=0. **Calculate:** "pi", "e", "phi", "tau", "sqrt2"'
      },

      /* ══════════════════ ESPAÑOL ══════════════════════════ */
      es: {
        'como_calcular': '**Eduardo.AI resuelve problemas matemáticos y financieros en lenguaje natural!**\n\n• "¿Cuánto es el 15% de 200?" → **30**\n• "Resuelve 2x²−5x+3=0" → **x₁=1,5; x₂=1**\n• "Área de círculo radio 5" → **78,5398 u²**\n• "Combinación de 3 de 10" → **C(10,3)=120**\n• "$1.000 al 2% mensual por 12 meses (compuesto)" → montante\n• "CAGR de $10.000 a $20.000 en 5 años" → **14,87%**\n\n_Expresiones directas:_ sqrt(144), 2^10, sind(30), log10(1000), fact(7), comb(10,3)',

        'algebra': '1er grado: ax+b=0 → x=−b/a. 2do grado: x=(−b±√Δ)/2a, Δ=b²−4ac. Vieta: x₁+x₂=−b/a; x₁x₂=c/a. Sistemas 2×2: Cramer Δ=a₁b₂−a₂b₁. **Ejemplo:** "resuelve 2x²−5x+3=0"',

        'geometria': 'Área: Cuadrado l². Rectángulo bh, diag=√(b²+h²). Triángulo bh/2, Herón √(s(s−a)(s−b)(s−c)). Círculo πr², C=2πr. Esfera V=4πr³/3. Cilindro V=πr²h. Cono V=πr²h/3. **Ejemplos:** "área círculo radio 5", "volumen esfera radio 3", "triángulo lados 3,4,5"',

        'estadistica': 'Media x̄=Σxᵢ/n. Mediana: valor central. Moda: más frecuente. Varianza s²=Σ(xᵢ−x̄)²/(n−1). Desviación s=√s². Z-score=(x−μ)/σ. Normal: 68-95-99,7% en 1σ, 2σ, 3σ. **Calcule:** "mean(10,20,30,40,50)", "stdev(2,4,6,8)"',

        'combinatoria': 'Factorial n!. Arreglo A(n,r)=n!/(n−r)!. Combinación C(n,r)=n!/(r!(n−r)!). Permutación con repetición n!/(n₁!...). Principio multiplicativo. **Calcule:** "comb(10,3)"=120, "perm(6,2)"=30, "fact(7)"=5040',

        'probabilidad': 'P(A)∈[0,1]. Complemento P(Aᶜ)=1−P(A). Adición P(A∪B)=P(A)+P(B)−P(A∩B). Condicional P(A|B)=P(A∩B)/P(B). Bayes. Binomial B(n,p). Poisson(λ). Normal Z=(X−μ)/σ. **Calcule:** "binomP(10,3,0.3)", "normcdf(1.96)"',

        'matematica_financiera': '**Interés compuesto:** M=P(1+i)^n\n**Interés simple:** M=P(1+in)\n**Regla del 72:** ≈72/tasa%\n**Cuota:** PMT=PV·i/(1−(1+i)^−n)\n**CAGR:** (FV/PV)^(1/n)−1\n**ROI:** (Retorno−Costo)/Costo×100\n**Break-even:** CF/(P−CV)\n**VPN:** Σ FCt/(1+i)^t\n**Fisher:** (1+r_nom)/(1+infl)−1\n\n_¡Pregunta cualquier cálculo!_',

        'porcentajes': 'x% de N=(x/100)×N. Aumento: N×(1+x/100). Descuento: N×(1−x/100). Variación%: (final−inicial)/inicial×100. **Ejemplos:** "15% de 200", "descuento 30% en 500"',

        'trigonometria': 'sin=op/hip, cos=adj/hip, tan=op/adj. sin²+cos²=1. sin30°=½, cos60°=½, sin45°=√2/2. Ley senos: a/sinA=b/sinB. Ley cosenos: c²=a²+b²−2ab·cosC. **Calcule:** "sind(45)", "cosd(60)", "atand(1)"',

        'calculo': 'Derivada: (xⁿ)\'=nxⁿ⁻¹, (eˣ)\'=eˣ, (sin)\'=cos. Regla del producto, cociente y cadena. Integral: ∫xⁿdx=xⁿ⁺¹/(n+1). TFC. Máximos/mínimos: f\'(x)=0. **Numérico:** "deriv(x=>x*x*x,2)"≈12',

        'constantes': 'π=3,14159265… e=2,71828182… φ=1,61803398… √2=1,41421356… τ=2π=6,28318530… **Calcule:** "pi", "e", "phi", "sqrt2"'
      }
    }
  });

}(window));
