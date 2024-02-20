import { useState } from "react";
import CreditsModal from "./CreditsModal";
import Button from "../elements/Button";

type CreditsSectionProps = {
    scale: string
}

const CreditsSection = ({scale}: CreditsSectionProps) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    return (<div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyItems: 'center',
    }}>
        {/*<div style={{*/}
        {/*    display: 'flex',*/}
        {/*    flexDirection: 'row',*/}
        {/*    alignItems: 'center',*/}
        {/*    justifyItems: 'center',*/}
        {/*}}>*/}
        {/*    <div className={`credit-line akkurat ${scale}`}>*/}
        {/*        {"By "}*/}
        {/*        <a*/}
        {/*            className="credit-link"*/}
        {/*            rel="noopener noreferrer"*/}
        {/*            href="https://twitter.com/BaiEric"*/}
        {/*            target="_blank"*/}
        {/*        >*/}
        {/*            Eric Bai*/}
        {/*        </a>*/}
        {/*        {", "}*/}
        {/*        <a*/}
        {/*            className="credit-link"*/}
        {/*            rel="noopener noreferrer"*/}
        {/*            href="https://www.amandahum.com/"*/}
        {/*            target="_blank"*/}
        {/*        >*/}
        {/*            Amanda Hum*/}
        {/*        </a>*/}
        {/*        {" and "}*/}
        {/*        <a*/}
        {/*            className="credit-link"*/}
        {/*            rel="noopener noreferrer"*/}
        {/*            href="https://www.ethan-wolfe.com/"*/}
        {/*            target="_blank"*/}
        {/*        >*/}
        {/*            Ethan Wolfe*/}
        {/*        </a>*/}
        {/*    </div>*/}
        {/*</div>*/}
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyItems: 'center',
        }}>
            <Button scale={scale} onClick={() => setShowModal(true)}>— Credits —</Button>
        </div>
    </div>);
}

export default CreditsSection;