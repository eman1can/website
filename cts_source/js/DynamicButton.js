import React from "react";
import {Button} from "antd";

function DynamicButton(props) {
	return (
		<>
			<Button
				className={[
					props.forDesktop && "how-to-play-text-button",
					"btn-on-stars"
				]}
				ghost
				type="primary"
				onClick={props.onClick}
				icon={props.icon}
			>
				{props.label}
			</Button>
			{props.forDesktop && props.showIconWhenDesktopHidden === true && (
				<Button
					className="how-to-play-icon-button icon-btn btn-on-stars"
					size="large"
					onClick={props.onClick}
					icon={props.icon}
				/>
			)}
		</>
	);
}

export default DynamicButton;
