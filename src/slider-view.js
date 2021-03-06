SliderUIModel = require("./slider-ui-model.js");
SliderController = require("./slider-controller.js");
const Subject = require("./subject.js");

/**
 * html template for slider
 * @constant
 */
const template = document.createElement("template");

template.innerHTML = `
<div class="a99-slider">

  <div class="a99-slider__rail">
    <div class="a99-slider__rail-hilighted">
      <div class="a99-slider__handler a99-slider__handler_position_left" tabindex="0">
          <div class="a99-slider__badge">12</div>
      </div>
      <div class="a99-slider__handler a99-slider__handler_position_right" tabindex="0">
          <div class="a99-slider__badge">365</div>
      </div>
    </div>
  </div>

  <div class="a99-slider__tick-scale"></div>
  <div class="a99-slider__digital-scale"></div>
  
</div>`;

/**
 * View class for slider
 * 
 * Interacts with SliderController by sending notification and
 * recieving new data through `SliderView#setValue()` call.
 * 
 * Interacts with sliderUIModel directly.
 */
class SliderView extends Subject {

  /**
   * Constructor for SliderView
   * 
   * @constructor
   * @param {HTMLElement} node Node to mount slider
   * @param {SliderUIModel} uiModel UI options
   */
  constructor (node, uiModel) {
    super();

    this.node = node;
    this.uiModel=uiModel;

    this._onMouseDown = this._onMouseDown.bind(this);
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onMouseUp = this._onMouseUp.bind(this);
    this._onResize =  this._onResize.bind(this);
    this._onClick =  this._onClick.bind(this);

    this._minPercent = 0;
    this._maxPercent = 100;
    this._currentKnob = null;

    uiModel.register(this.render, this);
    this.render();

    window.addEventListener("resize", this._onResize);
    this.node.addEventListener("mousedown", this._onMouseDown);
    this.node.addEventListener("click", this._onClick);
  }

  /**
   * Moves knobs to new values (in percent) and sets text of badges.
   * If corresponding to knob value is `NaN`, hides knob.
   * 
   * @param {number} minPercent position of th left knob
   * @param {*} minText content of the left badge
   * @param {number} maxPercent position of the right knob
   * @param {*} maxText content of the right badge
   */
  setValue (minPercent, minText, maxPercent, maxText) {
    // Hide unused knobs
    const knobs=this.node.querySelectorAll(".a99-slider__handler");
    knobs[0].style.display = isNaN(minPercent)? "none" : "block";
    knobs[1].style.display = isNaN(maxPercent)? "none" : "block";
    // normalization
    minPercent = isNaN(minPercent) ? 0 : Math.max(minPercent, 0);
    maxPercent = isNaN(maxPercent) ? 0 : Math.min(maxPercent, 100);
    // store values in object for easy access
    this._minPercent = minPercent;
    this._maxPercent = maxPercent;
    // setting range
    const rangeElem = this.node.querySelector(".a99-slider__rail-hilighted");
    rangeElem.style[
      this.uiModel.direction==="vertical"? "bottom" : "left"
    ] = minPercent + "%";
    rangeElem.style[
      this.uiModel.direction==="vertical"? "height" : "width"
    ] = maxPercent - minPercent + "%";
    // setting badges text
    const badges = this.node.querySelectorAll(".a99-slider__badge");
    badges[0].innerHTML = minText;
    badges[1].innerHTML = maxText;
  }

  /**
   * Handler for starting drag process.
   * 
   * Attached to knobs when `SliderView` is constructed.
   * 
   * !! Method is binded to `SliderView` object
   * 
   * @private
   * @param {MouseEvent} event 
   */
  _onMouseDown (event) {
    // set mousemove handler
    document.addEventListener("mousemove", this._onMouseMove);
    // set mouseup handler
    document.addEventListener("mouseup", this._onMouseUp);
    // change knobs z-index
    for(knob of this.node.querySelectorAll(".a99-slider__handler")) {
      knob.style.zIndex = (knob === event.target) ? "2" : 1;
    }
    this._currentKnob = event.target.closest(".a99-slider__handler");
  }

  /**
   * Handler for dragging knob process.
   * 
   * Attached to `document` when user press mouse button on knob.
   * 
   * Detached when mouse button relized.
   * 
   * !! Method is binded to `SliderView` object
   * 
   * @private
   * @param {MouseEvent} event 
   */
  _onMouseMove (event) {
    // check if drag started;
    if(!this._currentKnob) return;

    // turn off transition
    this.node.querySelector(".a99-slider__rail-hilighted").style.transition="none";

    // calculate position
    const sliderBox = this.node.querySelector(".a99-slider__rail").getBoundingClientRect();
    let position;
    if(this.uiModel.direction==="vertical") {
      position = (sliderBox.bottom - event.clientY) / (sliderBox.bottom - sliderBox.top);
    } else {
      position = (event.clientX - sliderBox.left) / (sliderBox.right - sliderBox.left);
    }
    position = 100 * Math.min(Math.max(position, 0), 1);

    // send position to controller
    if(this._currentKnob.classList.contains("a99-slider__handler_position_left")) {
      // left knob was changed
      this.notifyObservers(Math.min(position, this._maxPercent), this._maxPercent);
    } else {
      // right knob was changed
      this.notifyObservers(this._minPercent, Math.max(position, this._minPercent));
    }
  }

  /**
   * Handler for releasing mouse button.
   * 
   * Attached to `document` when user press mouse button on knob.
   * 
   * Detached when mouse button relized.
   * 
   * !! Method is binded to `SliderView` object
   * 
   * @private
   * @param {MouseEvent} event 
   */
  _onMouseUp (event) {
    // turn on transition
    this.node.querySelector(".a99-slider__rail-hilighted").style.transition="";
    // clear handlers"mouseup", this._onMouseUp
    document.removeEventListener("mouseup", this._onMouseUp);
    document.removeEventListener("mousemove", this._onMouseMove);
    this._currentKnob = null;
  }

  /**
   * Handler for clicking on rail.
   * 
   * @param {MouseEvent} event 
   */
  _onClick (event) {
    if(!(event.target.classList.contains("a99-slider__rail-hilighted") ||
         event.target.classList.contains("a99-slider__rail"))) {
      // unexpected place
      return
    }
    // calculate position
    const sliderBox = this.node.querySelector(".a99-slider__rail").getBoundingClientRect();
    let position;
    if(this.uiModel.direction==="vertical") {
      position = (sliderBox.bottom - event.clientY) / (sliderBox.bottom - sliderBox.top);
    } else {
      position = (event.clientX - sliderBox.left) / (sliderBox.right - sliderBox.left);
    }
    position = 100 * Math.min(Math.max(position, 0), 1);
    // Send position to controller
    if(Math.abs(position - this._maxPercent) < Math.abs(position - this._minPercent)) {
      this.notifyObservers(this._minPercent, Math.max(position, this._minPercent));
    } else {
      this.notifyObservers(Math.min(position, this._maxPercent), this._maxPercent);
    }
  }

  /**
   * Handler for resizing window.
   * 
   * Because of fixed sizes in numeric lables.
   * 
   * !! Method is binded to `SliderView` object.
   * 
   * @private
   * @param {MouseEvent} event 
   */
  _onResize (event) {
    this.render();
  }

  /**
   * Draws ruler ticks
   * 
   * @private
   * @param {HTMLElement} where where to draw
   * @param {number} mainTicksCount main ruler spans amount
   * @param {number} auxTicksCount auxilary ruler ticks amount
   */
  _drawTicks (where, mainTicksCount, auxTicksCount) {
    for(let i=0; i<=mainTicksCount; i++) {
      const mainTicket = document.createElement("div");
      mainTicket.className="a99-slider__main-tick";
      where.appendChild(mainTicket);
      if(i!==mainTicksCount) {
        for(let j=1; j<auxTicksCount; j++) {
          const subTicket = document.createElement("div");
          subTicket.className="a99-slider__aux-tick";
          where.appendChild(subTicket);
        }
      }
    }
  }

  /**
   * Draws labels on ruler
   * 
   * @private
   * @param {HTMLElement} where where to draw
   * @param {*[]} numberList 
   */
  _drawLabels (where, numberList) {

    function adjustHorizontalSpacing() {
      const horizontallPadding = Math.round(where.offsetWidth/(2*(numberList.length-1)))
      where.style.paddingLeft=horizontallPadding + "px";
      where.style.paddingRight=horizontallPadding + "px";
    }

    function adjustVerticalSpacing() {
      const verticalPadding = Math.round(where.offsetHeight/(2*(numberList.length-1)))
      where.style.paddingTop = verticalPadding + "px";
      where.style.paddingBottom = verticalPadding + "px";
      where.style.lineHeight = verticalPadding * 2 + "px"
    }

    if(this.uiModel.direction==="vertical") {
      adjustVerticalSpacing()
    } else {
      adjustHorizontalSpacing()
    }

    for(const mark of numberList) {
      const labelDiv = document.createElement("div");
      labelDiv.className="a99-slider__digit";
      labelDiv.innerHTML=String(mark);
      where.appendChild(labelDiv);
    }
  }

  /**
   * Rendering function.
   * 
   * Disposes html template of slider in DOM node and sets some styles
   */
  render () {
      this.node.innerHTML="";
      this.node.appendChild(template.content.cloneNode(true));
      
      const sliderNode = this.node.querySelector(".a99-slider");

      // slider direction
      if (this.uiModel.direction==="vertical") {
        sliderNode.classList.add("a99-slider_vertical");
      }

      // show or hide badges with current values
      if (this.uiModel.showValue) {
        sliderNode.classList.add("a99-slider_show-badge");
      }

      // show ticks if it is needed
      if(this.uiModel.ticks) {
        const scale = this.node.querySelector(".a99-slider__tick-scale");
        this._drawTicks(scale, this.uiModel.ticks, this.uiModel.subticks);
      }

      // show digit labels if it is needed
      if( this.uiModel.labels && 
          Array.isArray(this.uiModel.labels) && 
          this.uiModel.labels.length) {
        const labels=this.node.querySelector(".a99-slider__digital-scale");
        this._drawLabels(labels, this.uiModel.labels);
      }

      // notify controller
  }
  
}

module.exports = SliderView;