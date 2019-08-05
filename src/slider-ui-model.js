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
        this.createObserverableProperty("showValue", true);
        this.createObserverableProperty("valueUnits", "");
        this.createObserverableProperty("ticks", 0);
        this.createObserverableProperty("subticks", 0);
        this.createObserverableProperty("labels", null);
    }

}

module.exports = SliderUIModel; 