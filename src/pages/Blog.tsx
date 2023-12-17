import {Col, Row, Typography} from "antd";
import Navbar from "../elements/Navbar";
import find from "../utils";

type InsertProps = {
    src: string;
    alt: string;
    caption: string;
    anchor: 'left' | 'right';
    height?: string;
    width?: string;
}

const Insert = ({src, alt, caption, anchor, height, width}: InsertProps) => {
    return (<Col style={{display: 'inline-block', float: anchor, maxWidth: width, margin: '0 25px 0 25px'}}>
        <Row><img src={src} alt={alt} style={{height: height}}/></Row>
        <Row><p className="caption">{caption}</p></Row>
    </Col>);
}

const assets: string = 'assets/blog/sensor-networks';

function Blog() {
    return (<div>
        <Navbar/>
        <Col xs={20} md={15} lg={12} xl={12} style={{margin: 'auto', paddingTop: '50px'}}>
            <Row justify="center">
                <h1 className="title-h1">Sensor Networks</h1>
            </Row>
            <Row justify="center">
                <h2 className="title-h2">The Smart Home, the Environment, and Industry</h2>
            </Row>
            <Row justify="center">
                <Typography>
                    <p><span className="drop-cap">W</span>with the Christmas season fast approaching, more and more
                        items are being added to wish lists. Among the toys, utensils, and gadgets, you might find
                        household sensors. If you don't know what those are, you've probably already heard of them. One
                        of the most recognizable sensors for your home is a smart doorbell.</p>

                    <Insert src={find(assets, 'doorbells.jpg')} anchor='right'
                            caption='Figure 1. Video doorbells are becoming very common [1]'
                            alt='Statistics about doorbell sales'
                    />

                    <p>With almost 12 million video enabled doorbells sold in 2021 alone, you've likely seen many videos
                        posted online of things that people have seen remotely<span className="footnote">[1]</span>.
                        While not exactly a sensor itself, a sensor is any small gadget that collects data about its
                        surroundings or state. For a video doorbell, this would be any motion that it might detect, or
                        if the doorbell button has been pressed. Video doorbells are just one example of a household
                        sensor</p>
                    <p>Various other types of sensors can also be found in households. HVAC often incorporates
                        temperature and humidity sensors to regulate indoor climate. Security systems rely on motion and
                        entry sensors as their fundamental components. In irrigation or garden systems, you'll
                        frequently encounter light, water, and rain level sensors. There are other types of sensors
                        outside of these systems too, such as carbon monoxide sensors and occupancy sensors.</p>
                    <p>It is important to keep in mind however, that these are still examples of sensors themselves, and
                        just having a variety of them inside your home does not mean that you have a sensor network. A
                        sensor network is a collection of sensors that are all connected to each other, and work in
                        tandem for a purpose. That purpose may be just giving you information about your house
                        environment, but commonly, many different networks exist in the house at the same time. Going
                        back to the different systems mentioned—HVAC, Security, and Irrigation—they can all be said to
                        have sensor networks that power them.</p>
                    <p>While a smaller home may only have one or two temperature sensors powering the HVAC system, if
                        you think about the apartment complex down the street, or the dream mansion you want, this
                        number expands, with all of the sensors working together to achieve a purpose. For HVAC, that's
                        informing the condenser when to turn on and off, and where to direct the cold or warm air. As
                        technology improves and our lives become increasingly connected, our household systems are too.
                        Instead of many different systems comprising their own sensor networks, many homes are starting
                        to have one network that is comprised of all the senors, from doorbells to irrigation
                        sensors.</p>

                    <Insert src={find(assets, 'connectivity.png')} anchor='right' height='300px' width='500px'
                            caption='Figure 2. Different Network Standards [2]'
                            alt='Statistics about IoT connectivity'
                    />

                    <h4 className="title-h4">The Smart Home</h4>

                    <p>Similar to other industries, there are many competing standards about how to connect all of these
                        sensors into a network. The most prevalent of these is wifi, likely due to the low barrier for
                        adoption as most families already have a wifi network. Another popular network type is
                        bluetooth, as it also allows for easy connection, and is easier for device manufacturers to
                        integrate into small devices. Some sensors, designed to be places in remote areas, such as a
                        wildlife tracker or fire monitor, might make use of cellular for its long range, though
                        they require a data plan to be used. In contrast, Long Range Wide Area Networks, LoRaWAN for
                        short, also allow for long ranged communications, but without the need for a data plan, instead
                        utilizing gateway devices to connect the sensors together. There are many other alternative
                        network types, utilizing other network topologies, communication protocols, or security
                        measures, but these five give a good example for the different use cases.</p>
                    <p>Bluetooth networks, while having a higher theoretical range, is typically used as a shorter
                        range alternative to wifi networks, with the main attraction being the small amount of power
                        needed to transmit data in comparison to wifi. Looking at figure 2, you can see that the Rx/Tx
                        (Transmission) and power save consumption are much lower for bluetooth compared to wifi. Zigbee
                        is also generally used as an alternative to wifi, connecting smart devices and sensors within
                        personal homes and small spaces. It also boasts lower power consumption than wifi, and has the
                        benefit of isolating your devices on a separate network. Cellular and LoRaWAN networks are both
                        used for long range communications, with cellular being limited only by where cellular coverage
                        can be obtained, and LoRaWAN being limited by where you place accompanying gateways to
                        communicate with sensors. Another important consideration when talking about the range of
                        communication is the network topology utilized for communication.</p>

                    <Insert src={find(assets, 'mesh_networks.png')} anchor='right' height='250px' width='500px'
                            caption='Figure 3. Bluetooth Mesh Communication [3]'
                            alt='Mesh Topology Diagram'
                    />

                    <p>Wifi has the simplest network topology, named hub and spoke, where your router (the hub)
                        communicates with all of the devices on the network, and then passes that information onto where
                        it needs to go. While this is perfect for communication to the internet, if the user only wanted
                        to monitor the devices locally, it would take away bandwidth from other devices, as all of the
                        sensor data would be going through the router.</p>
                    <p>Bluetooth, while originally point to point or broadcast, now also supports mesh networks. An
                        example of point to point would be your phone communicating with the hydrometer directly, with
                        no other route. Broadcasting would be the hydrometer sending the packets to many different
                        monitoring devices on your network, such as phones or computers. A mesh network on the other
                        hand, allows for devices to communicate to each other, passing along messages to an end-point.
                        For example, all the temperature and hydrometers in a greenhouse could be connected together,
                        only needing a phone to connect to one to receive data. An diagram of this communication can be
                        seen in figure three. This also allows for bluetooth communication to be chained through quite a
                        large space in comparison to wifi which is centered around the router in a fixed range.</p>
                    <p>Zigbee utilizes three different topologies, star, tree, and mesh. Central to all communication
                        however is the concept of nodes, and coordinators. Nodes in this case would be the sensors that
                        are being connected to the zigbee network, and coordinators are hub devices that connect to
                        these sensors and either act as a hub where the information can be monitored, or as a
                        coordinator, passing information to other coordinator devices. In the simplest configuration,
                        star, the Zigbee enabled sensors are all connected to a single coordinator. In a tree topology,
                        multiple coordinators are introduced, but traffic is only allowed to flow through certain
                        devices to the main coordinator. In the last topology, the coordinators are all allowed to
                        communicate with each other, allowing the network to remain functioning if one of the
                        coordinators stops working.</p>

                    <Insert src={find(assets, 'star_of_stars_networks.jpg')} anchor='right' height='250px' width='500px'
                            caption='Figure 4. Star of Stars Communication [6]'
                            alt='Star of Stars Topology Diagram'
                    />

                    <p>Cellular can be though of similar to Wifi, as hub and spoke, as all the sensors will need to
                        connect to the cellular network, which will then route the information to your phone or
                        computer. LoWaRAN on the other hand utilizes a star of stars topology. In this topology, the
                        sensors are connected to gateways, which are then connected to a central hub that collects the
                        sensor information. In practice, this central hub is generally a cloud or other server
                        infrastructure that uses a wired, cellular, or wifi connection to communicate with the LoWaRan
                        devices. There are also public LoWaWAN networks available, allowing end users to skip the
                        expensive setup of their own gateways. <span className="footnote">[5]</span></p>
                    <p>Overall however, the range and topology should considered when deciding to setup a sensor network
                        of your own. For a small house, garden, or other area, it might be most convenient to take
                        advantage of bluetooth or zigbee sensors due to their low power consumption and ease of use. For
                        a rural area, such as a farm or a large plot of land, it might be beneficial to take advantage
                        of cellular or LoRaWAN for their ability to communicate over long distances. Or, if buying a
                        sensor as a gift, it is important to take into consideration what network communication is
                        already is use and that any bought sensor would mesh well with the others. (Get it?)</p>
                    <p>Beyond just the range and connection ability of sensors is the security that the different
                        network types provide. Connecting sensors, especially ones that transmit sensitive information
                        such as a video camera to a public wifi networks. Zigbee, bluetooth, and other networks can help
                        to isolate sensors from public networks, although every communication type has its weakness.
                        While all have the ability for encryption, not all sensors will utilize encryption themselves,
                        so it's important to do research before making important decisions. Ring doorbells for example,
                        communicated with no encryption until late 2022, allowing bad actors to easily access the
                        devices <span className="footnote">[7]</span>. Personally, I have used a smart plug that had no
                        encryption and sent the password with no hashing or discretion. Bluetooth itself has been shown
                        to have many different security vulnerabilities, and there are countless others being found
                        across all the network types that sensors use <span className="footnote">[8]</span>. Then best
                        course of action is to stay aware of the data that is being communicated by the sensors, and the
                        efforts that the manufactures of sensors are taking to keep that information private.</p>

                    <h4 className="title-h4">The Environment</h4>

                    <p>Beyond the smart home however, sensor networks have started to play important roles in helping
                        researchers monitor wildlife populations, migration tracking, and ecosystem monitoring. Realtime
                        sensor data allows for realtime graphs and monitoring without the need for expensive studies,
                        and also allows for compounded research, giving access to machine learning and other tools that
                        can help to see emerging patterns in nature <span className="footnote">[9]</span>. Sensors
                        networks have also helped in agriculture, giving farmers better access to data about crops,
                        soil quality, and weather conditions <span className="footnote">[10]</span>. They have also
                        given the ability to monitor forests and other large areas for wildfires, allowing officials to
                        respond quickly to either limit or monitor the situation <span className="footnote">[11]</span>.
                    </p>

                    <h4 className="title-h4">The Dangers</h4>

                    <p>Not all sensor networks are helping your home and beyond. Many governments have started to
                        incorporate sensor networks as a part of increased surveillance. In Busan, South Korea, a smart
                        city has emerged, powered by a sensor network that gives not only the residents information
                        about their lives, but sends all of the information to the Korean Ministry of Land, Industry
                        and Transport. Information such as their heartreate, how they slept, what kind of food is in
                        their fridge, and even how clean their house it. Beyond the pledged efficiency, health, and
                        other goals, is a terrifying vision among reports of hacked IoT devices that emerge every day.
                        <span className="footnote">[12]</span></p>

                    <p>Beyond just the collection and the distribution of this sensitive data is actions that can be
                        taken because of it, something that the Chinese authorities are exercising in their cities. A
                        vast network of connected sensors gives the Chinese government the ability to almost instantly
                        obtain the location, and even past activities of any citizen, a scary precedent.<span
                        className="footnote">[13]</span> Even closer to home, the UK is creating a similar sensor
                        network that also allows them to monitor their citizens and even their web traffic.<span
                        className="footnote">[14]</span></p>

                    <p>As large sensor networks become ever more prevalent, in both our homes and in our lives, we need
                        to keep in mind the security and access of sensitive data, as well as the need to be collecting
                        that data in the first place. Only a person and their doctor should need to see sensor
                        information relating to their current health and medical conditions. Video cameras, presence
                        monitors, and motion detectors collect sensitive information about our movements and
                        whereabouts, and while it may be important to know who committed a crime, there should be no
                        reason that the government is tracking your every move.</p>

                    <h4 className="title-h4">Things to keep in mind</h4>

                    <p>In conclusion, in the creation of both small and large sensor networks, it is important to keep
                        in mind both the reasons that the sensors are being obtained, where they are being deployed, and
                        who has access to the resulting data. When buying a smart sensor for a family member, remember
                        to keep in mind any sensors they might already have, as well as any disposition they may have to
                        sensors, such as cameras, or presence monitors. It is also important to look into the companies
                        and brands that you are buying the sensors from to ensure that the specific sensor being
                        obtained is the best one for the situation.</p>

                </Typography>
            </Row>
            <Row>
                <Typography>
                    <h3 className="title-h3">References</h3>
                    <p><span className="bold">1.</span> Narcotta, Jack. "Strategy Analytics: Amazon's Ring Remained atop
                        the Video Doorbell Market in 2021." Business Wire, 22 June 2023, https://www.businesswire.com/
                        news/home/20220622005023/en/Strategy-Analytics-Amazons-Ring-Remained-atop-the-Video-Doorbell-
                        Market-in-2021</p>
                    <p><span className="bold">2.</span> Ho, Nhu. "What Is IoT Connectivity: A Comparison Guide." EMnify
                        Blog, 28 Apr. 2023, https://www.emnify.com/blog/iot-connectivity</p>
                    <p><span className="bold">3.</span> Arar, Dr. Steve. "An Introduction to Bluetooth Mesh Networking."
                        All About Circuits, 03 Apr. 2022, https://www.allaboutcircuits.com/technical-articles/introduct
                        ion-to-bluetooth-ble-mesh-networking/</p>
                    <p><span className="bold">4.</span> P. Cope, J. Campbell and T. Hayajneh, "An investigation of
                        Bluetooth security vulnerabilities," 2017 IEEE 7th Annual Computing and Communication Workshop
                        and Conference (CCWC), Las Vegas, NV, USA, 2017, pp. 1-7, doi: 10.1109/CCWC.2017.7868416</p>
                    <p><span className="bold">5.</span> Neeson, Emma. "What Is a LoRaWAN Gateway?" Wyld Networks Blog,
                        https://wyldnetworks.com/blog/what-is-a-lorawan-gateway</p>
                    <p><span className="bold">6.</span> Riegsecker, Austin. (2017). Measuring Environmental Effects on
                        LoRa Radios in Cold Weather Using 915 MHz</p>
                    <p><span className="bold">7.</span> Ilevičius, Paulius. "Ring hacked: Doorbell and camera security
                        issues." NordVPN Blog, 30 Mar. 2023, https://nordvpn.com/blog/ring-doorbell-hack/</p>
                    <p><span className="bold">8.</span> Sponås, Jon Gunnar. "Things You Should Know About Bluetooth
                        Range." Nordic Semiconductor Blog, 25 Jan. 2023, https://blog.nordicsemi.com/getconnected/things
                        -you-should-know-about-bluetooth-range</p>
                    <p><span className="bold">9.</span> "Geolocation-Enabled IoT Solutions for Wildlife Tracking and
                        Conservation." Utilities One, https://utilitiesone.com/geolocation-enabled-iot-solutions-for-
                        wildlife-tracking-and-conservation</p>
                    <p><span className="bold">10.</span> "Internet of Things in Agriculture: What is IoT and how is it
                        implemented in agriculture?" CropIn Technology Solutions, https://www.cropin.com/iot-in-agricul
                        ture</p>
                    <p><span className="bold">11.</span> Chirp. "IoT Technology: Transforming Wildfire Management for a
                        Safer Future." Medium, 8 Jun, https://chirpiot.medium.com/iot-technology-transforming-wildfire-
                        management-for-a-safer-future-d5cb640082cf</p>
                    <p><span className="bold">12.</span> Belcher, David. "A New City, Built Upon Data, Takes Shape in
                        South Korea." The New York Times, 28 Mar. 2022, https://www.nytimes.com/2022/03/28/technology/
                        eco-delta-smart-village-busan-south-korea.html</p>
                    <p><span className="bold">13.</span> Mozur, Paul, and Aaron Krolik. "A Surveillance Net Blankets
                        China’s Cities, Giving Police Vast Powers." The New York Times, 17 Dec. 2019, https://www.
                        nytimes.com/2019/12/17/technology/china-surveillance.html</p>
                    <p><span className="bold">14.</span> Burgess, Matt. "The UK’s Secretive Web Surveillance Program Is
                        Ramping Up." Wired, https://www.wired.com/story/internet-connection-records-uk-surveillance/</p>
                </Typography>
            </Row>
        </Col>
    </div>);
}

export default Blog;