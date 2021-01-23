//array, object


//var i=if(true) console.log(1);

//var i=while(true){console.log(1);}


var i=function(){
    console.log(1+1);
    console.log(1+2);
}

console.log(i);
i();

var a=[i];
a[0]();

var o={
    func:i
}

o.func();