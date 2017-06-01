/**
 * ihowe@outlook.com
 * author by haroel
 * Created by howe on 2017/3/17.
 * HAction核心基类
 */
require("HNodeEx");
let utils = require("HUtil");
let HVars = require("HVars");

// 生成唯一ID
let UUID_GENERATOR = (function ()
{
    var i = 0;
    return function ()
    {
        return "__HAction_uuid_" + i++;
    }
})();

//0 表示初始化,1表示运行,2表示暂停,3表示停止,4表示销毁
let STATE = {
    INITIAL:0,
    RUNNING:1,
    PAUSED:2,
    STOPPED:3,
    DEAD:4
};
// HAction核心基类,请不要直接实例化使用
let HAction = cc.Class({
    ctor:function () {
        this.$uuid = UUID_GENERATOR();
        this._delay = 0;
        this.tag = 0;

        this._state = STATE.INITIAL;

        this._finishCallback = null;
        this._actionComponent = null;

        this._vars = new HVars();
    },
    getState :function () {
        return this._state;
    },
    isRunning:function () {
        return this._state === STATE.RUNNING;
    },

    getVars:function ()
    {
        return this._vars;
    },
    /*
     *  获取HAction作用的cc.Node对象
     * */
    getNode:function ()
    {
        if (this._actionComponent)
        {
            return this._actionComponent.getTargetNode();
        }
        return null;
    },

    $getNextAction :function () {
        return this["__nextAction"];
    },
    $setNextAction:function (action, index /* null**/)
    {
        let _i = 9999999;
        if ( typeof index === "number" && index > -1 )
        {
            _i = index;
        }
        let i = 0;
        let preAction = this;
        let nextAct = this["__nextAction"];
        while(nextAct)
        {
            if (i === _i)
            {break;}
            preAction = nextAct;
            nextAct = nextAct["__nextAction"];
            if (!nextAct)
            {
                break;
            }
            ++i;
        }
        utils.invalidActionAndNext(nextAct);
        preAction["__nextAction"] = action;
        return action;
    },
    $removeNextAction:function () {
        utils.invalidActionAndNext( this["__nextAction"] );
        this["__nextAction"] = null;
    },

    /*
     * 初始化 (可重写改方法)
     * */
    init:function( vars )
    {
        this._vars.patchParams(vars);
    },
    /*
     * 开始绑定动作 (请继承以实现更多方法)
     * @ component: HAactionComponent组件
     * @ vars 额外参数 (克隆出需要保留的参数) :
     * 系统支持:delay,onUpdate,onComplete,repeat,actionComponent
     * */
    startWithTarget:function ( component  )
    {
        if (this._actionComponent)
        {
            throw new Error("Error, HAction Had been added! ");
            return;
        }
        this._actionComponent = component;
        this.playAction();
    },

    /* 具体实现请继承 */
    playAction:function ()
    {
        this._state = STATE.RUNNING;
        this._delay = this._vars["delay"];
    },
    /*
     * 执行调度函数,由actionComponent来执行,
     * 此处需要区分三种update调用
     * _$update:由actionComponent来执行
     *  $update:二级调度方法, ActionInterval来继承调用
     *  update: 外部可继承的update方法
     * */
    _$update:function (dt)
    {
        if (this._state !== STATE.RUNNING)
        {
            return;
        }
        // 处理延时调用
        if (this._delay > 0)
        {
            this._delay -= dt;
            return;
        }
        this.$update(dt);

        let vars = this._vars;
        if ( vars && vars["onUpdate"] )
        {
            vars["onUpdate"](this, dt );
        }
    },
    $update:function(dt)
    {
        this.update(0);

    },
    /*
     * 请重写改方法以实现更多行为
     * update Action状态
     * @ rate : action进度值 0~1
     * */
    update:function (rate)
    {
        //TODO What you want to do;

    },

    /*
    * 子类动作结束时请调用该方法
    * */
    $actionComplete:function ()
    {
        let vars = this._vars;
        if ( vars["onComplete"] )
        {
            vars["onComplete"](this);
        }
        let count = vars["repeat"];
        if ( count > 0 )
        {
            this.playAction();  // 重置状态
            this.repeat( count - 1 );
        }else {
            this._state = STATE.STOPPED;
            if ( vars["onStoped"] )
            {
                vars["onStoped"](this);
            }
            if (this._finishCallback)
            {
                this._finishCallback(this,this.$getNextAction());
            }
            if (this._actionComponent)
            {
                // 注意:playComplete不一定会调用成功,因为某些action是由spawn来维护
                this._actionComponent.playComplete(this);
            }
        }
    },
    $setFinishCallback:function (callback) {
        this._finishCallback = callback;
    },

    pause:function ()
    {
        this._state = STATE.PAUSED;
    },
    resume:function ()
    {
        this._state = STATE.RUNNING;
    },
    /*
    * then式调用链,可以用链式方法来处理,
    * 建议用then方式来取代Sequence
    * */
    then:function ()
    {
        if (arguments.length === 1)
        {
            utils.linkAction(this,arguments[0]);
        }else if (arguments.length > 1)
        {
            utils.parallelAction(this,arguments);
        }
        return this;
    },
    /*
     * 完备克隆action
     * 如果有鏈式结构,会一并克隆下去
     * */
    clone :function ()
    {
        let target = this.cloneSelf();
        let nextAct = this.$getNextAction();
        while(nextAct)
        {
            target.$setNextAction( nextAct.cloneSelf() );
            nextAct = nextAct.$getNextAction();
        }
        return target;
    },
    /**
     * 克隆自身
     * 每个子类独立去实现克隆方法
     */
    cloneSelf:function ()
    {
        return null;
    },

    getSpeed:function () {
        return this._vars["speed"];
    },
    /* 是否把加速出啊满地给next */
    setSpeed:function ( speedValue )
    {
        this._vars["speed"] = speedValue;
        return this;
    },
    repeatForever:function ()
    {
        this._vars["repeat"] = Number.MAX_VALUE;
        return this;
    },
    /*
     * 重新repeat播放 value 重复次数
     * */
    repeat:function ( value )
    {
        this._vars["repeat"] = value;
        return this;
    },
    onUpdate:function (func) {
        this._vars["onUpdate"] = func;
        return this;
    },
    onComplete:function ( func ) {
        this._vars["onComplete"] = func;
        return this;
    },
    onStoped:function (func)
    {
        this._vars["onStoped"] = func;
        return this;
    },

    $invalid:function()
    {
        if (this._actionComponent)
        {
            this._actionComponent.addActionToInvalidList(this);
        }else
        {
            this.$destroy();
        }
    },
    /*
     * 仅继承重写,不可外部调用!!!!!
     * */
    $destroy:function ()
    {
        // cc.log("销毁" + this.$uuid);
        this._state = STATE.DEAD;
        this._vars = null;
        this["__nextAction"] = null;
        this._finishCallback = null;
        this._actionComponent = null;
    }
});
module.exports = HAction;