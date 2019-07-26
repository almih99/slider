const chai = require('chai');
assert = chai.assert;

const SliderModel = require("../src/slider-model.js");

describe("SliderModel", function () {

    describe("check if constructor sets initial values", function () {

        const instance = new SliderModel(100,1,1000,10);

        it("check #value initial value", function () {
            assert.strictEqual(instance.value, 100);
        });

        it("check #min initial value", function () {
            assert.strictEqual(instance.min, 1);
        });

        it("check #max initial value", function () {
            assert.strictEqual(instance.max, 1000);
        });

        it("check #step initial value", function () {
            assert.strictEqual(instance.step, 10);
        });

    });

    describe("check if properties are observable", function () {

        it("property #value is observable", function (done) {
            let instance = new SliderModel();
            instance.register(() => done());
            //trigger notification:
            instance.value = 0;
        });

        it("property #min is observable", function (done) {
            let instance = new SliderModel();
            instance.register(() => done());
            //trigger notification:
            instance.min = -10;
        });

        it("property #max is observable", function (done) {
            let instance = new SliderModel();
            instance.register(() => done());
            //trigger notification:
            instance.max = 10;
        });

        it("property #step is observable", function (done) {
            let instance = new SliderModel();
            instance.register(() => done());
            //trigger notification:
            instance.step = 1;
        });

    });

});