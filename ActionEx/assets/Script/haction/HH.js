/**
 * ihowe@outlook.com
 * author by haroel
 * Created by howe on 2017/3/23.
 */

let hh = hh || {};
module.exports = hh;

let HActionInstant= require("HActionInstant");
let HActionInterval = require("HActionInterval");
let HActionTween = require("HActionTween");
let HActionTweenBy = require("HActionTweenBy");
let HActionSpawn = require("HActionSpawn");
let HActionSequence = require("HActionSequence");


let __checkParams = function ( params ) {

    // 剔除参数当中的不需要数据
    let obj = {};
    for (let k in params)
    {
        let _o = params[k];
        if (typeof _o === "number")
        {
            obj[k] = _o;
        }
    }
    return obj;
};

hh.callFuncWithParam = function (func , ...aArgs)
{
    let vars = {};
    vars["onComplete"] = function()
    {
        func(...aArgs);
    };
    return HActionInstant.create(vars);
};

hh.callFunc = function (func , params/* null */, vars/* null */)
{
    vars = vars || {};
    vars["onComplete"] = function()
    {
        func(params);
    };
    return HActionInstant.create(vars);
};

hh.delay = function (duration,vars/* null */)
{
    return HActionInterval.create(duration,vars);
};

hh.sequence = function ( actions, vars/* null */)
{
    let action = HActionSequence.create(actions,vars);
    return action;
};

hh.spawn = function (actions, vars/* null */)
{
    let action = HActionSpawn.create(actions,vars);
    return action;
};

hh.tween = function ( duration,params,vars )
{
    params = __checkParams(params);
    let _vars = vars;
    if (!_vars)
    {
        _vars = params || {};
    }else
    {
        for (let k in params)
        {
            _vars[k] = params[k]
        }
    }
    let tween = HActionTween.create(duration,_vars);
    return tween;
};

hh.tweenBy = function ( duration,params,vars )
{
    params = __checkParams(params);
    let _vars = vars;
    if (!_vars)
    {
        _vars = params || {};
    }else
    {
        for (let k in params)
        {
            _vars[k] = params[k]
        }
    }
    let tween = HActionTweenBy.create(duration,_vars);
    return tween;
};

hh.moveTo = function ( duration, pos, vars/* null */  )
{
    return hh.tween(duration,pos,vars);
};

hh.moveBy = function ( duration, pos, vars/* null */  )
{
    return hh.tweenBy(duration,pos,vars);
};

hh.scaleTo = function ( duration, scaleParams, vars/* null */  )
{
    return hh.tween(duration,scaleParams,vars);
};

hh.scaleBy = function ( duration, scaleParams, vars/* null */  )
{
    return hh.tweenBy(duration,scaleParams,vars);
};

hh.skewTo = function ( duration, skewParams, vars/* null */  )
{
    return hh.tween(duration,skewParams,vars);
};

hh.skewBy = function ( duration, skewParams, vars/* null */  )
{
    return hh.tweenBy(duration,skewParams,vars);
};

hh.rotateTo = function ( duration, numberOrObj, vars/* null */  )
{
    let params = null;
    if (typeof numberOrObj === "number")
    {
        params = {};
        params.rotationX = numberOrObj;
        params.rotationY = numberOrObj;
    }else
    {
        params = numberOrObj;
    }
    return hh.tween(duration,params,vars);
};

hh.rotateBy = function ( duration, numberOrObj, vars/* null */  )
{
    let params = null;
    if (typeof numberOrObj === "number")
    {
        params = {};
        params.rotationX = numberOrObj;
        params.rotationY = numberOrObj;
    }else
    {
        params = numberOrObj;
    }
    return hh.tweenBy(duration,params,vars);
};

hh.fadeTo = function ( duration, opacity, vars/* null */  )
{
    let params = {};
    params.opacity = opacity;
    return hh.tween(duration,params,vars);
};

hh.fadeIn = function ( duration, vars/* null */  )
{
    return hh.fadeTo(duration,255,vars)
};

hh.fadeOut = function ( duration, vars/* null */  )
{
    return hh.fadeTo(duration,0,vars)
};

hh.show = function ( vars/* null */ ) {
    vars = vars || {};
    let m = new HActionInstant();
    vars.onComplete = function ( action )
    {
        action.getNode()._sgNode.setVisible(true);
    };
    m.init(vars);
    return m;
};

hh.hide = function ( vars/* null */ ) {
    vars = vars || {};
    let m = new HActionInstant();
    vars.onComplete = function ( action )
    {
        action.getNode()._sgNode.setVisible(false);
    };
    m.init(vars);
    return m;
};