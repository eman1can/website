import React from "react";
import {Row, Col} from "react-flexbox-grid";
import {Descriptions, Button} from "antd";
import {QuestionCircleOutlined} from "@ant-design/icons";

function StatsGrid(props) {
	return (
		<Row className="game-row">
			<Col lg={12} md={12} sm={12} xs={12}>
				<Descriptions
					size="small"
					column={{xs: 2, sm: 2, md: 2, lg: 3}}
				>
					<Descriptions.Item label="Stars Found">
						<span>{props.starsFound}</span>
					</Descriptions.Item>
					<Descriptions.Item label="Films Found">
						<span>{props.filmsFound}</span>
					</Descriptions.Item>
					<Descriptions.Item label="My Best Path">
						<Row className="game-row">
							<Col>
								{props.bestPath
									? props.bestPath.distance / 2
									: "???"}
							</Col>
							{props.bestPath && (
								<Col
									style={{
										flexGrow: 1,
										display: "flex",
										flexDirection: "column",
										justifyContent: "center"
									}}
								>
									<Button
										className="inline-button"
										size={props.isMobile && "small"}
										type="link"
										onClick={props.onBestPathButtonClick}
										icon={<QuestionCircleOutlined />}
									/>
								</Col>
							)}
						</Row>
					</Descriptions.Item>
				</Descriptions>
			</Col>
		</Row>
	);
}
export default StatsGrid;
