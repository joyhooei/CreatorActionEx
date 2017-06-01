/**
 * ihowe@outlook.com
 * author by haroel
 * Created by howe on 2017/3/21.
 *
 * HActionInterval是基于时间调度的动作基类
 */

let HActionInterval = cc.Class({
    extends : require("HAction"),
    ctor:function ()
    {
        this._totalTime = 0.001;
        this._currentTime = 0;
        this._progress = 0;
        this.easingFunc = null; // 缓动函数
    },
    getCurrentTime:function () {
        return this._currentTime;
    },
    getDuration:function () {
        return this._totalTime;
    },

    getProgress:function () {
        return this._progress;
    },

    init:function (duration,vars /*null */ )
    {
        if ( duration > 0 )
        {
            this._totalTime = duration;
        }
        this._super(vars);
    },

    playAction:function ()
    {
        this._super();
        this._currentTime = 0;
        this._progress = 0;
    },
    /*
     * 请重写改方法以实现更多行为
     * update Action状态
     * @ target : HAction类
     * */
    $update:function (dt)
    {
        this._currentTime += dt;
        if (this._currentTime >= this._totalTime )
        {
            this._progress = 1.0;
            this.update(this._progress);
            this.$actionComplete();
        }else
        {
            this._progress = this._currentTime/this._totalTime;
            this.update(this._progress);
        }
    },
    /*
    * 扩展以实现更多方法
    * */
    update:function (rate)
    {
        if (this.easingFunc)
        {
            this._progress = this.easingFunc( this._progress )
        }
        this._super(this._progress);
        //TODO What you want to do next;

    },
    setSpeed:function ( speedValue )
    {
        if (this._progress >= 1.0)
        {
            return this;
        }
        speedValue = Math.abs(speedValue);
        if (speedValue === 0)
        {
            return this;
        }
        // 重新计算总时间
        let leftTime = (this._totalTime - this._currentTime)/speedValue;
        if (leftTime <= 0)
        {
            return this;
        }
        this._totalTime = this._currentTime + leftTime;
        return this._super(speedValue);
    },
    /*
     * 参数为缓动函数, 函数定义可查看GEaseDefine.js文件
     * 你可以传入一个自己定义的函数,该函数必须接受progress值来处理
     * */
    easing:function ( easeFunc )
    {
        if (typeof easeFunc === "function")
        {
            this.easingFunc = easeFunc;
        }
        return this;
    },
    /* cloneSelf 不复制方法 */
    cloneSelf:function ()
    {
        let act = new HActionInterval();
        act.init( this.getDuration(), this.getVars() );
        act.easing(this.easingFunc);
        return act;
    },
    /*
     * 仅继承重写,不可外部调用,该方法由ActionComponent自动调用!!!!!
     * */
    $destroy:function ()
    {
        this.easingFunc = null;
        this._super();
    }
});

HActionInterval.create = function (duration,vars)
{
    let act = new HActionInterval();
    act.init(duration,vars);
    return act;
};

module.exports = HActionInterval;