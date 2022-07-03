package net.rafael.web.control.network.packet.output

import net.rafael.web.control.network.document.Document
import net.rafael.web.control.network.packet.Packet

//------------------------------
//
// This class was developed by Rafael K.
// On 2/3/2022 at 4:58 PM
// In the project WebControl
//
//------------------------------

class PacketOutRequestSessionAnswer : Packet {

    constructor(session: String) : super(2, Document().append("result", true).append("session", session)) {

    }

    constructor() : super(2, Document().append("result", false)) {

    }

}