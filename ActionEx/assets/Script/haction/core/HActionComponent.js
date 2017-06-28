/**
 * ihowe@outlook.com
 * author by haroel
 * Created by howe on 2017/3/21.
 *
 * hActionComponent是管理父Node节点的组件。
 * 不允许外部对其直接访问和修改!
 */
let utils = require("HUtil");

let _destroyFunc = function (action)
{
    action.$destroy();
};
module.exports = cc.Class({
    extends: cc.Component,
    properties: {

    },
    getTargetNode:function () {
        return this._targetNode;
    },

    __$init:function ( targetNode )
    {
        this._targetNode = targetNode;
        this.__hActions = [];
        this._isPaused = false;
        this._tempInvalidIds = {};
        this._invalidActionList = [];
    },
    // use this for initialization
    onLoad: function ()
    {
        this._targetNode = this.node;
    },
    addActionToTickQueue:function ( hAction )
    {
        if (!utils.isHAction(hAction))
        {
            // 必须是HAction的类或子类才可进一步操作
            throw new Error("Error, action 必须是HAction类或其子类");
        }
        this.__hActions.push( hAction );
        hAction.startWithTarget( this );
    },
    removeAction:function (action)
    {
        if (!utils.isHAction(action))
        {
            throw new Error("Error, action 必须是HAction类或其子类");
        }
        let uuid = action["$uuid"];
        let len = this.__hActions.length;
        for (let i= 0;i < len;i++)
        {
            let _action = this.__hActions[i];
            if (_action["$uuid"] === uuid)
            {
                utils.invalidActionAndNext(_action);
                this._tempInvalidIds[_action["$uuid"]] = true;
                return true;
            }else
            {
                let preAction = _action;
                let nextAction = _action.$getNextAction();
                while(nextAction)
                {
                    if (nextAction["$uuid"] === uuid )
                    {
                        preAction.$removeNextAction();
                        return true;
                    }
                    preAction = nextAction;
                    nextAction = nextAction.$getNextAction();
                }
            }
        }
        return false;
    },
    removeAllActions:function ()
    {
        let len = this.__hActions.length;
        for (let i= 0;i < len;i++)
        {
            this._tempInvalidIds[this.__hActions[i]["$uuid"]] = true;
            utils.invalidActionAndNext( this.__hActions[i] );
        }
        this.__hActions = [];
    },

    getActionByTag:function (tag) {
        let len = this.__hActions.length;
        for (let i= 0;i < len;i++)
        {
            if (this.__hActions[i].tag === tag)
            {
                return this.__hActions[i];
            }
        }
    },
    pause:function () {
        this._isPaused = false;
    },
    resume:function () {
        this._isPaused = true;
    },

    playComplete:function ( hAction )
    {
        let len = this.__hActions.length;
        for (let i= 0;i < len;i++)
        {
            if (this.__hActions[i]["$uuid"] === hAction["$uuid"])
            {
                let nexthAction = hAction.$getNextAction();
                if (nexthAction)
                {
                    // 启动单链表下个节点的Action
                    nexthAction.startWithTarget( this );
                    this.__hActions[i] = nexthAction;
                }else
                {
                    this._tempInvalidIds[hAction["$uuid"]] = true; // 标记该action要删除掉
                }
                hAction.$invalid();
                break;
            }
        }
    },
    addActionToInvalidList:function (action)
    {
        this._invalidActionList.push(action);
    },
    // called every frame
    update: function (dt)
    {
        if (this._invalidActionList.length > 0) {
            this._invalidActionList.forEach(_destroyFunc);
            this._invalidActionList = [];
        }
        let _tempInvalidIds = this._tempInvalidIds;
        let arr = this.__hActions;
        this.__hActions = arr.filter(function ( haction,index,self ) {
            if (_tempInvalidIds[haction["$uuid"]]) {
                return false;
            }
            return true;
        });
        this._tempInvalidIds = {};
        if (this._isPaused) {
            return;
        }
        this.__hActions.forEach(function (action) {
            action["_$update"](dt);
        });
    },

    onDestroy:function ()
    {
        this.removeAllActions();
        this.__hActions = null;

        this._invalidActionList.forEach(_destroyFunc);
        this._invalidActionList = null;

        this._tempInvalidIds = null;
        this._targetNode = null;
    }
});
