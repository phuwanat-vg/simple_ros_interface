import React, { Component } from "react";
import Config from "../scripts/config";

class Map extends Component {
  state = {
    ros: null,
  };

  constructor() {
    super();

    this.view_map = this.view_map.bind(this);
  }

  init_connection() {
    //this.setState({ ros: new ROSLIB.Ros() });
    this.state.ros = new window.ROSLIB.Ros();
    console.log("Map:" + this.state.ros);
    
    try {
      this.state.ros.connect(
        "ws://" +
          Config.ROSBRIDGE_SERVER_IP +
          ":" +
          Config.ROSBRIDGE_SERVER_PORT +
          ""
      );
    } catch (error) {
      console.log(
        "ws://" +
          Config.ROSBRIDGE_SERVER_IP +
          ":" +
          Config.ROSBRIDGE_SERVER_PORT +
          ""
      );
      console.log("cannot connect to the WS robot. Try again after 1 second");
    }
  }


  componentDidMount() {
    this.init_connection();
    console.log("Map: componentDidMount" + this.state.ros);
    this.view_map();
  }

  view_map() {
    var viewer = new window.ROS2D.Viewer({
      divID: "map_show",
      width: 500,
      height: 500,
    });
    var navClient = new window.ROS2D.OccupancyGridClient({
      ros: this.state.ros,
      rootObject: viewer.scene,
      continuous: true,
      

    });

    navClient.on('change', function() {
      viewer.scaleToDimensions(navClient.currentGrid.width, navClient.currentGrid.height);
      viewer.shift(navClient.currentGrid.pose.position.x, navClient.currentGrid.pose.position.y);
    });

  }


  render() {
    return (
      <div>
     <div id="map_show"></div>
     </div>
    );
  }
}

export default Map;