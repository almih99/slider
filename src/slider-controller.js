const SliderModel = require("./slider-model.js");
const SliderView = require("./slider-view.js");
const Subject = require("./subject.js");

class SliderController extends Subject {
    constructor (model, view) {
        super();
        this.model = model;
        this.view = view;

        this.view.register(this.handlePositionChange, this);

    }

    handlePositionChange(pos1, pos2) {
        this.view.setValue(pos1, Math.round(pos1), pos2, Math.round(pos2));
    }


}

module.exports = SliderController;