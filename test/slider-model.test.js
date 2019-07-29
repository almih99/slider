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

        this.timeout(10);

        const props = ['value', 'min', 'max', 'step'];
        
        for(let prop of props) {
            it(`property #${prop} is observable`, function (done) {
                let instance = new SliderModel();
                instance.register(() => done());
                //trigger notification:
                instance[prop] = 13;
            });
        }

    });

});