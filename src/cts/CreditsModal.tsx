import React from "react";

import { Modal } from "antd";
import ModalRow from "./ModalRow";
import { find } from "../utils";
import SocialMediaRow from "./SocialRow";


type CreditCardProps = {
    name: string,
    role: string,
    photo: React.JSX.Element,
    social: React.JSX.Element
}

const CreditCard = ({role, name, photo, social}: CreditCardProps) => {
    return (
        <div className="credit-card">
            <p
                style={{paddingTop: 30, paddingBottom: 30}}
                className="modal-heading"
            >
                {`- ${role} -`}
            </p>
            {photo}
            <p className="modal-title">{name}</p>
            <div style={{paddingTop: 22, paddingBottom: 36}}>
                {social}
            </div>
        </div>
    );
}

type CreditsModalProps = {
    visible: boolean,
    onCancel: (() => void)
}
const CreditsModal = ({visible, onCancel}: CreditsModalProps) => {
    return (
        <Modal
            open={visible}
            onCancel={onCancel}
            footer={null}
            centered
            width={700}
        >
            <ModalRow paddingBottom={16} title="Credits" />
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyItems: 'center',
            }}>
                <CreditCard
                    role="Product & Development"
                    name="Eric Bai"
                    photo={
                        <img
                            style={{height: 70}}
                            src={find('assets/cts', 'eric.jpg')}
                            alt="Eric"
                        />
                    }
                    social={
                        <SocialMediaRow
                            size={24}
                            website="https://ericbai.co/"
                            twitter="https://twitter.com/BaiEric"
                            letterboxd="https://letterboxd.com/ericbai/"
                        />
                    }
                />
                <CreditCard
                    role="Design"
                    name="Amanda Hum"
                    photo={
                        <img
                            style={{height: 70}}
                            src={find('assets/cts', 'amanda.jpg')}
                            alt="Amanda"
                        />
                    }
                    social={
                        <SocialMediaRow
                            size={24}
                            website="https://www.amandahum.com/"
                            twitter="https://twitter.com/amandajhum"
                            letterboxd="https://letterboxd.com/ahum/"
                        />
                    }
                />
                <CreditCard
                    role="Development"
                    name="Ethan Wolfe"
                    photo={
                        <img
                            style={{height: 70}}
                            src={find('assets/cts', 'amanda.jpg')}
                            alt="Ethan"
                        />
                    }
                    social={
                        <SocialMediaRow
                            size={24}
                            website="https://www.ethan-wolfe.com/"
                            letterboxd="https://letterboxd.com/ewolfe/"
                        />
                    }
                />
            </div>
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
                            src={find('assets/cts', 'tmdb_logo.svg')}
                            alt="TMDb logo"
                        />
                    </a>
                }
                heading={"Connect the Stars uses the TMDb API but is not endorsed or certified by TMDb."}
            />
        </Modal>
    );
}

export default CreditsModal;