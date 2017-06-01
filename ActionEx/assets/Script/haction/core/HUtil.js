/**
 * ihowe@outlook.com
 * author by haroel
 * Created by howe on 2017/3/26.
 */

let moduleObj = {};

moduleObj.invalidActionAndNext = function (action)
{
    if (!action)
    {return;}
    let nextAct = action.$getNextAction();
    while(nextAct)
    {
        let act = nextAct;
        nextAct = act.$getNextAction();
        act.$invalid();
    }
    action.$invalid();
};

moduleObj.isHAction = function ( action )
{
    if(!action)
    {
        return false;
    }
    return action instanceof require("HAction");
};

moduleObj.linkAction = function( target, nextAction )
{
    if (!moduleObj.isHAction(nextAction))
    {
        throw new Error("Error, action 必须是HAction类或其子类");
    }
    target.$setNextAction(nextAction);
};

moduleObj.parallelAction = function(target , actions)
{
    let Spawn = require("HActionSpawn");
    let act = Spawn.create( actions );
    this.linkAction( target , act);
    return act;
};

module.exports = moduleObj;
