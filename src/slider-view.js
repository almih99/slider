import SliderUIModel from "./slider-ui-model.js";
import SliderController from "./slider-controller.js";

const template = document.createElement("template");
template.innerHTML = `
<div class="slider">
<!--
  slider_vertical
  slider_show-badge
  slider_show-ticks
  slider_show-digits
  slider_show-range
  slider_show-range-line
-->

  <div class="slider__rail">
    <div class="slider__rail-hilighted">
      <div class="slider__handler slider__handler_position_left">
          <div class="slider__badge">12</div>
      </div>
      <div class="slider__handler slider__handler_position_right">
          <div class="slider__badge">365</div>
      </div>
    </div>
    
  </div>

  <div class="slider__tick-scale"></div>
  <div class="slider__digital-scale"></div>
  
</div>`;

class SliderView {
  constructor (node, uiModel) {
console.log(node, uiModel);
    this.node = node;
    this.uiModel=uiModel;

    this._onMouseDown = this._onMouseDown.bind(this);
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onMouseUp = this._onMouseUp.bind(this);    

    uiModel.register(this.render, this);
    this.render(uiModel);

  }

  setValue(percentage) {
    // view don't care about actual size of everething. It uses only percents.
  }

  _onMouseDown (event) {

  }

  _onMouseMove (event) {

  }

  _onMouseUp (event) {

  }

  _drawTicks (where, mainTicksCount, auxTicksCount) {
    for(let i=0; i<=mainTicksCount; i++) {
      const mainTicket = document.createElement("div");
      mainTicket.className="slider__main-tick";
      where.appendChild(mainTicket);
      if(i!==mainTicksCount) {
        for(let j=1; j<auxTicksCount; j++) {
          const subTicket = document.createElement("div");
          subTicket.className="slider__aux-tick";
          where.appendChild(subTicket);
        }
      }
    }
  }

  _drawLabels (where, numberList) {
    const blockSize = this.uiModel.direction==="vertical" ? where.offsetHeight : where.offsetWidth;

    if(this.uiModel.direction==="vertical") {
      const verticalPadding = Math.round(where.offsetHeight/(2*(numberList.length-1)))
      where.style.paddingTop = verticalPadding + "px";
      where.style.paddingBottom = verticalPadding + "px";
      where.style.lineHeight = verticalPadding * 2 + "px";
    } else {
      const horizontallPadding = Math.round(where.offsetWidth/(2*(numberList.length-1)))
      where.style.paddingLeft=horizontallPadding + "px";
      where.style.paddingRight=horizontallPadding + "px";
    }

    for(const mark of numberList) {
      const labelDiv = document.createElement("div");
      labelDiv.className="slider__digit";
      labelDiv.innerHTML=String(mark);
      where.appendChild(labelDiv);
    }
  }

  render (uiModel) {
      this.node.innerHTML="";
      this.node.appendChild(template.content.cloneNode(true));
      
      const sliderNode = this.node.querySelector(".slider");

      // slider direction
      if (uiModel.direction==="vertical") {
        sliderNode.classList.add("slider_vertical");
      }

      // show or hide badges with current values
      if (uiModel.showValue) {
        sliderNode.classList.add("slider_show-badge");
      }

      // show ticks if it is needed
      if(uiModel.ticks) {
        const scale = this.node.querySelector(".slider__tick-scale");
        this._drawTicks(scale, uiModel.ticks, uiModel.subticks);
      }

      // show digit labels if it is needed
      if(uiModel.labels && Array.isArray(uiModel.labels) && uiModel.labels.length) {
        const labels=this.node.querySelector(".slider__digital-scale");
        this._drawLabels(labels, uiModel.labels);
      }
  }
  
}

module.exports = SliderView;