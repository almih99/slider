const Subject = require("./subject.js");

/**
 * UI model for slider.
 * 
 * Contains properties for ajusting appearance.
 * 
 * @class
 */
class SliderUIModel extends Subject {
    constructor () {
        super();
        this.createObserverableProperty("direction", "horizontal");
        this.createObserverableProperty("showScale", false);
        this.createObserverableProperty("showValue", true);
        this.createObserverableProperty("valueUnits", "");
    }

}

module.exports = SliderUIModel; 