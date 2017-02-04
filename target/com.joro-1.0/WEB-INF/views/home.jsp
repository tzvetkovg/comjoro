<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
         pageEncoding="ISO-8859-1" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<body>
<div id="one">
    fsfsdfsdfsdfffsdsfdfdsffsd
    ffsdfsdfsdfssddsddfsdfsdfsf

    fsfsddfdsfsfsddssdsdfsdsdf
    fdfsdfsdfffffffffffffffff
</div>

Greeting :
</body>

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
    <title>HelloWorld page</title>
    <script type="text/javascript" src="resources/js_files/jquery-3.1.1.min.js"></script>
    <script type="text/javascript" src="resources/js_files/test.js"></script>
    <script type="text/javascript" src="resources/js_files/filterableTable.js"></script>
    <script type="text/javascript" src="resources/js_files/UniqueElement.js"></script>
</head>

<script>


  /**
   * implicit binding lost
   */
  function implicitLost(arr)
  {
    //console.log(this.var_name);
    //console.log(arr);
  }

  var obj = {
    var_name: "obj_name",
    implicitLost: implicitLost,
    id: 2
  };

  /*  function callImplicitLost(implicitLost,obj){
   if(typeof implicitLost === 'function'){
   obj.implicitLost();
   implicitLost();
   }
   }

   callImplicitLost(obj.implicitLost,obj)*/


  /**
   * Explicit binding
   */
  /*  var b = implicitLost.bind(obj);
   //b();

   var arr = [1,2,3];

   function processArray(el,index){
   if(el === this.id){
   console.log("equal");
   console.log(this);
   }
   }

   arr.forEach(processArray,obj);*/

  /*  function Counter ()
   {
   this.sum = 0;
   this.count = 0;
   }

   Counter.prototype.add = function (array)
   {
   array.forEach(function(entry){
   this.sum += entry;
   this.count +=1;
   },this)
   };

   Counter.prototype.getSum = function ()
   {
   return this.sum;
   };

   Counter.prototype.getCount = function ()
   {
   return this.count;
   };

   var arr = [1,2,3];

   var newObj = new Counter();

   newObj.add(arr);

   console.log(newObj.getSum());*/

  /*  function tetFunc(){
   console.log(this.id);
   }

   var obj1 = {
   id: 1,
   testFunc: tetFunc
   };

   var obj2 = {
   id: 2,
   testFunc: tetFunc
   };

   obj1.testFunc.call(obj2);*/

  /*  function Employee(id)
   {
   this.id = id;
   }

   var obj = {};

   var b = Employee.bind(obj,"obj_name");
   b();

   console.log(obj);
   //new object
   var c = new b("new_object_name");

   console.log(obj);
   console.log(c);*/

  /* function func(a,b){
   console.log(this);
   console.log("a:" + a + " b:" + b);
   }

   func.apply(null,[1,2]);

   var b = func.bind(Object.create(null),2);*/
  /*
   function func()
   {
   }

   func.prototype.constructor = function ab (){

   }

   var b= new func();

   console.log(b instanceof func);
   console.log(b.constructor);*/

  /*  var str = "I am a string";
   var strObj = new String("I am a string object");

   console.log(typeof str);
   console.log(typeof strObj);

   console.log("---------");

   console.log(str instanceof String);
   console.log(strObj instanceof String);

   console.log(str.length);*/

  /*  function ab(){}

   var arr = [];

   arr[0] = "fssf";
   arr[1] = {};
   arr[2] = ab;

   arr["obj"] = "obj";

   console.log(arr);

   arr.forEach(function (item)
   {
   //console.log(item);
   });*/

  /**
   * Iterate object
   * @type {{id: string, id2: string}}
   */



  /**
   * iterate array
   */
  /*
   var arr = [1,55,3,5];
   arr["ss"] = "ss";

   for(var k =0; k < arr.length; ++k) {
   console.log(arr[k]);
   }


   arr.forEach(function (item)
   {
   console.log(item);
   });

   for (var b in arr){
   console.log(arr[b]);
   }
   */

  /* var obj = {
   id : 1
   };

   var main = {
   id: "id",
   func: function ()
   {

   }
   };

   var sub = {
   sub: "sub",
   func : main.func
   };

   function mixin(sourceObj,targetObj){
   for (var i in sourceObj){
   if( !(i in targetObj)){
   targetObj[i] = sourceObj[i];
   }
   }
   return targetObj;
   }

   sub.func.as = "fs";

   console.log(main);*/

  /*
   function F (){

   }

   F.prototype.add = "id";

   var f = new F();

   f.add = "new id";

   delete f.add;*/
  /*
   function Super(name)
   {
   this.name = name;
   }

   Super.prototype.getName = function ()
   {
   return this.name;
   };


   function Sub(id,name){
   Super.call(this,name);
   this.id = id;
   }

   Sub.prototype = Object.create(Super.prototype);


   Sub.prototype.getId = function ()
   {
   return this.id;
   };

   var s = new Sub("id","sub_name");

   s.getName();

   var s1 = new Super("na");

   //check for inheritance
   console.log(s instanceof Super);
   console.log(Super.prototype.isPrototypeOf(s));

   var a = Object.create(null);

   //console.log(mixin(main,sub));*/

  /*  function A(name)
   {
   this.name = name;
   }

   A.prototype.getName = function ()
   {
   return this.name;
   };

   var a = new A("fsddf");

   function B(col,name)
   {
   A.call(this,name);
   this.col = col;
   }

   B.prototype = Object.create(A.prototype);
   B.prototype.constructor = B;

   B.prototype.getCol = function ()
   {
   return this.col;
   };

   var b = new B("col","b_name");

   console.log(b.getName());*/

  /*  var department = "engineeer_global";

   function aa(){
   var department = "engineer";
   console.log(department);
   }

   aa.hello = "hello";*/

  /*  var a = 2;
   function af()
   {
   var b = a;
   console.log(b);
   var a = 22;
   }

   af();*/



  /*  function a(){

   var ab = 2;
   function b()
   {
   console.log(ab);
   }
   return b;
   }

   var execute = a();

   execute();*/

  /*  function ab(pp){
   var b  = pp;

   var privateMethod = function ()
   {
   console.log("hello");
   };

   this.getB = function ()
   {
   return b;
   };

   this.executeMethod = function ()
   {
   privateMethod();
   };

   }

   var obj = new ab(412);

   //console.log(obj.getB());


   function getObj()
   {
   var ab = 55;

   return {
   getAb : function ()
   {
   return ab;
   },
   setAb: function (val)
   {
   ab = val;
   }
   }
   }*/

  //var op = getObj();

  /*  console.log(op.getAb());
   op.setAb(1);
   console.log(op.getAb());*/

  /*  var i;

   for (i = 0; i < 10; ++i){

   (function(ib)
   {
   setTimeout(  function abc(){
   console.log(ib++);
   }
   ,ib);
   })(i);
   }*/

  /*  function aaa(str){
   eval(str);
   console.log(b);
   }

   aaa("var b = 2;");*/

  /*  (function (){

   function Person(age,sex){
   this.age = age;
   this.sex = sex;
   }

   Person.prototype.getAge = function ()
   {
   return this.age
   };

   Person.prototype.getSex = function ()
   {
   return this.sex;
   };

   function Child(age,sex,favoritetoy){
   Person.call(this,age,sex);
   this.favoritetoy = favoritetoy;
   }

   Child.prototype = Object.create(Person.prototype);

   Child.prototype.getFavoriteToy = function ()
   {
   return this.favoritetoy;
   };

   var child1 = new Child(12,'m','barbie');

   console.log(child1);

   for (var i = 0; i < 10; ++i){

   }

   console.log(i);*/

  //})();

  function Module(a, b)
  {
    var privateA = a;
    var privateB = b;

    function p()
    {
      return privateA;
    }

    function p1()
    {
      return privateB;
    }

    function setAb(f)
    {
      privateA = f;
    }

    return {
      getPrivateA: p,
      getPrivateB: p1,
      setPrivateA: setAb
    }
  }

  var SingleTon  = Module(2,1);
  console.log(SingleTon.getPrivateA());
  SingleTon.setPrivateA(9999);
  console.log(SingleTon.getPrivateA());

</script>

</html>