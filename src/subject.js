/**
 * This class is intended to be superclass for classes,
 * who want provide notifications about changes.
 * It adds private field  `_observers` for list of subscribers
 * and functions for adding and removing observers.
 * 
 * When object wants notify observers, it calls  
 * `this.notifyObservers()`  
 * with arbitrary data and each registred function 
 * will be called with this data.
 * 
 * @class
 */
class Subject {
    constructor() {
        this._observers=[];
    }

    /**
     * Call al registred function with given arguments.
     * Derived class have to call it whet it wants notify
     * all registred observers.
     * 
     * @param  {...any} data arguments for listeners
     */
    notifyObservers(...data) {
        for(let {func, obj} of this._observers) {
            func.apply(obj, data);
        }
    }

    /**
     * Registers object/function pair
     * for notification
     * 
     * @param {function} observerFunc function to call
     * @param {object} [observerThis] target object
     */
    register(observerFunc, observerThis) {
        this._observers.push({func: observerFunc, obj: observerThis});
    }

    /**
     * Unregisters  object/function pair.
     * observerFunc and observerThis have to be the same instances as
     * in `register` method.
     * 
     * @param {function} observerFunc 
     * @param {object} [observerThis]
     */
    unregister(observerFunc, observerThis) {
        let index = this._observers.findIndex( function({func, obj}) {
                return func===observerFunc && obj===observerThis;
            });
        if(index >= 0) {
            this._observers.splice(index,1);
        }
    }

    /**
     * Creates new observable property.
     * Value is stored in closure.
     * On changing value calls notifyObservers() with whole object as argument.
     * 
     * Your don't have use it for every observable property.
     * But it makes things simple.
     * 
     * @param {string} propertyName name of new property
     * @param {*} [value] initial value
     */
    createObserverableProperty(propertyName, value) {
        Object.defineProperty(this, propertyName, {
            enumerable: true,
            configurable: true,
            set: function(v) {
                value=v; // variable from closure
                this.notifyObservers(this);
            },
            get: function() {
                return value; // variable from closure
            }
        })
    }
}

/**
 * Puts methods from Subject into arbitrary object.
 * Can be useful when you can't control class definition of
 * object, you want to observe.
 * 
 * It doesn't change chain of prototypes.
 * 
 * @static
 * @param {object} obj Object to be observed.
 * @returns {object}
 */
Subject.makeObservable = function (obj) {
  obj._observers=[];
  // copy propertyes from prototype to object.
  for(key of Object.getOwnPropertyNames(Subject.prototype)) {
      obj[key] = Subject.prototype[key];
  }
  return obj;
}

module.exports = Subject;
