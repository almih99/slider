const chai = require('chai');
assert = chai.assert;

const Subject = require( "../src/subject");


describe("Subject", function () {

    class Observable extends Subject {};

    describe("constructor", function () {

        it("array existance", function () {
            let observable = new Observable();
            assert.typeOf(observable._observers, "array");
        });

        it("initial array length = 0", function () {
            let observable = new Observable();
            assert.strictEqual(observable._observers.length, 0);
        });

    });

    describe("makeObservable", function () {

        let observable = {};
        
        before(function () {
            // makes existing object observable
            Subject.makeObservable(observable);
        });

        it("array existance", function () {
            assert.typeOf(observable._observers, "array");
        });
        
        it("initial array length = 0", function () {
            assert.strictEqual(observable._observers.length, 0);
        });

        it("`register` method existance", function () {
            assert.typeOf(observable.register, "function");
        });

        it("`unregister` method existance", function () {
            assert.typeOf(observable.unregister, "function");
        });

        it("`notifyObservers` method existance", function () {
            assert.typeOf(observable.notifyObservers, "function");
        });

        it("`createObserverableProperty` method existance", function () {
            assert.typeOf(observable.createObserverableProperty, "function");
        });

    });

    describe("#register", function () {

        const testFunc1 = done => 1;
        const testFunc2 = done => 2;

        const testObj1 = { o1Method () {return 1} };
        const testObj2 = { o2Method () {return 2} };

        it("register single observer w/o object", function () {
            let observable = new Observable;
            observable.register(testFunc1);
            assert.strictEqual(observable._observers.length, 1);
        });

        it("register multiple observer w/o object", function () {
            let observable = new Observable;
            observable.register(testFunc1);
            observable.register(testFunc2);
            assert.strictEqual(observable._observers.length, 2);
        });

        it("register single observer with object", function () {
            let observable = new Observable;
            observable.register(testObj1.o1Method, testObj1);
            assert.strictEqual(observable._observers.length, 1);
        });

        it("register multiple observer with object", function () {
            let observable = new Observable;
            observable.register(testObj1.o1Method, testObj1);
            observable.register(testObj2.o1Method, testObj2);
            assert.strictEqual(observable._observers.length, 2);
        });

    });

    describe("#unregister", function () {

        const testFunc = done => "function";
        const testObj = {
            oMethod () {return "object method"},
            oAnotherMethod () {return "object wrong method"}
        };

        let observable;

        beforeEach(function () {
            observable = new Observable;
            observable.register(testFunc);
            observable.register(testObj.oMethod, testObj);
        });

        it("attempt to remove observer with wrong function", function () {
            observable.unregister(testObj.oAnotherMethod, testObj);
            assert.strictEqual(observable._observers.length, 2);
        });

        it("attempt to remove observer with wrong object", function () {
            observable.unregister(testObj.oMethod, Math);
            assert.strictEqual(observable._observers.length, 2);
        });

        it("remove observer with object", function () {
            observable.unregister(testObj.oMethod, testObj);
            assert.strictEqual(observable._observers.length, 1);
        });

        it("remove observer w/o object", function () {
            observable.unregister(testFunc);
            assert.strictEqual(observable._observers.length, 1);
        });

        it("attempt to remove from empty observers list", function () {
            observable = new Observable;
            observable.unregister(testFunc); // no throw test
            assert.strictEqual(observable._observers.length, 0);
        });

    });

    describe("#notifyObservers", function () {

        let observable;

        beforeEach(function () {
            observable = new Observable();
        })

        it("call with empty observers list", function (done) {
            observable.notifyObservers(); // not throws
            done();
        });

        it("call with single function w/o object", function () {
            let result;
            let tst1 = x => result=x;
            observable.register(tst1);
            observable.notifyObservers("done");
            assert.strictEqual(result, "done");
        });

        it("call with single function with object", function () {
            let lsnr = {
                result: undefined,
                tst1: function (x) {this.result = x}
            }
            observable.register(lsnr.tst1, lsnr);
            observable.notifyObservers("done");
            assert.strictEqual(lsnr.result, "done");
        });

        it("call with multiple entries", function () {
            let lsnr1 = { tst: function (x) {this.result = x} }
            let lsnr2 = Object.create(lsnr1);
            let lsnr3 = Object.create(lsnr1);

            observable.register(lsnr1.tst, lsnr1);
            observable.register(lsnr2.tst, lsnr2);
            observable.register(lsnr3.tst, lsnr3);

            observable.notifyObservers("done");

            assert(
                lsnr1.result==="done" && 
                lsnr2.result==="done" && 
                lsnr3.result==="done"
            );
        });

     });

    describe("#createObserverableProperty", function () {

        let observable;

        beforeEach(function () {
            observable = new Observable();
        });

        it("property added", function () {
            observable.createObserverableProperty("newProperty");
            assert.property(observable, "newProperty");
        });

        it("property getting", function () {
            observable.createObserverableProperty("newProperty", "setted");
            assert.strictEqual(observable.newProperty, "setted");
        });

        it("property setting", function () {
            observable.createObserverableProperty("newProperty", "initial");
            observable.newProperty = "setted"
            assert.strictEqual(observable.newProperty, "setted");
        });

        it("notifying when property setted", function () {
            let result = false;
            let callback = () => result = true;
            observable.createObserverableProperty("newProperty", "initial");
            observable.register(callback);
            observable.newProperty = "done";
            assert(result);
        });

        it("multiple property adding", function () {
            observable.createObserverableProperty("newProperty1", 1);
            observable.createObserverableProperty("newProperty2", 2);
            observable.createObserverableProperty("newProperty3", 3);
            assert(
                observable.newProperty1===1 &&
                observable.newProperty2===2 &&
                observable.newProperty3===3
            );
        });

        it("multiple property setting", function () {
            observable.createObserverableProperty("newProperty1", 1);
            observable.createObserverableProperty("newProperty2", 2);
            observable.createObserverableProperty("newProperty3", 3);

            observable.newProperty1 = 10;
            observable.newProperty2 = 11;
            observable.newProperty3 = 12;

            assert(
                observable.newProperty1===10 &&
                observable.newProperty2===11 &&
                observable.newProperty3===12
            );
        });

        it("notifying when each property setted", function () {

            let result=0;
            let callback = () => result++;

            observable.register(callback);

            observable.createObserverableProperty("newProperty1", 1);
            observable.createObserverableProperty("newProperty2", 2);
            observable.createObserverableProperty("newProperty3", 3);

            observable.newProperty1 = 10;
            observable.newProperty2 = 11;
            observable.newProperty3 = 12;

            assert.strictEqual(result, 3);
        });
    });
});