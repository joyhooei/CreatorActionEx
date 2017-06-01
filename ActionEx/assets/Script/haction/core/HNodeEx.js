/**
 * ihowe@outlook.com
 * author by haroel
 * Created by howe on 2017/3/21.
 */

let HActionComponent = require("HActionComponent");

let NodePrototype = cc.Node.prototype;

NodePrototype.RunAction = function ( HAction )
{
    if (!this._components)
    {
        return;
    }
    let component = this.getComponent(HActionComponent);
    if (!component)
    {
        this.addComponent(HActionComponent);
        component = this.getComponent(HActionComponent);
        component.__$init( this );
    }
    component.addActionToTickQueue( HAction );
    return HAction;
};

NodePrototype.RemoveAction = function ( HAction )
{
    if (!this._components)
    {
        return;
    }
    let component = this.getComponent(HActionComponent);
    if (component)
    {
        component.removeAction(HAction);
    }
};


NodePrototype.RemoveAllActions = function () {
    if (!this._components)
    {
        return;
    }
    let component = this.getComponent(HActionComponent);
    if (component)
    {
        component.removeAllActions();
    }
};

NodePrototype.PauseActions = function () {
    if (!this._components)
    {
        return;
    }
    let component = this.getComponent(HActionComponent);
    if (component)
    {
        component.pause();
    }
};

NodePrototype.ResumeActions = function () {
    if (!this._components)
    {
        return;
    }
    let component = this.getComponent(HActionComponent);
    if (component)
    {
        component.resume();
    }
};
NodePrototype.GetActionByTag = function ( tag )
{
    if (!this._components)
    {
        return null;
    }
    let component = this.getComponent(HActionComponent);
    if (component)
    {
        return component.getActionByTag(tag);
    }
    return null;
};