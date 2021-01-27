import { render } from '@testing-library/react';
import React, { Component } from 'react'; 

/*
1) On tasks - have 'select' option  [future: also mark done and delete]
2) Take selected apps, create new array for today
3) Include for today's schedule:
- EITHER order OR time
- mark as done for today - separate from fully done - or fully done (make it clear)
- The date for the schedule 
- Save multiple schedules 
- On side-menue (header), have 'show schedules' and popup list of schedules.  
- on <Schedule /> component, load <Task /> (similar to in app.js), but also have other items like time, etc.  
- PROCESS: select --> click 'add' to list --> pop up with items in list; set date and put times in.  OK --> sets date, puts them in order, saves it, presents it.  
*/

