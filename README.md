
##TODO:

* add angular project into flask project <- done but in a hacky way
* hook up various buttons on index page
* set up views for individual devices
* add login
* make prettier -- clean up CSS and bootstrap stuff. Arrange stuff much better. Need icons etc?
* work on data displays for each page -- nice css and icons
* figure out how all the deployment stuff works for angular apps
* uwsgi and nginx is the way to go (http://flask.pocoo.org/docs/deploying/uwsgi/) for serving
* add all scripts as cdn links
* s3 backup of mongo data
* harden and config: db location, other hard coded stuff. think about scalability?
* add sorting to table
* add text box to skip to page 'x'
* default time range and intelligent fetching of data from api
* fix page count when filtering
* organize all the elements in a better way
* styling to plot: colors, vertical lines, legend, mouse over
* colors should gradient between hot and cool (related to absolute temp) for temp plot.
* switch api to 'eve'
* add in wundergroud feed
* turn some of the transform functions into filters
* clean up code!
* testing!
* fix transform/filter to show correct data/axis/timestamp(*1000)
* make multiple plots (1 for each sensor)
* make multiple lines per plot (1 for each device)
* add some metadata tables to mongo: device details, sensor details etc.
* appears to be a bug in the time/date filtering!
* change time filters to be per 5 min or 15 min with scroll wheel
* svg needs to be removed when navigating away from historical page
* link up C/F button to plot
