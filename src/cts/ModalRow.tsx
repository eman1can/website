import React from "react";
import {Col, Row} from "antd";

type ModalRowProps = {
    paddingTop?: number,
    paddingHorizontal?: number,
    paddingBottom?: number,
    prefix?: React.JSX.Element,
    title?: string,
    heading?: string,
    maxWidth?: number,
    body?: string
};

function ModalRow(props: ModalRowProps) {
    const padding = `${props.paddingTop || 0}px ${props.paddingHorizontal || 80}px ${props.paddingBottom || 24}px`;
    return (
        <Col style={{padding: padding}}>
            {props.prefix && (
                <Row style={{justifyContent: "center", marginBottom: 16}}>
                    {props.prefix}
                </Row>
            )}
            {props.title && (
                <Row style={{justifyContent: "center"}}>
                    <p className="modal-title">{props.title}</p>
                </Row>
            )}
            {props.heading && (
                <Row
                    style={{
                        justifyContent: "center",
                        maxWidth: props.maxWidth || "none",
                        margin: "0 auto"
                    }}
                >
                    <p className="modal-heading">{props.heading}</p>
                </Row>
            )}
            {props.body && (
                <Row style={{justifyContent: "center", marginBottom: 4}}>
                    <p className="modal-body">{props.body}</p>
                </Row>
            )}
        </Col>
    );
}

export default ModalRow;
