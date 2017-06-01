/**
 * ihowe@outlook.com
 * author by haroel
 * Created by howe on 2017/4/13.
 *
 * 测试文件
 */
cc.Class({
    extends: cc.Component,

    properties: {
        node1:cc.Node,
        node2:cc.Node,
        node3:cc.Node,
        node4:cc.Node,
        node5:cc.Node,
    },

    onLoad: function ()
    {
        let hh = require("HH");

        // let act1 = hh.moveBy(2.0,cc.v2(200,200),{delay:4.0}).then(hh.scaleTo(0.4,{scaleX:3.0,scaleY:2.0}));
        // this.node1.RunAction( act1);
        //
        // let act2 = act1.clone();
        // this.node2.RunAction( act2);

        // let act3 = hh.spawn( [hh.moveBy(2.0,cc.v2(200,0),{delay:0.5}), hh.scaleTo(3.3,{scaleX:3.0,scaleY:2.0})]  );
        // this.node3.RunAction( act3.repeat(7));

        let act4 = hh.sequence( [hh.moveBy(2.0,cc.v2(200,0),{delay:1.0}), hh.scaleTo(3.3,{scaleX:3.0,scaleY:2.0}) ]  );
        this.node4.RunAction( act4.repeat(5) );
        //
        let act5 = hh.sequence( [hh.moveBy(2.0,cc.v2(200,0),{delay:1.0}), hh.tween(2.2,{width:200,height:33}) ]  ).clone();
        this.node5.RunAction( act5 );
    }

});
