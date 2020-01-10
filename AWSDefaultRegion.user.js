// ==UserScript==
// @name         AWSDefaultRegion
// @namespace    aws.amazon.com
// @description  This script changes AWS Region to the
// @include      https://*.aws.amazon.com/*
// @match        https://*.aws.amazon.com/*
// @exclude      *console.chime.aws.amazon.com/*
// @exclude      *quicksight.aws.amazon.com/*
// @grant        GM_getValue
// @grant        GM.getValue
// @grant        GM_setValue
// @grant        GM.setValue
// @grant        GM_deleteValue
// @grant        GM.deleteValue
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlhttpRequest
// @connect *
// ==/UserScript==

// Modify the region required.
var regionRequired = "ca-central-1";

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

function getUrlParam(parameter, defaultvalue){
    var urlparameter = defaultvalue;
    if(window.location.href.indexOf(parameter) > -1){
        urlparameter = getUrlVars()[parameter];
    }
    return urlparameter;
}

function updateURLParameter(url, param, paramVal)
{
    var TheAnchor = null;
    var newAdditionalURL = "";
    var tempArray = url.split("?");
    var baseURL = tempArray[0];
    var additionalURL = tempArray[1];
    var temp = "";

    if (additionalURL)
    {
        var tmpAnchor = additionalURL.split("#");
        var TheParams = tmpAnchor[0];
        TheAnchor = tmpAnchor[1];
        if(TheAnchor)
            additionalURL = TheParams;

        tempArray = additionalURL.split("&");

        for (var i=0; i<tempArray.length; i++)
        {
            if(tempArray[i].split('=')[0] != param)
            {
                newAdditionalURL += temp + tempArray[i];
                temp = "&";
            }
        }
    }
    else
    {
        var tmpAnchor = baseURL.split("#");
        var TheParams = tmpAnchor[0];
        TheAnchor  = tmpAnchor[1];

        if(TheParams)
            baseURL = TheParams;
    }

    if(TheAnchor)
        paramVal += "#" + TheAnchor;

    var rows_txt = temp + "" + param + "=" + paramVal;
    return baseURL + "?" + newAdditionalURL + rows_txt;
}

var existingRegion = getUrlParam('region','Empty');

if (regionRequired !== existingRegion)
{
    window.history.replaceState('', '', updateURLParameter(window.location.href, "region", regionRequired));
    if( window.localStorage ){
        if(!localStorage.getItem('firstReLoad')){
            localStorage['firstReLoad'] = true;
            window.location.reload();
        } else {
            localStorage.removeItem('firstReLoad');
        }
    }
}
var elem = document.getElementById("nav-regionMenu");
elem.parentNode.removeChild(elem);
