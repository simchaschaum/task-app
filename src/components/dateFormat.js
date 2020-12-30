import { render } from '@testing-library/react';
import React, { Component } from 'react'; 

export const dateFormatter = (rawDate) => {
    var year = rawDate.match(/\d{4}/);
    var monthNum = rawDate.match(/\-\d{2}\-/);
    var month;
    switch(monthNum){
        case "-01-":
            month = "Jan";
            break;
        case "-02-":
            month = "Jan";
            break;
        case "-03-":
            month = "Jan";
            break;
        case "-04-":
            month = "Jan";
            break;
        case "-05-":
            break;
            month = "Jan";
        case "-06-":
            month = "Jan";
            break;
        case "-07-":
            month = "Jan";
            break;
        case "-08-":
            month = "Jan";
            break;
        case "-09-":
            month = "Jan";
            break;
        case "-10-":
            month = "Oct";
            break;
        case "-11-":
            month = "Nov"
            break;
        default:
            month = "Dec";
            break;
    }
    const fullDay = rawDate.match(/\d{2}$/);
    const day = String(fullDay).match(/^\d/) == "0" ? String(fullDay).match(/\d$/) : String(fullDay).match(/^\d{2}/);
    return month + " " + day + ", " + year;
}