const chai = require('chai');
assert = chai.assert;

const SliderUIModel = require("../src/slider-ui-model.js");

describe("SliderUIModel", function () {

    describe("check if properties are observable", function () {

        it("property #direction is observable", function (done) {
            let instance = new SliderUIModel();
            instance.register(() => done());
            // trigger notification
            instance.direction = 0;
        });

        it("property #showScale is observable", function (done) {
            let instance = new SliderUIModel();
            instance.register(() => done());
            // trigger notification
            instance.showScale = 0;
        });

        it("property #showValue is observable", function (done) {
            let instance = new SliderUIModel();
            instance.register(() => done());
            // trigger notification
            instance.showValue = 0;
        });

        it("property #valueUnits is observable", function (done) {
            let instance = new SliderUIModel();
            instance.register(() => done());
            // trigger notification
            instance.valueUnits = 0;
        });

    });
 
});