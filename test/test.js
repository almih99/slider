const chai = require('chai');
assert = chai.assert;

const Subject = require( "../src/subject");

describe("Subject", function () {
    describe("Using single function as observer", function(){
        
        it("checking existance of object", function(){
            let s = new Subject();
            assert.exists(s);
        });
        it("checking existance of variable _observers", function(){
            let s = new Subject();
            assert.exists(s._observers);
        });
        it("whether _observers an Array", function(){
            let s = new Subject();
            assert.instanceOf(s._observers, Array);
        })
        it("whether _observers initially empty", function(){
            let s = new Subject();
            assert.equal(s._observers.length, 0);
        })
        it("is function registred", function(){
            let s = new Subject();
            let func1= () => 0;
            s.register(func1);
            assert.equal(s._observers.length, 1);
        })
        it("two function registred", function(){
            let s = new Subject();
            let func1= () => 0;
            let func2= () => 1;
            s.register(func1);
            s.register(func2);
            assert.equal(s._observers.length, 2);
        })
        it("call with single function", function(){
            let s = new Subject();
            let wasCalled=false;
            let func1= () => wasCalled=true;
            s.register(func1);
            s.notifyObservers();
            assert.isTrue(wasCalled);
        })
        it("call with several functions", function(){
            let s = new Subject();
            let wasCalled1=false;
            let wasCalled2=false;
            let func1= () => wasCalled1=true;
            let func2= () => wasCalled2=true;
            s.register(func1);
            s.register(func2);
            s.notifyObservers();
            assert.isTrue(wasCalled1 && wasCalled2);
        })
        it("call with argument functions", function(){
            let s = new Subject();
            let wasCalled1=undefined;
            let wasCalled2=undefined;
            let func1= (x) => wasCalled1=x;
            let func2= (x) => wasCalled2=x;
            s.register(func1);
            s.register(func2);
            s.notifyObservers(5);
            assert.equal(wasCalled1, 5);
            assert.equal(wasCalled2, 5);
        })
        it("remove first function", function() {
            let s = new Subject();
            let wasCalled1=false;
            let wasCalled2=false;
            let func1= () => wasCalled1=true;
            let func2= () => wasCalled2=true;
            s.register(func1);
            s.register(func2);
            s.unregister(func1);
            s.notifyObservers();
            assert.isTrue(!wasCalled1 && wasCalled2);
        })
        it("remove second function", function() {
            let s = new Subject();
            let wasCalled1=false;
            let wasCalled2=false;
            let func1= () => wasCalled1=true;
            let func2= () => wasCalled2=true;
            s.register(func1);
            s.register(func2);
            s.unregister(func2);
            s.notifyObservers();
            assert.isTrue(wasCalled1 && !wasCalled2);
        })
        it("notification without registred functious", function() {
            let s = new Subject();
            assert.doesNotThrow(s.notifyObservers.bind(s));
        });
        it("tst", function(done) {
            done(0);
        })
    })


}) 