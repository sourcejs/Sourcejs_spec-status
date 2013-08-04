/*
*
* Spec status plugin
*
* @author Robert Haritonov (http://rhr.me)
*
* */
"use strict";

define([
    'jquery',
    'modules/module',
    'modules/utils',
    'modules/sections',
    'modules/css',

    'modules/couch'
    ], function ($, module, utils, sections, Css, couch) {

    function SpecStatus() {
        var _this = this;

        var moduleCss = new Css("specStatus/css/specStatus.css");

        this.options.pluginsOptions.specStatus = $.extend(true, {
            specStatusList: {
                "dev" : {
                    "descr": "Development"
                },
                "exp" : {
                    "descr": "Experiment"
                },
                "rec" : {
                    "descr": "Recommendation"
                },
                "ready" : {
                    "descr": "Ready"
                },
                "rev" : {
                    "descr": "Ready fo review"
                }
            },
            sectionStatusList: {
                "dev" : {
                    "descr": "Not ready for implementation"
                },
                "exp" : {
                    "descr": "Inner experiment, not for production"
                },
                "rev" : {
                    "descr": "Ready for review"
                },
                "rec" : {
                    "descr": "Ready for standard implementation"
                }
            },

            enabledCatalogs: [],
            customSpecStatus: {},

            remoteType: "spec",
            remoteStatusField: "specStatus",

            specStatusByDef: "dev",

            STATUS_CONTROLS_CLASS: "source_status-controls",
                STATUS_CONTROLS_DESCR_CLASS: "source_status-controls_descr",
                STATUS_CONTROLS_CHANGE_CLASS: "source_status-controls_change",

            STATUS_LIST_CLASS: "source_status-list",
                STATUS_LIST_LI_CLASS: "source_status-list_li",
                STATUS_LIST_A_CLASS: "source_status-list_a",

            BADGE_CLASS: "source_status_badge",
            BADGE_BIG_CLASS: "source_status_badge-big",
            STATUS_ROOT_CLASS: "status",
            SPEC_INFO_CONT: "source_info",

            RES_ALERT_FILL_INFO: "TODO: Please add spec info."

        }, this.options.pluginsOptions.specStatus);

        $(function(){
            _this.init();
        });
    }

    SpecStatus.prototype = module.createInstance();
    SpecStatus.prototype.constructor = SpecStatus;

    SpecStatus.prototype.init = function () {
        this.initSectionsStatus();

        this.initSpecStatus();
    };

    /*

        Common

     */

    //Can get as a parametr one or many classes
    SpecStatus.prototype.getStatusFromClasses = function (classes) {
        var statusClasses = classes,
            statusClassesArr = statusClasses.split(" "),
            ROOT_CLASS = this.options.pluginsOptions.specStatus.STATUS_ROOT_CLASS,

            sectionStatus;

        if (statusClassesArr.length > 1) {

            for (var i=0; i < statusClassesArr.length; i++) {
                var splittedMod = statusClassesArr[i].split('-');

                //check if we got right modification
                if (splittedMod[0] === ROOT_CLASS) {
                    sectionStatus = splittedMod[1];
                }
            }

        } else {
            var checkStatusClass = statusClasses.split('-');

            if (checkStatusClass.length === 1) {
                sectionStatus = checkStatusClass[0];
            } else {
                sectionStatus = checkStatusClass[1];
            }
        }

        return sectionStatus;
    };

    SpecStatus.prototype.getStatusClasses = function () {
        var statusList = this.options.pluginsOptions.specStatus.sectionStatusList,
            ROOT_CLASS = this.options.pluginsOptions.specStatus.STATUS_ROOT_CLASS,

            statusClasses = [],
            i = 0;

        for (var status in statusList) {
            statusClasses[i] = ROOT_CLASS + '-' + status;

            i++;
        }

        return statusClasses;
    };

    //drawStatusBadge(status, statusList [, badgeClass])
    SpecStatus.prototype.drawStatusBadge = function (status, statusList, badgeClass) {
        var _this = this,
            statusClass = status, //could be one class or many
            possibleStatuses = statusList,
            BADGE_CLASS;

        if (typeof badgeClass === 'undefined') {
            BADGE_CLASS = _this.options.pluginsOptions.specStatus.BADGE_CLASS;
        } else {
            BADGE_CLASS = badgeClass;
        }

        var sectionStatus = _this.getStatusFromClasses(statusClass),
            statusDescr = '';

        if ( typeof possibleStatuses[sectionStatus] !== 'undefined' ) {
            statusDescr = possibleStatuses[sectionStatus].descr;
        }

        return '<div ' +
                   'class="'+ BADGE_CLASS +'  __'+ sectionStatus +'" title="'+statusDescr+'">' +
                    statusDescr +
               '</div>';
    };

    /*

        Spec statuses

     */

    SpecStatus.prototype.initSpecStatus = function () {
        var _this = this,
            INFO_CLASS = _this.options.pluginsOptions.specStatus.SPEC_INFO_CONT,
            ROOT_CLASS = _this.options.pluginsOptions.specStatus.STATUS_ROOT_CLASS,

            statusField = _this.options.pluginsOptions.specStatus.remoteStatusField;

        _this.turnOnSpecStatus();

        //Is spec status enabled || Check if initial status mod is set
        if ($('.'+INFO_CLASS).hasClass(ROOT_CLASS)) {
            _this.customSpecStatus();

            var specPath = utils.getPathToPage(),

                statusByDefault = _this.options.pluginsOptions.specStatus.specStatusByDef,
                dbName = _this.options.pluginsOptions.specStatus.remoteType;

            var startingRemoteObj = {};
            startingRemoteObj[statusField] = statusByDefault;

            //Return current page remote storage object
            $.when( couch.prepareRemote(dbName,startingRemoteObj,specPath) ).then(
                function(data) {

                    var remoteInfo = data;

                    _this.drawSpecStatus(remoteInfo);
                    _this.drawSpecStatusControls(remoteInfo);

                }
            );

        }

    };

    SpecStatus.prototype.turnOnSpecStatus = function () {
        var enabledCatalogs = this.options.pluginsOptions.specStatus.enabledCatalogs,
            ROOT_CLASS = this.options.pluginsOptions.specStatus.STATUS_ROOT_CLASS,
            INFO_CLASS = this.options.pluginsOptions.specStatus.SPEC_INFO_CONT,

            RES_ALERT_FILL_INFO = this.options.pluginsOptions.specStatus.RES_ALERT_FILL_INFO,

            SECTION_CLASS = this.options.SECTION_CLASS,

            result = false;

        //This class enables spec status activation
        var turnOn = function() {

            if($('.'+INFO_CLASS).length === 0) {
                $('.'+SECTION_CLASS).first().before('' +
                    '<div class="'+INFO_CLASS+'">'+RES_ALERT_FILL_INFO+'</div>'
                )
            }

            //By adding root class to first spec info container
            $('.'+INFO_CLASS).first().addClass(ROOT_CLASS);
        };

        //TODO: make real nested category check
        var checkCatalog = function(pagePath){
            var preparePagePath = pagePath.split('/');

            //Parse page calalogs, except page name
            for (var i=0; i < preparePagePath.length - 1; i++) {
                var targetObj = preparePagePath[i];

                //Compare page catalogs with enabled
                for(var y=0; y < enabledCatalogs.length; y++ ) {
                    if (targetObj === enabledCatalogs[y]) {
                        result = true;
                    }
                }
            }

            return result;
        };

        //All pages enabled by default
        if (enabledCatalogs.length === 0) {
            turnOn();
        } else {
            var pathToPage = utils.getPathToPage();

            if (checkCatalog(pathToPage)) {
                turnOn();
            }
        }

    };

    //customSpecStatus([context]);
    SpecStatus.prototype.customSpecStatus = function (context) {
        var _this = this,
            customSpecStatus = _this.options.pluginsOptions.specStatus.customSpecStatus;

        //If there are custom settings
        if (customSpecStatus !== {}) {

            var overrideDone = false;

            var overrideOptions = function(newOptions){
                overrideDone = true;

                var newOptions = customSpecStatus[newOptions];

                _this.options.pluginsOptions.specStatus.specStatusList = newOptions;
            };

            if (typeof context === 'string') {

                overrideOptions(context);

            } else {
                var pathToPage = utils.getPathToPage(),

                    preparePagePath = pathToPage.split('/');

                //Parse page catalogs, except page name
                for (var i=0; i < preparePagePath.length - 1; i++) {
                    if (overrideDone) { break; }

                    var targetObj = preparePagePath[i];

                    //Compare page catalogs with enabled
                    for(var spec in customSpecStatus) {
                        if (targetObj === spec) {
                            overrideOptions(targetObj);

                            break;
                        }
                    }
                }
            }
        }
    };

    SpecStatus.prototype.drawSpecStatus = function (remoteInfo) {
        var _this = this,
            specRemoteInfo = remoteInfo,

            ROOT_CLASS = this.options.pluginsOptions.specStatus.STATUS_ROOT_CLASS,
            CONTROLS_CLASS = _this.options.pluginsOptions.specStatus.STATUS_CONTROLS_CLASS,
            BADGE_CLASS = _this.options.pluginsOptions.specStatus.BADGE_BIG_CLASS,

            INFO_CLASS = this.options.pluginsOptions.specStatus.SPEC_INFO_CONT,
            L_STATUS_PARENT = $('.'+INFO_CLASS+'.'+ROOT_CLASS),

            statusDecoration;

        statusDecoration = (function(){
            var statusField = _this.options.pluginsOptions.specStatus.remoteStatusField,
                sectionStatus = specRemoteInfo[statusField],
                specStatusList = _this.options.pluginsOptions.specStatus.specStatusList;

            return _this.drawStatusBadge(sectionStatus, specStatusList, BADGE_CLASS);
        })

        //If badge is already there
        if ($('.'+BADGE_CLASS).length === 0) {
            //Draw controls conrainer
            L_STATUS_PARENT.prepend('<div class="'+CONTROLS_CLASS+'"></div>');

            //Draw badge
            $('.'+CONTROLS_CLASS).append(statusDecoration);
        } else {
            //Redraw existing
            $('.'+BADGE_CLASS).replaceWith(statusDecoration);
        }
    };

    SpecStatus.prototype.drawSpecStatusControls = function (remoteInfo) {
        var _this = this,
            specRemoteInfo = remoteInfo,

            statusField = _this.options.pluginsOptions.specStatus.remoteStatusField,

            CONTROLS_CLASS = _this.options.pluginsOptions.specStatus.STATUS_CONTROLS_CLASS,
                CONTROLS_CHANGE_CLASS = _this.options.pluginsOptions.specStatus.STATUS_CONTROLS_CHANGE_CLASS,

            LIST_CLASS = _this.options.pluginsOptions.specStatus.STATUS_LIST_CLASS,
                LIST_LI_CLASS = _this.options.pluginsOptions.specStatus.STATUS_LIST_LI_CLASS,
                LIST_A_CLASS = _this.options.pluginsOptions.specStatus.STATUS_LIST_A_CLASS,

            L_INFO_CLASS = $('.'+this.options.pluginsOptions.specStatus.SPEC_INFO_CONT),
            controlsList;

        controlsList = (function(){
            var htmlOut = '',
                specStatusList = _this.options.pluginsOptions.specStatus.specStatusList;

            htmlOut += '<div class="'+CONTROLS_CHANGE_CLASS+'"><ul class="'+LIST_CLASS+'">';

            for (var status in specStatusList) {
                var statusBadge = _this.drawStatusBadge(status, specStatusList);

                htmlOut += '<li class="'+LIST_LI_CLASS+'"><a href="#777" class="'+LIST_A_CLASS+'" data-status-set="'+status+'">'+ statusBadge + '</a></li>';
            }

            htmlOut += '</ul></div>';

            return htmlOut;
        });

        L_INFO_CLASS.on('click', '.'+LIST_A_CLASS, function(e){
            e.preventDefault();

            var t = $(this),
                setStatus = t.attr('data-status-set');

            var toUpdateData = {};
            toUpdateData[statusField] = setStatus;

            _this.updateSpecStatus(specRemoteInfo, toUpdateData);

        });

        $('.'+CONTROLS_CLASS).append(controlsList);
    };

    SpecStatus.prototype.updateSpecStatus = function (actualData, dataToUpdate, handler) {
        var _this = this,
            dbName = this.options.pluginsOptions.specStatus.remoteType,
            storedData = actualData,
            updateData = dataToUpdate;

        //Sendind already stored data + data for update on server
        $.when( couch.updateRemote(dbName, storedData, updateData) ).then(
            function(data) {

                var updatedObject = data;

                _this.drawSpecStatus(updatedObject);

                if (typeof handler === 'function') {
                    handler();
                }

            }
        );

    };

    /*

        Spec section statuses

     */

    SpecStatus.prototype.initSectionsStatus = function () {
        var _this = this,
            statusClasses = _this.getStatusClasses(); //Arr

        //Section must have .status-[status] class to init
        for (var section in sections.sections) {
            var targetSection = sections.sections[section],
                sectionElement = targetSection.sectionElement,
                headerElement = targetSection.headerElement;

            if (utils.hasClasses(sectionElement, statusClasses)) {
                _this.drawSectionStatus(sectionElement, headerElement);
            }

            //Sub headers
            for (var i = 0; i <  targetSection.subHeaderElements.length; i++) {
                var targetSubHeader = targetSection.subHeaderElements[i];

                if (targetSubHeader.attr('class') !== 'undefined' && utils.hasClasses(targetSubHeader, statusClasses)) {
                    _this.drawSectionStatus(targetSubHeader, targetSubHeader);
                }
            }

        }
    };

    SpecStatus.prototype.drawSectionStatus = function (element, headerElement) {
        var targetElement = element,
            sectionClasses = targetElement.attr('class'),

            sectionStatusList = this.options.pluginsOptions.specStatus.sectionStatusList,

            header = headerElement,

            statusDecoration;

        statusDecoration = this.drawStatusBadge(sectionClasses, sectionStatusList);

        header.append(statusDecoration);
    };

    return new SpecStatus();

});