


function UTSUniqueElement()
{
  return this.constructor.apply(this,arguments);
}

(function ()
{
  "use strict";
  if (UTSUniqueElement.isDefined)
  {
      return;
  }
  UTSUniqueElement.isDefined = true;
    /**
     * Created by bilbowm on 02/08/2016.
     */

    /**
     * Abstract class for creating and controlling multiple unique elements on a page.
     *      e.g. Wizards, tables, forms, etc...
     * It prevents objects being created more than once by creating a unique id.
     *
     * @requires UTSTools.js
     *
     * @param aId
     * @param aSuppressError
     * @returns {UTSUniqueElement} this object or it's earlier initialization
     * @constructor
     */
    UTSUniqueElement.prototype.constructor = function (aId) {
        if (aId instanceof jQuery)
        {
            this.container = aId;
            aId = this.container.attr('id');
        }
        else {
            aId = String(aId);
            if (aId.startsWith('#')) {
                this.id = aId.substr(1);
            } else {
                this.id = aId;
                aId = '#' + aId;
            }
        }
        if (registerUniqueID.call(this)) {
            var $this = this;
            $(document).ready(function () {
                if ($this.loaded == false) {
                    $this.container = $(aId);
                    if ($this.hasHtmlElement() === false)
                    {
                        $this.container = $this.createHtmlElement();
                    }
                    $this.contextPath = UTSTools.contextPath;
                    $this.requestUri = UTSTools.requestUri;
                    $this.onLoad();
                    $this.loaded = true;
                }

            });
            return this;
        }
        else {//if (aSuppressError) {
            console.warn(this.uniqueID + " already exists. Error suppressed (returning singleton?)");
            return this.getOriginal();
        }
    };

    UTSUniqueElement.prototype.createHtmlElement = function ()
    {
        return null;//$('#'+this.id);
    };

    UTSUniqueElement.prototype.hasHtmlElement = function ()
    {
        return this.container && $(this.container).length > 0;
    };

    /**
     * Should be returned by overriding constructors if the element was not unique.
     * @returns {*} the original unique element.
     */
    UTSUniqueElement.prototype.getOriginal = function () {
        return UTSUniqueElement.ALL[this.uniqueID];
    };

    function registerUniqueID () {
        this.uniqueID = this.getClass() + '#' + this.id;
        if (UTSUniqueElement.ALL_IDS.indexOf(this.uniqueID) > -1) {
            var $this = UTSUniqueElement.ALL[this.uniqueID];
            this.getOriginal = function () {
                return $this;
            };
            return false;
        }
        else {
            UTSUniqueElement.ALL_IDS.push(this.uniqueID);
            UTSUniqueElement.ALL[this.uniqueID] = this;
            console.log("REGISTERING UNIQUE", this.uniqueID);
            return true;
        }
    }

    UTSUniqueElement.prototype.getClass = function () {
        return this.constructor.name;//toString().match(/function\s*(\w+)/);
    };

    UTSUniqueElement.ALL_IDS = [];

    UTSUniqueElement.ALL = {};

    UTSUniqueElement.prototype.loaded = false;

    UTSUniqueElement.prototype.id = null;

    UTSUniqueElement.prototype.uniqueID = null;

    /**
     * Html element containing all relevant child elements
     * @type {null}
     */
    UTSUniqueElement.prototype.container = null;

    /**
     * On Document Ready. Only called once per unique element
     */
    UTSUniqueElement.prototype.onLoad = function () {
    };

    UTSUniqueElement.prototype.find = function (aRef) {
        return $(this.container).find(aRef);
    };

    UTSUniqueElement.prototype.getData = function (aKey)
    {
      return $(this.container).data(aKey);
    };

})();
