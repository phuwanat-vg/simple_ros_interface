import React, { Component } from 'react'
import { Container } from "react-bootstrap" 
import { Joystick } from 'react-joystick-component';
import Config from "../scripts/config"

class Teleoperation extends Component {
    
    state = {ros : null};

    constructor() {
        super();
        this.init_connection();
        this.handleMove = this.handleMove.bind(this);
        this.handleStop = this.handleStop.bind(this);
    }
    
    init_connection() {
        this.state.ros = new window.ROSLIB.Ros();
        console.log(this.state.ros);

        this.state.ros.on("connection", () => {
            console.log("connection established! in Teleoperation Component");
            console.log(this.state.ros);
            this.setState({ connected: true });
        });

        this.state.ros.on("close", () => {
            console.log("connection closed!");
            this.setState({ connected: false });

            //try to reconenct every 3 seconds

            setTimeout(() => {
                try {
                    this.state.ros.connect(
                        "ws://" +
                        Config.ROSBRIDGE_SERVER_IP +
                        ":" +
                        Config.ROSBRIDGE_SERVER_PORT +
                        ""
                    );
                }
                catch (error) {
                    console.log('Connection problem:');
                }
            }, Config.RECONNECTION_TIMER);
        });

        // Add error event listener
        this.state.ros.on('error', (error) => {
            console.log("connection problem");
        });

        try {
            this.state.ros.connect(
                "ws://" +
                Config.ROSBRIDGE_SERVER_IP +
                ":" +
                Config.ROSBRIDGE_SERVER_PORT +
                ""
            );
        }
        catch (error) {
            console.log('Connection problem:');
        }


    }

    handleMove(event)
    {
        console.log("handle move")
        //Need to create ROS publisher
        var cmd_vel = new window.ROSLIB.Topic(
            {
               ros: this.state.ros, 
               name: Config.CMD_VEL_TOPIC,
               messageType: "geometry_msgs/Twist",

            }
        );
        //Create Twist message + Publish to ROS

        var twist = new window.ROSLIB.Message
        (
            {
                linear: 
                {
                    x: event.y,
                    y: 0.0,
                    z: 0.0,
                },
                angular: 
                {
                    x: 0.0,
                    y: 0.0,
                    z: -event.x ,
                },
            }
        );

        cmd_vel.publish(twist)
    }

    handleStop(event)
    {
        console.log("handle stop")
        var cmd_vel = new window.ROSLIB.Topic(
            {
               ros: this.state.ros, 
               name: Config.CMD_VEL_TOPIC,
               messageType: "geometry_msgs/Twist",

            }
        );
        //Create Twist message + Publish to ROS

        var twist = new window.ROSLIB.Message
        (
            {
                linear: 
                {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0,
                },
                angular: 
                {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0 ,
                },
            }
        );

        cmd_vel.publish(twist)
    }

    render()
    {
        return (
            <div>
                <Joystick size={300}
                    sticky={false}
                    baseColor="white"
                    stickColor="blue"
                    move={this.handleMove}
                    stop={this.handleStop}>

                </Joystick>
            </div>
        ) ;
    }

}

export default Teleoperation; 