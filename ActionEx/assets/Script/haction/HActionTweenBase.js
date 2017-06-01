/**
 * ihowe@outlook.com
 * author by haroel
 * Created by howe on 2017/4/14.
 *
 * 属性补间类基类
 */
let HActionTweenBase = cc.Class({
    extends : require("HActionInterval"),
    ctor:function () {
        this._intialAttrList = null;
    },
    playAction:function () {
        this._super();
        if (this._intialAttrList)
        {
            // 重置所有属性
            let node = this.getNode();
            let pList = this._intialAttrList;
            for (let key in pList)
            {
                node[key] = pList[key];
            }
        }
    },
    startWithTarget:function ( component  )
    {
        this._super(component);
        this._intialAttrList = {};
        let _node = this.getNode();
        for (var key in this._vars)
        {
            if ( typeof _node[key] === "number" )
            {
                let _o = typeof _node[key];
                if ( _o === 'number')
                {
                    this._intialAttrList[key] = _node[key];
                }
            }
        }
    },
    $destroy:function ()
    {
        this._intialAttrList = null;
        this._super();
    }
});
module.exports = HActionTweenBase;