package net.rafael.web.control.network.packet.out

import net.rafael.web.control.network.document.Document
import net.rafael.web.control.network.packet.Packet

//------------------------------
//
// This class was developed by Rafael K.
// On 2/3/2022 at 4:58 PM
// In the project WebControl
//
//------------------------------

class PacketOutCreateAccountAnswer(result: Boolean) : Packet(3, Document().append("result", result)) {}