import React, {useState} from "react";
import {ArrowLeftOutlined} from "@ant-design/icons";
import {Button, Popover} from "antd";
import {Row} from "react-flexbox-grid";

function BackButton(props) {
	const [leaveGamePopoverVisible, setLeaveGamePopoverVisible] = useState(
		false
	);

	return (
		<Popover
			color="#14162E"
			overlayClassName="leave-game-popover"
			placement="bottomLeft"
			title="Leave the game?"
			visible={leaveGamePopoverVisible}
			onVisibleChange={setLeaveGamePopoverVisible}
			content={
				<div>
					<p style={{marginBottom: 24}}>
						Your game progress will not be saved.
					</p>
					<Row end="xs" style={{margin: 0}}>
						<Button
							style={{marginRight: 16}}
							ghost
							type="primary"
							onClick={() => setLeaveGamePopoverVisible(false)}
						>
							Cancel
						</Button>
						<Button
							ghost
							type="primary"
							onClick={() => props.goBack()}
						>
							Leave
						</Button>
					</Row>
				</div>
			}
			trigger="click"
		>
			<Button
				className="back-text-button btn-on-stars"
				ghost
				type="primary"
				icon={<ArrowLeftOutlined />}
			>
				Back
			</Button>
			<Button
				className="back-icon-button icon-btn btn-on-stars"
				size="large"
				icon={<ArrowLeftOutlined />}
			/>
		</Popover>
	);
}

export default BackButton;
