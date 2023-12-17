import React from "react";
import {Modal} from "antd";

import ModalRow from "./ModalRow";

import Close from "./assets/close.svg";
import HowTo1 from "./assets/how-to-1.svg";
import HowTo2 from "./assets/how-to-2.svg";
import HowTo3 from "./assets/how-to-3.svg";

function HowToPlayModal(props) {
	return (
		<Modal
			closeIcon={<img alt="Close" src={Close} />}
			visible={props.visible}
			onCancel={props.onCancel}
			footer={null}
			centered
			width={500}
		>
			<ModalRow title="How to Play" />
			<ModalRow
				prefix={<img style={{height: 30}} alt="Goal" src={HowTo1} />}
				heading="- The Goal -"
				body="Figure out how two movie stars are connected through their films."
			/>
			<ModalRow
				prefix={<img style={{height: 24}} alt="Goal" src={HowTo2} />}
				heading="- Expand your board -"
				body="Build new connections by typing the names of movies & stars connected to the ones already in your board."
			/>
			<ModalRow
				prefix={<img style={{height: 27}} alt="Goal" src={HowTo3} />}
				heading="- Connect the Stars -"
				body="Challenge yourself to find the shortest path!"
			/>
		</Modal>
	);
}

export default HowToPlayModal;
