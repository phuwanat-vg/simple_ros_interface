import React, { Component } from 'react';
import { Row, Col, Button, Container } from "react-bootstrap";
import Config from "../scripts/config";
import * as Three from "three";

class RobotState extends Component {
    state = {
        x: 0,
        y: 0,
        orientation: 0,
        linear_velocity: 0,
        angular_velocity: 0,
        ros: null,

    }

    constructor() {
        super();
        this.init_connection();
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

    componentDidMount() {
        this.getRobotState();
    }

    getRobotState() {
        var pose_subscriber = new window.ROSLIB.Topic(
            {
                ros: this.state.ros,
                name: Config.ODOM_TOPIC,
                messageType: "nav_msgs/Odometry",

            }
        );

        pose_subscriber.subscribe((message) => {
            this.setState({ x: message.pose.pose.position.x.toFixed(2) });
            this.setState({ y: message.pose.pose.position.y.toFixed(2) });
            this.setState({
                orientation: this.getOrientationFromQuaternion(message.pose.pose.orientation).toFixed(2),
            });
            this.setState({linear_velocity: message.twist.twist.linear.x.toFixed(2)});
            this.setState({angular_velocity: message.twist.twist.angular.z.toFixed(2)});
        });
    }

    getOrientationFromQuaternion(ros_orientation_quaternion) {
        var q = new Three.Quaternion(
            ros_orientation_quaternion.x,
            ros_orientation_quaternion.y,
            ros_orientation_quaternion.z,
            ros_orientation_quaternion.w,
        );
        var RPY = new Three.Euler().setFromQuaternion(q);

        return RPY["_z"] * (180 / Math.PI);
    }

    render() {
        return (

            <div>
                <Row>
                    <Col>
                        <h4 className='mt-4'>Position</h4>
                        <p className='mt-0'>x: {this.state.x}</p>
                        <p className='mt-0'>y: {this.state.y}</p>
                        <p className='mt-0'>Orientation: {this.state.orientation}</p>
                    </Col>

                    <Col>
                        <h4 className='mt-4'>Velocities</h4>
                        <p className='mt-0'>Linear Velocity: {this.state.linear_velocity}</p>
                        <p className='mt-0'>Angular Velocity: {this.state.angular_velocity}</p>

                    </Col>
                </Row>




            </div>

        );
    }

}

export default RobotState; 