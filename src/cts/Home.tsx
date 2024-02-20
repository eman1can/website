import React, { useEffect, useState } from "react";
import Lobby from "./Lobby";
import HowToPlayModal from "./HowToPlayModal";
import { GameData } from "./types";
import getResumeModal from "./ResumePlayModal";
import Cytoscape from "../cts/Cytoscape";
import Modal from "../elements/Modal";
import { PageContentProps } from "../pages/Page";

const Home = (props: Readonly<PageContentProps>) => {
    const [showHowToPlay, setShowHowToPlay] = useState(false);
    const [showResume, setShowResume] = useState<boolean>(false);


}

export default Home;