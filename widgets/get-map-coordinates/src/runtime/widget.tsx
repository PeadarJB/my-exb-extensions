// These lines are like telling your widget what tools and blueprints it needs from other places.
import { React, type AllWidgetProps } from 'jimu-core';          // Gets basic React tools and info about your widget.
import { JimuMapViewComponent, type JimuMapView } from 'jimu-arcgis'; // Gets tools to show/use a map.
import type Point from 'esri/geometry/Point';                     // Gets a blueprint for what a map "Point" (like a dot on the map) looks like.

// This line just makes it easier to use a specific React tool called "useState".
const { useState } = React;

// This is the main blueprint for your widget.
// "props" is like a box of information given to your widget when it's created.
const Widget = (props: AllWidgetProps<any>) => {
  // These lines create two "sticky notes" for your widget to remember things.
  // These things can change while the widget is running.
  // "latitude" will remember the latitude, "setLatitude" is the function to update it. Starts empty.
  const [latitude, setLatitude] = useState<string>('');
  // "longitude" will remember the longitude, "setLongitude" is the function to update it. Starts empty.
  const [longitude, setLongitude] = useState<string>('');

  // This is a helper instruction set (a function) that runs when the map your widget is connected to becomes ready or changes.
  // "jmv" here represents the actual map view that your widget is looking at.
  const activeViewChangeHandler = (jmv: JimuMapView) => {
    // Only do something if there actually IS a map view ready.
    if (jmv) {
      // This is like saying: "Hey map view (jmv.view), every time the mouse pointer moves over you..."
      jmv.view.on('pointer-move', (evt) => {
        // "...take the screen position (x, y) of the mouse pointer (evt.x, evt.y)..."
        // "...and convert it into real map coordinates (a Point on the map)."
        const point: Point = jmv.view.toMap({
          x: evt.x,
          y: evt.y
        });
        // Now that we have the map point:
        // Update the "latitude" sticky note with the point's latitude (rounded to 3 decimal places).
        setLatitude(point.latitude.toFixed(3));
        // Update the "longitude" sticky note with the point's longitude (rounded to 3 decimal places).
        setLongitude(point.longitude.toFixed(3));
      });
    }
  };

  // This is what your widget actually shows on the screen (its HTML structure).
  return (
    <div className="widget-starter jimu-widget">
      {/* This part checks: "Did the author select exactly one Map Widget in the settings?" */}
      {/* If yes, then show the JimuMapViewComponent. */}
      {props.useMapWidgetIds && props.useMapWidgetIds.length === 1 && (
        // This is a special component from Esri that handles showing the map chosen in the settings.
        // "useMapWidgetId" tells it WHICH map to show (the first one selected).
        // "onActiveViewChange" tells it: "When the map view is ready, run my 'activeViewChangeHandler' instructions."
        <JimuMapViewComponent
          useMapWidgetId={props.useMapWidgetIds?.[0]}
          onActiveViewChange={activeViewChangeHandler}
        />
      )}
      {/* This is a paragraph that will display the latitude and longitude. */}
      {/* It reads the values from your "latitude" and "longitude" sticky notes. */}
      {/* So, when those sticky notes get updated by the mouse moving, this text will also update automatically! */}
      <p>
        Lat/Lon: {latitude} {longitude}
      </p>
    </div>
  );
};

// This makes your Widget blueprint available for Experience Builder to use.
export default Widget;