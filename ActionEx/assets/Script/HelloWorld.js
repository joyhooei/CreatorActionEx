cc.Class({
    extends: cc.Component,

    properties: {
        label: {
            default: null,
            type: cc.Label
        },
        // defaults, set visually when attaching this script to the Canvas
        text: 'Hello, World!'
    },

    // use this for initialization
    onLoad: function () {
        this.label.string = this.text;
        require("HH");
        let obj = hh.delay(1.0);
        cc.log(obj);
        cc.log(Object.keys(obj));
    },

    // called every frame
    update: function (dt) {

    },
});
