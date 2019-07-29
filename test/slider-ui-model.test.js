const chai = require('chai');
assert = chai.assert;

const SliderUIModel = require("../src/slider-ui-model.js");

describe("SliderUIModel", function () {

    describe("check if properties are observable", function () {

        this.timeout(10)

        const props = ['direction', 'showScale', 'showValue', 'valueUnits'];

        for( let prop of props) {
            it(`property #${prop} is observable`, function (done) {
                let instance = new SliderUIModel();
                instance.register(() => done());
                // trigger notification
                instance[prop] = 13;
            });
        }

    });
 
});