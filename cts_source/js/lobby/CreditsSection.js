import React, {useState} from "react";
import {Grid, Row, Col} from "react-flexbox-grid";
import {Button} from "antd";
import KofiButton from "./../KofiButton";
import CreditsModal from "./CreditsModal";

function CreditsSection() {
	const [showCredits, setShowCredits] = useState(false);
	return (
		<>
			<Grid fluid style={{marginBottom: 35, flexShrink: 0}}>
				<Row center="xs">
					<Col>
						<h3 className="credit-line">
							By{" "}
							<a
								className="credit-link"
								rel="noopener noreferrer"
								href="https://twitter.com/BaiEric"
								target="_blank"
							>
								Eric Bai
							</a>{" "}
							and{" "}
							<a
								className="credit-link"
								rel="noopener noreferrer"
								href="https://www.amandahum.com/"
								target="_blank"
							>
								Amanda Hum
							</a>
						</h3>
					</Col>
				</Row>
				<Row center="xs">
					<Col>
						<Button
							type="text"
							onClick={() => setShowCredits(true)}
						>
							- Credits -
						</Button>
					</Col>
				</Row>
				<Row center="xs">
					<KofiButton />
				</Row>
			</Grid>
			<CreditsModal
				visible={showCredits}
				onCancel={() => setShowCredits(false)}
			/>
		</>
	);
}

export default CreditsSection;
