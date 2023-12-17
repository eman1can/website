import React from "react";
import {Grid, Row, Col} from "react-flexbox-grid";
import Close from "../assets/close.svg";
import {Switch, Modal} from "antd";

import ModalRow from "../ModalRow";

function OptionsRow(props) {
	return (
		<Row style={props.style}>
			<Col lg={10} md={10} sm={10} xs={9} style={{textAlign: "start"}}>
				<span className="message">{props.optionText}</span>
			</Col>
			<Col lg={2} md={2} sm={2} xs={3}>
				<Switch
					checked={props.useOption}
					onChange={checked => props.setUseOption(checked)}
					disabled={props.disabled}
				/>
			</Col>
		</Row>
	);
}

function OptionsModal(props) {
	const options = props.options;
	const numSelected = [
		options.useStandardSet,
		options.useExpandedSet,
		options.useBollywoodSet,
		options.usePreBlockbusterSet
	].filter(x => x === true).length;
	return (
		<Modal
			closeIcon={<img alt="Close" src={Close} />}
			visible={props.visible}
			onCancel={props.onCancel}
			footer={null}
			centered
			width={550}
		>
			<ModalRow title="Options" />
			<Grid style={{padding: "16px 60px 32px"}}>
				<OptionsRow
					optionText="Cannot use films from a series"
					useOption={options.cannotUseSeries}
					setUseOption={options.setCannotUseSeries}
				/>
				<div style={{marginBottom: 24}} />
				<p className="modal-subtitle">- Choose For Me -</p>
				<OptionsRow
					optionText="Use default actors"
					useOption={options.useStandardSet}
					setUseOption={options.setUseStandardSet}
					disabled={options.useStandardSet && numSelected === 1}
				/>
				<OptionsRow
					style={{marginTop: 8}}
					optionText="Use expanded actors"
					useOption={options.useExpandedSet}
					setUseOption={options.setUseExpandedSet}
					disabled={options.useExpandedSet && numSelected === 1}
				/>
				<OptionsRow
					style={{marginTop: 8}}
					optionText="Use Bollywood actors"
					useOption={options.useBollywoodSet}
					setUseOption={options.setUseBollywoodSet}
					disabled={options.useBollywoodSet && numSelected === 1}
				/>
				<OptionsRow
					style={{marginTop: 8}}
					optionText="Use pre-blockbuster era actors"
					useOption={options.usePreBlockbusterSet}
					setUseOption={options.setUsePreBlockbusterSet}
					disabled={options.usePreBlockbusterSet && numSelected === 1}
				/>
			</Grid>
		</Modal>
	);
}

export default OptionsModal;
