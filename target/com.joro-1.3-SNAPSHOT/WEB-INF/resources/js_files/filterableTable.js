/**
 * This is a GENERIC setup. Do NOT put implementation for specific buttons.actions in this file
 */

/**
joreto
 */

function UTSTools() {}

(function ()
{
  "use strict";
  if (UTSTools.isDefined === true)
  {
    return;
  }

  UTSTools.isDefined = true;

  UTSTools.logger = {
    level : 'DEBUG',
    debug : function ()
    {
      if (this.level === 'DEBUG')
      {
        console.debug.apply(console,arguments);
      }
    }
  };

  UTSTools.pagingCommand = {};

  /**
   * Typically /afms. This will be defined when available.
   * @type {null}
   */
  UTSTools.contextPath = null;

  /**
   * The full url before parameters.
   * @type {null}
   */
  UTSTools.contextPath = null;


  /**
   * Useful method for prepending the context path to a request mapping.
   * @param aUrl
   * @returns {*}
   */
  UTSTools.prependContextPath = function(aUrl)
  {
    if (aUrl.startsWith(UTSTools.contextPath + "/"))
    {
      return aUrl;
    }
    else if (aUrl.startsWith('/'))
    {
      return UTSTools.contextPath + aUrl;
    }
    else
    {
      return UTSTools.contextPath + "/" + aUrl;
    }
  };

  $(document).ready(function ()
  {
    var utsToolsElement = $("#utsTools");
    UTSTools.contextPath = utsToolsElement.data('contextPath');
    UTSTools.requestUri = utsToolsElement.data('requestUri');
    if (UTSTools.contextPath === "") {
      UTSTools.contextPath = "/";
    }
  });

  /**
   * parameter store for current view
   * @type {{}}
   */
  UTSTools.parameters = {};

  UTSTools.window = {
    updateAndReload: function ()
    {
      window.location.href = UTSTools.applyParameters(window.location.href);
      window.location.reload();
    },
    reload: function ()
    {
      if (UTSTools.parameters && Object.keys(UTSTools.parameters).length > 0) {
        UTSTools.window.updateAndReload();
      }
      else {
        window.location.reload();
      }
    },
    newTab: function (aUrl)
    {
      return window.open(aUrl, '_blank');
    },
    open: function (aData, aWidth, aHeight)
    {
      var urlToOpen = aData.url || aData,
          windowWidth = aData.width || aWidth || 1500,
          windowHeight = aData.height || aHeight || 900,
          winAttributes = null;

      if (aData.attributes !== undefined) {
        if (aData.attributes === null) {
          winAttributes = '';
        }
        else if (typeof aData.attributes === 'string') {
          winAttributes = !aData.attributes.trim().length ? '' : ', ' + aData.attributes;
        }
        else {
          winAttributes = '';
          Object.keys(aData.attributes).forEach(function (aName)
          {
            winAttributes += ', ' + aName + '=' + aData.attributes[aName];
          });
        }
      }
      else {
        winAttributes = ', location=no, menubar=no, status=no, toolbar=no, scrollbars=yes, resizable=yes';
      }

      var windowLeft = (screen.width - windowWidth) / 2;
      var windowTop = (screen.height - windowHeight) / 2;

      if (windowLeft < 0) {
        windowWidth = screen.width;
        windowLeft = 0;
      }
      if (windowTop < 0) {
        windowHeight = screen.height;
        windowTop = 0;
      }

      var win = window.open(urlToOpen,
          '',
          'width=' + windowWidth +
          ', height=' + windowHeight +
          ', left=' + windowLeft +
          ', top=' + windowTop +
          winAttributes);
      // FIXME css property doesn't exist -- Kev
//    win.css("overflow", "hidden");
      win.resizeTo(windowWidth, windowHeight);

      win.focus();
    }
  };


  /**
   * Sets a global parameter that can be applied to a url refresh later.
   * @see UTSTools#applyParameters()
   * @param aParam
   * @param aVal
   */
  UTSTools.setParameter = function (aParam, aVal) {
    UTSTools.parameters[aParam] = aVal;
  };

  /**
   * Will retrieve UTSTools#parameters
   * or, if aData is provided, add the UTS params to the given data
   *
   * @param aData
   * @returns {{}|*}
   */
  UTSTools.getParameters = function (aData) {
    if (aData) {
      $.each(UTSTools.parameters, function (aKey, aValue) {
        if (aData[aKey] === undefined) {
          aData[aKey] = aValue;
        }
      });
      return aData;
    }
    return UTSTools.parameters;
  };


  /**
   * A somewhat hacky method for applying stored parameters to a url
   *
   * @see UTSTools#setParameter(aParam,aVal)
   * @param aUrl (if null, it will use window.location.href)
   * @returns {*|string}
   */
  UTSTools.applyParameters = function (aUrl) {
    var search = aUrl || window.location.href;
    var result = search;
    $.each(UTSTools.getParameters(), function (aParam, aValue) {
      if (search.indexOf(aParam) > -1) {
        var regex = new RegExp("([?;&])" + aParam + "[^&;]*[;&]?");
        var query = search.replace(regex, "$1").replace(/&$/, '');

        result = (query.length > 2 ? query + "&" : "?") + (aValue ? aParam + "=" + aValue : '');

      }
      else if (search.indexOf('?') > -1) {
        result += "&" + aParam + "=" + aValue;
      } else {
        result += "?" + aParam + "=" + aValue;
      }
    });

    return result;
  };


  /**
   * Not sure what this is for but it is used by things...
   * The function will be used in all places that make an ajax call to the server this will prevent the user from
   * making successful ajax request even when the session has timed out this will. Should the users session have times out
   * the user will be taken back to the login page.
   * @param url : This is the url of the ajax request.
   * @param method: This is the method of the ajax request that you want to make 'GET', 'POST'
   * @param dataType: This is the type of the data that this request will return eg 'html', 'json'
   * @param success: This is a closure of the code that will to be run if the user is allowed to make the request
   * @param fail: This is a closure of the code that will be run if the user is unable to make the request
   * @param requestData: This is any data that needs to be sent with the request, this could be form data for eg.
   * eg Success function
   * var success = function(data) { //do something with the data that we get back from the server }
   * eg Fail function
   * var fail = function(err) { //do something to fail because the call has failed }
   * TODO Is it a security measure and should all ajax requests be going through it?
   */
  UTSTools.makeAjaxRequest = function (url, method, dataType, success, fail, requestData) {
    $.ajax({
      url: UTSTools.contextPath + '/checkAuth.htm',
      type: 'GET',
      dataType: 'text'
    }).success(function (data) {
      if (data === 'YES') {
        $.ajax({
          url: url,
          type: method,
          dataType: dataType,
          data: requestData,
          async: false
        }).success(function (data) {
          success(data);
        }).fail(function (err) {
          fail(err);
        });
      } else {
        fail();
        window.location.reload();
      }
    });
  };




  /**
   * Method for posting the pagingCommandObject without necessarily building a form.
   * This is all a bit messy, to be honest... TODO: Consider using JSONs instead of FTL and build dynamically??!
   * @param aUrl
   * @param aData
   */
  UTSTools.submitPagingCommand = function (aUrl,aData) {
    if (aData === undefined || aData === null)
    {
      aData = {};
    }
    if (aData.formSubmitted === undefined)
    {
      aData.formSubmitted = true;
    }

    $.each(UTSTools.pagingCommand,function (aName,aVal) {
      if (aData[aName] === undefined)
      {
        aData[aName] = aVal;
      }
    });
    // alert(aUrl + ': '+ JSON.stringify(aData));
    var form = new UTSForm('aPagingCommandObject',aData, aUrl, 'get');
    form.submit();
  };

  /**
   * Refreshes custom assets in config/ui-assets folder
   */
  UTSTools.refreshUiAssets = function ()
  {
    UTSModal.showSpinner({
      title: "Updating custom assets",
      action: function ()
      {
        $.ajax({
          url: UTSTools.prependContextPath("ui-assets/refresh.htm"),
          method: 'GET',
          dataType: 'JSON'
        }).success(function (aResponse)
        {
          if (aResponse === true)
          {
            UTSModal.hideSpinner("Assets updated...", function ()
            {
              UTSTools.window.reload();
            })
          }
          else
          {
            UTSModal.showError("Failed to refresh assets. See log file.");
          }
        }).fail(function (aErr)
        {
          UTSModal.showError(aErr);
        });
      }
    });
  };

})();


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


var filterableTable = "FilterableTable_from filterable.js";



function FilterableTable()
{
  "use strict";
  console.log(this);
  return this.constructor.apply(this,arguments);
  //this = {};
  //function (this) // === FilterableTable.prototype.constructor
  //return this;
}

(function ()
{
  "use strict";
  if (FilterableTable.isDefined)
  {
    return;
  }

  FilterableTable.isDefined = true;

  FilterableTable.DEFAULT_ID = 'default-filtered-table';
  FilterableTable.prototype = Object.create(UTSUniqueElement.prototype);

  FilterableTable.ALL = {};
  /**
   * @requires UTSTools
   * @requires UTSUniqueElement
   *
   * @param aId {string}
   * @returns {*}
   * @constructor
   */
  FilterableTable.prototype.constructor = function (aId)
  {
    if (aId === undefined || aId === null || aId == "") {
      aId = FilterableTable.DEFAULT_ID;
    }
    if (aId.startsWith('#')) {
      aId = aId.substr(1);
    }
    if (FilterableTable.ALL[aId]) {
      return FilterableTable.ALL[aId];
    }
    else {
      FilterableTable.ALL[aId] = this;
      this.id = aId;
      /**
       * private variable.
       */
      var mCheckedPks = [];

      var mOnSelect = function (aRow, aId)
      {
      };
      var mOnDeSelect = function (aRow, aId)
      {
      };

      this.getCheckedPks = function ()
      {
        return mCheckedPks;
      };

      this.onSelect = function (aOnSelect)
      {
        if (aOnSelect) {
          mOnSelect = aOnSelect;
        }
        else {
          return mOnSelect;
        }
      };

      this.onDeSelect = function (aOnDeSelect)
      {
        if (aOnDeSelect) {
          mOnDeSelect = aOnDeSelect;
        }
        else {
          return mOnDeSelect;
        }
      };

      var $this = this;

        $(document).ready(function ()
      {
        if ($this.loaded == false) {
          $this.container = $("#" + $this.id);
          $this.contextPath = UTSTools.contextPath;
          $this.requestUri = UTSTools.requestUri;
          $this.onLoad();
          $this.loaded = true;
        }

      });
    }
  };


  /**
   *
   * @returns {*} the request url of this page
   */
  UTSUniqueElement.prototype.getRequestUri = function () {
    return this.requestUri;
  };

  /**
   *
   * @returns {*} the request url of this page
   */
  UTSUniqueElement.prototype.getContextPath = function () {
    return this.contextPath;
  };

  /**
   *
   * @param aId {string}
   * @returns {*}
   */
  FilterableTable.getInstance = function (aId)
  {
    if (aId === undefined || aId === null || aId === "") {
      aId = FilterableTable.DEFAULT_ID;
    }
    else if (aId.startsWith('.') || aId.startsWith('#')) {
      aId = aId.substr(1);
    }
    return FilterableTable.ALL[aId] || new FilterableTable(aId);
  };

  FilterableTable.prototype.find = function (aRef)
  {
    return $(this.container).find(aRef);
  };

    FilterableTable.prototype.getData = function (aKey)
    {
      return $(this.container).data(aKey);
    };

  /**
   *
   * @returns {*} checked primary keys array
   */
  FilterableTable.prototype.getCheckedPks = null;

  /**
   * Additional operations on selecting a row
   * @param aOnSelect($(row),pk)
   */
  FilterableTable.prototype.onSelect = null;

  /**
   * Additional operations on deselecting a row
   * @param aOnDeSelect($(row),pk)
   */
  FilterableTable.prototype.onDeSelect = null;

  /**
   * True after setup.
   * @type {boolean}
   */
  FilterableTable.prototype.ready = false;

  /**
   *
   * @returns {*} the number of selected primary keys
   */
  FilterableTable.prototype.getSelectedCount = function ()
  {
    return this.getCheckedPks().size();
  };

  /**
   * Enables all toggleable buttons
   */
  function enableButtons()
  {
    this.find('.js-toggleable-button')
      .attr('disabled', false)
      .prop('disabled', false);
  }

  /**
   * Disables all toggleable buttons
   */
  function disableButtons()
  {
    this.find('.js-toggleable-button')
      .attr('disabled', true)
      .prop('disabled', true);
  }

  FilterableTable.prototype.getCommandData = function ()
  {
    return {
      recordsPerPageOption: this.find('#recordsPerPageOption').val(),
      recordsPerPage: this.find('#recordsPerPage').val(),
      recordsPerPageCopy: this.find('#recordsPerPageCopy').val(),
      pageNumber: this.find('#pageNumber').val(),
      appliedFilters: this.find('#appliedFilters').val(),
      keyDetailsExpanded: !!this.find('#keyDetailsExpanded').val(),
      searchBoxExpanded: !!this.find('#searchBoxExpanded').val(),
      sortKey: this.find('#sortKey').val() || null,
      sortDirection: this.find('#sortDirection').val() || 'desc'
    };
  };
  /**
   * Init function - called once by the constructor
   */
  FilterableTable.prototype.onLoad = function ()
  {
    var $this = this;

    if ($this.loaded == true) {
      console.warn("FilterableTable already initialized");
      return;
    }

    $this.find('#selectDeselectAccess').click(function ()
    {
      var selectAllAccess = $(this);
      var thisPk = '';
      // var idx = 0;
      // Iterates every every element with and id attribute whose value ends in '_in'
      $this.find('.checkbox').each(//("*[id$=_id]").each(
        function (i)
        {
          var cell = $(this);//.next();
          var checkbox = cell.find('.js-table-row-checkbox');
          thisPk = cell.data('pk');//row.next().val();
          var index = $this.getCheckedPks().indexOf(thisPk);
          var isSelected = index > -1;
          // console.debug("Selected " + thisPk);
          if (selectAllAccess.prop('checked') && !checkbox.hasClass('disabled')) {
            checkbox.prop('checked', true);
            if (isSelected === false) {
              $this.getCheckedPks().push(thisPk);
              $this.onSelect()(cell, thisPk);
            }
          }
          else {
            checkbox.prop('checked', false);
            if (isSelected === true) {
              $this.getCheckedPks().splice(index, 1);
              $this.onDeSelect()(cell, thisPk);
            }

          }
        });

      if ($this.find('#selectDeselectAccess').prop('checked') && $this.getCheckedPks().length) {
        enableButtons.call($this);
      }
      else {
        disableButtons.call($this);

        // reverse 'slide' effect if visible
        if ($this.find('.buttonOptions').is(':visible')) {
          $this.find('.buttonOptions').slideUp('fast');
        }
      }
    });

    $this.find('.js-table-row-checkbox').click(function ()
    {
      var thisPk = $(this).data('pk');

      if ($(this).prop('checked')) {
        enableButtons.call($this);
        $this.getCheckedPks().push(thisPk);
        $this.onSelect()($(this), thisPk);
      }
      else {
        var idx = $this.getCheckedPks().indexOf(thisPk);

        if (idx > -1) {
          $this.getCheckedPks().splice(idx, 1);
          $this.onDeSelect()($(this), thisPk);
        }

        // see if any other rows are checked: if so, then leave buttons alone
        var count = $this.find(".js-table-row-checkbox:checked").length;

        if (count == 0) {
          disableButtons.call($this);

          // reverse 'slide' effect if visible
          if ($this.find('.buttonOptions').is(':visible')) {
            $this.find('.buttonOptions').slideUp('fast');
          }
        }
      }
    });


    $this.find('form').each(function ()
    {
      $(this).append($(document.createElement('input'))
        .attr('type', 'hidden')
        .attr('id', 'containerId')
        .attr('name', 'containerId')
        .val($this.id));
    });

    if (window['JasperReportHandler'] !== undefined) {
      $this.jasperReportHandler = new JasperReportHandler($this);
    }
    else {
      console.warn("jasper report handler not loaded...")
    }

    FilterableTable.setUpListeners($this.id);

  };

  FilterableTable.TABLE_ID_LIST = [];

  FilterableTable._showDetails = [];

  FilterableTable.onShowDetails = function (aObject)
  {
    if (aObject === undefined) {
      return FilterableTable._showDetails.length > 0;
    }
    else {
      FilterableTable._showDetails.push(aObject);
    }
  };

  /**
   * Toggles the display of a nested row.
   *
   * @param aUrl path for the nested table
   * @param aParentRow table row proceeding the nested content row.
   */
  function toggleNestedRow(aUrl, aParentRow) {
    var toggleIcon = aParentRow.find('.js-nestedToggleIcon');
    var nestedContent = aParentRow.next();
    if (aParentRow.hasClass('js-nested-open'))
    {
      aParentRow.removeClass('js-nested-open');
      nestedContent.addClass('hidden');
      nestedContent.html('');
      toggleIcon.removeClass('fa-caret-down');
      toggleIcon.addClass('fa-caret-right');

    }
    else
    {
      aParentRow.addClass('js-nested-open');
      toggleIcon.addClass('fa-caret-down');
      toggleIcon.removeClass('fa-caret-right');
      nestedContent.data('url',aUrl);
      loadNestedRows(nestedContent);
    }
  }

  /**
   *
   * @param aNestedRow The table row that will contain the nested content
   */
  function loadNestedRows (aNestedRow)
  {
    var pk = aNestedRow.data('parentId');
    var rows = aNestedRow.find('.nested-show-more').data('rowsToFetch');// || 0;
    var url = UTSTools.prependContextPath(aNestedRow.data('url'));
    $.ajax({
      url: url,
      type: 'GET',
      data: {
        aParentPk : pk,
        aRowsToFetch : rows
      },
      async: true
    }).done(function (aContent)
    {
      aNestedRow.html('<td colspan="100%" class="generic-nested-content"></td>');
      aNestedRow.find('.generic-nested-content').html(aContent);
      aNestedRow.removeClass('hidden');
    });
  }

  FilterableTable.setUpListeners = function (aTableId)
  {
    console.log('Setting up table:', aTableId);
    var find;

    if (aTableId === undefined || aTableId == "" || aTableId == FilterableTable.DEFAULT_ID || aTableId == "#") {
      find = function (aRef)
      {
        return $(aRef);
      };
      aTableId = FilterableTable.DEFAULT_ID;
    }
    else {
      var $table = aTableId instanceof jQuery ? aTableId : $('#' + aTableId);
      find = function (aRef)
      {
        return $table.find(aRef);
      }
    }

    if (//!String(aTableId).startsWith('nested-') &&
    FilterableTable.TABLE_ID_LIST.indexOf(aTableId) > -1) {
      console.warn("Table listeners already setup for", aTableId);
    }
    else {
      FilterableTable.TABLE_ID_LIST.push(aTableId);

      $(document).ready(function ()
      {
        find('.js-generic-table-row').each(function ()
        {
          var $this = $(this);
          var urlWithoutContext = $(this).data('url');
          var childType = $(this).data('childType');
          if (urlWithoutContext && urlWithoutContext.startsWith("/"))
          {
            urlWithoutContext = urlWithoutContext.substr(1);
          }
          var url = UTSTools.contextPath + '/' + urlWithoutContext;
          var pk = $(this).data('pk');
          if ($this.hasClass('nested-show-more')) {
            // var rowsToShow = $this.data('rowsToShow') || 5;
            var nestedRow = $this.closest('.nested-table-content');
            $this.click(function ()
            {
              loadNestedRows(nestedRow);
            });
          }
          else if ($this.hasClass('checkbox')) {
            $this.click(function ()
            {
              console.log("CHECK!", $(this));
            });
          }
          else if ($this.hasClass('js-open-nested')) {

            var parentRow = $this.closest('tr');

            $this.unbind().click(function ()
            {
              toggleNestedRow(url, parentRow);
            });
          }
          else if ($this.hasClass("js-load-nested-content")) {
            $this.click(function ()
            {
              var row = $this.parent();
              row.siblings().removeClass('selected-row');
              row.addClass('selected-row');
              var childType = $this.data('child-type');
              var content = $this.closest('.main-tab-content').find('.detail-body');
              content.html('');

              $.ajax({
                url: UTSTools.contextPath + "/" + $this.data('url'),
                method: 'GET'
              }).done(function (aResult)
              {
                content.html(aResult);
              })
            });
          }
          else if (urlWithoutContext && urlWithoutContext != "") {
            var link = $this.find('a').size() > 0 ? $this.find('a') : $this;

            if ($this.hasClass('js-new-window')) {
              link.click(function ()
              {
                UTSTools.window.open(url);
              });
            }
            else if ($this.hasClass("js-same-window")) {
              link.click(function ()
              {
                window.location.assign(url);
              });
            }
            else if ($this.hasClass('js-openItemDetails')) {
              link.click(function ()
              {
                var childType = $(this).data('child-type');

                $('#detailsPk').val(pk);//$(this).data('pk'));
                $('#filterSearch').attr('action', UTSTools.contextPath + '/' + $(this).data('url'));

                //When choosing a top level item to view the details of, wipe any child pk information to avoid
                // confusion
                $('#childType').val('');
                $('#childDetailsPk').val('');

                searchValidateAndSubmitFilters();
              });
            }
            else if (link.hasClass('js-default-show-details') && FilterableTable.onShowDetails()) {
              link.click(function ()
              {
                // FilterableTable.onShowDetails(pk);
                for (var i in FilterableTable._showDetails) {
                  FilterableTable._showDetails[i]($this, pk, aTableId);
                }
              });
            }
            else if ($this.closest('#tabbedDetailAreaPanel').size() > 0) {
              link.click(function ()
              {
                var childDetailsPk = pk;
                var childType = $this.data('childType');
                var url = $this.data('url');
                UTSTools.submitPagingCommand(url, {
                  childDetailsPk: childDetailsPk,
                  childType: childType
                });
              });
            }
            else {
              link.click(function ()
              {
                window.location = url;
              });
            }

          }
        });
        find('.js-table-row-checkbox').attr('disabled',false).prop('disabled',false);
      });
    }
  };

  /**
   * Sets up an ajax loading filtered table. (Works a bit like a nested table)
   * @param aTableId
   */
  FilterableTable.setUpTableLoader = function (aTableId)
  {
    "use strict";
    $(document).ready(function ()
    {
      var container = $(aTableId);
      var content = container.find('.nested-table-content');
      if (container.length !== 1)
      {
        console.error("Could not find specific row for nested table: ", aTableId);
        return;
      }

      loadNestedRows(content);
    });

  };

})();


var globalVariable = "filtetrable_global";