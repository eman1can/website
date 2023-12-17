import React from "react";
import {Modal} from "antd";
import {Grid, Row, Col} from "react-flexbox-grid";

import ModalRow from "../ModalRow";
import Zodiac from "./Zodiac";
import SocialMediaRow from "./SocialMediaRow";

import Eric from "../assets/eric-credit.svg";
import Amanda from "../assets/amanda-credit.svg";
import Close from "../assets/close.svg";
import TMDblogo from "../assets/tmdb-logo.svg";

function CreditCard(props) {
	return (
		<div className="credit-card">
			<p
				style={{paddingTop: 30, paddingBottom: 30}}
				className="modal-heading"
			>
				{`- ${props.role} -`}
			</p>
			{props.photo}
			<p className="modal-title">{props.name}</p>
			<div style={{paddingTop: 12}}>{props.zodiac}</div>
			<div style={{paddingTop: 22, paddingBottom: 36}}>
				{props.socialMedia}
			</div>
		</div>
	);
}

function CreditsModal(props) {
	return (
		<Modal
			closeIcon={<img alt="Close" src={Close} />}
			visible={props.visible}
			onCancel={props.onCancel}
			footer={null}
			centered
			width={700}
		>
			<ModalRow style={{paddingBottom: 16}} title="Credits" />
			<Grid style={{padding: "0px 26px 32px"}}>
				<Row center="xs">
					<Col>
						<CreditCard
							role="Product & Development"
							name="Eric Bai"
							photo={
								<img
									style={{height: 70}}
									src={Eric}
									alt="Eric"
								/>
							}
							zodiac={<Zodiac zodiac="Gemini" />}
							socialMedia={
								<SocialMediaRow
									size={24}
									website="https://ericbai.co/"
									twitter="https://twitter.com/BaiEric"
									letterboxd="https://letterboxd.com/ericbai/"
								/>
							}
						/>
					</Col>
					<Col>
						<CreditCard
							role="Design"
							name="Amanda Hum"
							photo={
								<img
									style={{height: 70}}
									src={Amanda}
									alt="Amanda"
								/>
							}
							zodiac={<Zodiac zodiac="Pisces" />}
							socialMedia={
								<SocialMediaRow
									size={24}
									website="https://www.amandahum.com/"
									twitter="https://twitter.com/amandajhum"
									letterboxd="https://letterboxd.com/ahum/"
								/>
							}
						/>
					</Col>
				</Row>
			</Grid>
			<ModalRow
				paddingBottom={24}
				paddingTop={20}
				maxWidth={300}
				prefix={
					<a
						href="https://themoviedb.org"
						rel="noopener noreferrer"
						target="_blank"
					>
						<img
							style={{width: 80, marginBottom: 8}}
							src={TMDblogo}
							alt="TMDb logo"
						/>
					</a>
				}
				heading={
					<>
						Connect the Stars uses the TMDb API but is not endorsed
						or certified by TMDb.
					</>
				}
			/>
		</Modal>
	);
}

export default CreditsModal;
