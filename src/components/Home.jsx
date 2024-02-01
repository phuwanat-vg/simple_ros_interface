import React, { Component } from 'react'
//import { Button } from 'react-bootstrap'
import Connection from './Connection'
import Teleoperation from './Teleoperation'
import RobotState from './RobotState'
import Map from './Map'
import {Row, Col, Container, Button} from "react-bootstrap"


class Home extends Component {
    state = {}

    render() {
        return (
            <div>
                <Container>
                <h1 className="text-center">Robot Control Page</h1>
                <Row>
                    <Col><Connection/></Col>
                </Row>
                <Row>
                    
                    <Col>
                    <Map/>
                    
                    </Col>
                    
                    <Col>
                    <RobotState></RobotState>
                    <Teleoperation></Teleoperation>
                    </Col>
                </Row>
                
                </Container>
            </div>
        );
    }

}

export default Home; 