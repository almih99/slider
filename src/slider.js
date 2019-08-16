const SliderModel = require("./slider-model.js");
const SliderView = require("./slider-view.js");
const SliderUIModel = require("./slider-ui-model");
const SliderController = require("./slider-controller.js");

let uimodel;
let view;


class Slider {
    constructor (placement, model=new SliderModel(), uiModel=new SliderUIModel()) {
        this.data = model;        
        this.uiData = uiModel;
        this.view = new SliderView(placement, this.uiData);
        this.controller = new SliderController(this.data, this.view);
        placement.data=this.data;
        placement.uiData=this.uiData;
    }
}

window.addEventListener("load", function (e) {

    // horizontal
    h = new Slider(document.getElementById("slider1"));
    h.uiData.ticks=10;
    h.uiData.subticks=5;
    h.uiData.labels=[10,20,40,60,80,100];
    h.uiData.showValue=true;

    // vertical
    v = new Slider(document.getElementById("slider2"));
    v.uiData.direction = "vertical";
    v.uiData.ticks=5;
    v.uiData.subticks=10;
    v.uiData.labels=["min",100,200,300,400,"max"];
    v.uiData.showValue=true;

});




