import { render } from '@testing-library/react';
import React, { Component } from 'react'; 

export const dateFormatter = (rawDate) => {
    var year = rawDate.match(/\d{4}/);
    var monthNum = rawDate.match(/(?<=-)\d{2}(?=-)/);
    var month;
    if (monthNum == "01"){ month = "Jan"} else
    if (monthNum == "02"){ month = "Feb"} else
    if (monthNum == "03"){ month = "March"} else
    if (monthNum == "04"){ month = "April"} else
    if (monthNum == "05"){ month = "May"} else
    if (monthNum == "06"){ month = "June"} else
    if (monthNum == "07"){ month = "July"} else
    if (monthNum == "08"){ month = "Aug"} else
    if (monthNum == "09"){ month = "Sept"} else
    if (monthNum == "10"){ month = "Oct"} else
    if (monthNum == "11"){ month = "Nov"} else
    if (monthNum == "12"){ month = "Dec"};

    const fullDay = rawDate.match(/\d{2}$/);
    const day = String(fullDay).match(/^\d/) == "0" ? String(fullDay).match(/\d$/) : String(fullDay).match(/^\d{2}/);
    return month + " " + day + ", " + year;
};

export const yearFinder = (rawDate) => {
    const year = rawDate.match(/\d{4}/);
    return year; 
}

export const dateForCompareFormatter = (rawDate) => {
    const year = rawDate.match(/^\d{4}/);
    const month = rawDate.match(/(?<=-)\d{2}(?=-)/);
    const day = rawDate.match(/\d{2}$/)
    return year+","+month+","+day;
}