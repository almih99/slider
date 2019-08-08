import SliderUIModel from "./slider-ui-model.js";
import SliderController from "./slider-controller.js";

const template = document.createElement("template");


 // a99-slider_vertical
 // a99-slider_show-badge

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

class SliderView {
  constructor (node, uiModel) {
    this.node = node;
    this.uiModel=uiModel;

    this._onMouseDown = this._onMouseDown.bind(this);
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onMouseUp = this._onMouseUp.bind(this);
    this._onResize =  this._onResize.bind(this);

    uiModel.register(this.render, this);
    this.render();

    window.addEventListener("resize", this._onResize);

  }

  setValue(minPercent, minText, maxPercent, maxText) {
    // Hide unused knobs
    const knobs=this.node.querySelectorAll(".a99-slider__handler");
    knobs[0].style.display = isNaN(minPercent)? "none" : "block";
    knobs[1].style.display = isNaN(maxPercent)? "none" : "block";
    // normalization
    minPercent = isNaN(minPercent) ? 0 : minPercent;
    minPercent= Math.max(minPercent, 0);
    maxPercent = isNaN(maxPercent) ? 0 : maxPercent;
    maxPercent= Math.min(maxPercent, 100);
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

  _onMouseDown (event) {

  }

  _onMouseMove (event) {

  }

  _onMouseUp (event) {

  }

  _onResize (event) {
    this.render();
  }

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