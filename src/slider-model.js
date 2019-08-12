const Subject = require("./subject.js");

/**
 * Default model for slider.
 * 
 * It should inherit from Subject or at least 
 * implement #register and #notifyObservers methods.
 * 
 * The last one have to return model object.
 * 
 * @class
 * @extends Subject
 */

class SliderModel extends Subject {
    /**
     * 
     * @param {number} [value] initial value
     * @param {number} [min] minimal value
     * @param {number} [max] maximal value
     * @param {number} [step] value step
     */
    constructor (value=0, min=0, max=100, step=1) {
        super();
        this.createObserverableProperty("value", value);
        this.createObserverableProperty("min", min);
        this.createObserverableProperty("max", max);
        this.createObserverableProperty("step", step);
    }
}

module.exports = SliderModel; 